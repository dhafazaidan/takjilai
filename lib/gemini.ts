import { BusinessInput } from "@/types/business";

// ---- Types ----

export interface ProductIdea {
  name: string;
  price: number;
  margin: number;
  reason: string;
}

export interface GeneratedBusinessPlan {
  storeName: string;
  products: ProductIdea[];
}

// ---- Prompt ----

function buildPrompt(
  input: BusinessInput,
  count: number,
  excludeProducts: string[]
): string {
  const excludeClause =
    excludeProducts.length > 0
      ? `\nJangan rekomendasikan produk-produk berikut karena sudah dipilih sebelumnya: ${excludeProducts.join(", ")}.`
      : "";

  return `
Kamu adalah konsultan bisnis takjil Ramadan yang berpengalaman.

Seorang pengusaha ingin memulai bisnis takjil dengan informasi berikut:
- Lokasi: ${input.location}
- Modal awal: Rp ${input.capital.toLocaleString("id-ID")}
- Kategori produk yang diminati: ${input.category}
${excludeClause}

Tugasmu:
1. Rekomendasikan tepat ${count} produk takjil yang berbeda dan cocok untuk dijual di lokasi tersebut.
2. Sesuaikan dengan modal yang dimiliki.
${count === 3 ? "3. Berikan nama toko yang menarik dan relevan." : "3. Gunakan storeName kosong karena ini hanya tambahan produk."}

Balas HANYA dengan JSON valid (tanpa markdown, tanpa backtick, tanpa penjelasan tambahan).
Pastikan JSON lengkap dan valid sampai kurung kurawal penutup terakhir.

Format JSON yang harus dikembalikan:
{
  "storeName": "${count === 3 ? "Nama Toko Kreatif" : ""}",
  "products": [
    {
      "name": "Nama Produk",
      "price": 5000,
      "margin": 40,
      "reason": "Alasan singkat kenapa produk ini cocok"
    }
  ]
}

Aturan:
- Kembalikan tepat ${count} produk, tidak lebih tidak kurang
- "price" adalah harga jual dalam Rupiah (angka bulat)
- "margin" adalah persentase keuntungan (angka 0-100)
- "reason" maksimal 5 kata, dalam Bahasa Indonesia
- Pastikan total modal cukup untuk memulai semua produk
- Nama toko dalam Bahasa Indonesia, singkat dan catchy
- Balas HANYA dengan JSON, tanpa teks apapun di luar JSON
`.trim();
}

// ---- Response Parser ----

function parseResponse(raw: string): GeneratedBusinessPlan {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed.products)) {
    throw new Error("Invalid response shape from Gemini");
  }

  const products: ProductIdea[] = parsed.products.map((p: unknown) => {
    const product = p as Record<string, unknown>;
    if (!product.name || !product.price || !product.margin || !product.reason) {
      throw new Error("Incomplete product data from Gemini");
    }
    return {
      name: String(product.name),
      price: Number(product.price),
      margin: Number(product.margin),
      reason: String(product.reason),
    };
  });

  return {
    storeName: String(parsed.storeName ?? ""),
    products,
  };
}

// ---- Main Function ----

export async function generateBusinessPlan(
  input: BusinessInput,
  count: number = 3,
  excludeProducts: string[] = []
): Promise<GeneratedBusinessPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt = buildPrompt(input, count, excludeProducts);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();

  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) throw new Error("Empty response from Gemini");

  return parseResponse(rawText);
}