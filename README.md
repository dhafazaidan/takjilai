# 🌙 TakjilAI

> Mulai bisnis takjil Ramadan dalam 5 menit dengan bantuan AI.

TakjilAI adalah platform berbasis AI yang membantu siapa saja memulai bisnis takjil Ramadan tanpa pengalaman bisnis sebelumnya. Cukup masukkan lokasi, modal, dan kategori produk — AI akan merekomendasikan produk terbaik, harga jual, estimasi margin, dan langsung menghasilkan halaman toko online siap pakai dengan integrasi pembayaran Mayar.

---

## ✨ Fitur

- **AI Business Plan Generator** — Rekomendasi 3 produk takjil berdasarkan lokasi, modal, dan kategori
- **Review & Kustomisasi** — Penjual bisa hapus produk yang tidak sesuai, edit harga, dan minta saran baru dari AI
- **Halaman Toko Siap Pakai** — Store page dengan daftar produk dan tombol checkout
- **Integrasi Mayar** — Pembeli diarahkan ke payment link Mayar milik penjual
- **Proyeksi Pendapatan** — Simulasi estimasi pendapatan berdasarkan produk aktif

---

## 🛠 Tech Stack

| Layer      | Teknologi               |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | TailwindCSS             |
| AI         | Google Gemini API       |
| Payment    | Mayar                   |
| Deployment | Vercel                  |

---

## 🚀 Cara Setup Lokal

### 1. Clone repository

```bash
git clone https://github.com/username-kamu/takjilai.git
cd takjilai
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Setup environment variables

```bash
cp .env.local.example .env.local
```

Isi file `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Dapatkan API key di [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Jalankan development server

```bash
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 📁 Struktur Folder

```
takjilai/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── generate/
│   │   ├── page.tsx              # Form input bisnis
│   │   └── result/
│   │       └── page.tsx          # Hasil rekomendasi AI
│   ├── store/
│   │   └── page.tsx              # Halaman toko
│   └── api/
│       └── generate-plan/
│           └── route.ts          # API route → Gemini
├── components/
│   ├── BusinessForm.tsx          # Form input dengan validasi
│   └── LoadingOverlay.tsx        # Animasi loading AI
├── lib/
│   └── gemini.ts                 # Integrasi Gemini API
├── types/
│   └── business.ts               # TypeScript types
└── .env.local.example            # Template environment variables
```

---

## 🔑 Environment Variables

| Variable         | Deskripsi                     | Required |
| ---------------- | ----------------------------- | -------- |
| `GEMINI_API_KEY` | API key dari Google AI Studio | ✅       |

---

## 🌊 User Flow

```
Landing Page (/)
    ↓
Form Input (/generate)
[lokasi, modal, kategori, Mayar link]
    ↓
AI Generate via Gemini API
    ↓
Review & Kustomisasi (/generate/result)
[toggle produk, edit harga, segarkan saran]
    ↓
Halaman Toko (/store)
[pilih produk, lihat total]
    ↓
Bayar dengan Mayar
[redirect ke payment link penjual]
```

---

## 🗺 Roadmap

- [ ] Shareable URL per toko (tanpa sessionStorage)
- [ ] Integrasi Mayar API untuk generate invoice dinamis per pesanan
- [ ] Dashboard penjual dengan data transaksi real dari Mayar
- [ ] Persistent storage per seller
- [ ] Multi-language support (EN/ID)

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/)
- [Mayar](https://mayar.id) — Payment gateway Indonesia
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)

---

Built with ❤️ for Ramadan Hackathon
