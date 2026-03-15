"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeneratedBusinessPlan, ProductIdea } from "@/lib/gemini";

// ---- Product Card ----

function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: {
  product: ProductIdea;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-4 flex items-center gap-4 shadow-sm">
      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
        🍱
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-amber-900 text-sm leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-orange-500 font-extrabold text-base mt-0.5">
          Rp {product.price.toLocaleString("id-ID")}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            + Pesan
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold transition-colors"
            >
              -
            </button>
            <span className="w-5 text-center font-bold text-amber-900 text-sm">
              {quantity}
            </span>
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Page ----

export default function StorePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<GeneratedBusinessPlan | null>(null);
  const [mayarLink, setMayarLink] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const rawPlan = sessionStorage.getItem("businessPlan");
    const rawLink = sessionStorage.getItem("mayarLink");

    if (!rawPlan || !rawLink) {
      router.replace("/");
      return;
    }
    try {
      const parsed: GeneratedBusinessPlan = JSON.parse(rawPlan);
      setPlan(parsed);
      setMayarLink(rawLink);
      const init: Record<string, number> = {};
      parsed.products.forEach((p) => (init[p.name] = 0));
      setQuantities(init);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!plan) {
    return (
      <main className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-amber-400 animate-pulse">Memuat toko...</p>
      </main>
    );
  }

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = plan.products.reduce(
    (sum, p) => sum + p.price * (quantities[p.name] ?? 0),
    0
  );

  const handlePayWithMayar = () => {
    window.open(mayarLink, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-amber-50">
      {/* Store Header */}
      <div className="bg-orange-500 px-4 pt-12 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl">🌙</div>
          <div className="absolute top-2 right-6 text-5xl">⭐</div>
          <div className="absolute bottom-4 left-1/3 text-4xl">✨</div>
        </div>
        <div className="relative z-10">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-2xl font-extrabold text-white leading-tight">
            {plan.storeName}
          </h1>
          <p className="text-orange-100 text-sm mt-1">
            Takjil segar, siap pesan sekarang!
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 -mt-6 pb-40">
        <div className="bg-amber-50 rounded-3xl pt-5 space-y-3">
          <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-widest px-1">
            Menu Takjil
          </h2>

          {plan.products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              quantity={quantities[product.name] ?? 0}
              onAdd={() =>
                setQuantities((q) => ({
                  ...q,
                  [product.name]: (q[product.name] ?? 0) + 1,
                }))
              }
              onRemove={() =>
                setQuantities((q) => ({
                  ...q,
                  [product.name]: Math.max(0, (q[product.name] ?? 0) - 1),
                }))
              }
            />
          ))}

          <p className="text-center text-xs text-amber-400 pt-2 pb-1">
            Tersedia setiap hari selama Ramadan 🌙
          </p>
        </div>
      </div>

      {/* Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 px-4 pt-3 pb-5 shadow-xl">
        <div className="max-w-lg mx-auto space-y-2">
          {totalItems > 0 && (
            <div className="flex justify-between text-sm text-amber-700 px-1">
              <span>{totalItems} item dipilih</span>
              <span className="font-bold">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          )}

          <button
            onClick={handlePayWithMayar}
            disabled={totalItems === 0}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-md"
          >
            {totalItems === 0 ? (
              "Pilih produk dulu"
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Bayar dengan Mayar &middot; Rp {totalPrice.toLocaleString("id-ID")}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            Powered by{" "}
            <a
              href="https://mayar.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-400 hover:text-blue-600 transition-colors"
            >
              Mayar
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}