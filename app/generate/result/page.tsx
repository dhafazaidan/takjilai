"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeneratedBusinessPlan, ProductIdea } from "@/lib/gemini";
import { BusinessInput } from "@/types/business";

const MAX_PRODUCTS = 3;

// ---- Types ----

interface EditableProduct extends ProductIdea {
  id: string;
  editedPrice: number;
  isEditingPrice: boolean;
  removing: boolean; // triggers fade-out animation
}

// ---- Margin Badge ----

function MarginBadge({ margin }: { margin: number }) {
  const color =
    margin >= 50
      ? "bg-green-100 text-green-700"
      : margin >= 30
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-600";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {margin}% margin
    </span>
  );
}

// ---- Editable Product Card ----

function ProductCard({
  product,
  onRemove,
  onPriceChange,
}: {
  product: EditableProduct;
  onRemove: () => void;
  onPriceChange: (price: number) => void;
}) {
  const estimatedCost = Math.round(product.editedPrice * (1 - product.margin / 100));

  return (
    <div
      className={`rounded-2xl border bg-white border-amber-100 p-5 shadow-sm transition-all duration-300 ${
        product.removing
          ? "opacity-0 scale-95 -translate-x-4"
          : "opacity-100 scale-100 translate-x-0"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* Uncheck = remove */}
          <button
            onClick={onRemove}
            className="w-7 h-7 rounded-full border-2 bg-orange-500 border-orange-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-red-400 hover:border-red-400 transition-colors duration-150"
            title="Hapus produk ini"
          >
            ✓
          </button>
          <h3 className="font-bold text-base leading-tight text-amber-900">
            {product.name}
          </h3>
        </div>
        <MarginBadge margin={product.margin} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs text-amber-500 mb-1">Harga Jual</p>
          {product.isEditingPrice ? (
            <input
              type="number"
              autoFocus
              value={product.editedPrice}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              onBlur={() => onPriceChange(product.editedPrice)}
              className="w-full text-sm font-bold text-amber-900 bg-white border border-orange-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          ) : (
            <div className="flex items-center justify-between">
              <p className="font-bold text-amber-900 text-sm">
                Rp {product.editedPrice.toLocaleString("id-ID")}
              </p>
              <button
                onClick={() => onPriceChange(product.editedPrice)}
                className="text-xs text-orange-400 hover:text-orange-600 underline ml-1"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
        <div className="bg-orange-50 rounded-xl p-3">
          <p className="text-xs text-orange-400 mb-0.5">Est. Modal/pcs</p>
          <p className="font-bold text-orange-700 text-sm">
            Rp {estimatedCost.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <p className="text-xs text-amber-600 leading-relaxed border-t border-amber-50 pt-3">
        💡 {product.reason}
      </p>
    </div>
  );
}

// ---- Revenue Simulator ----

interface Order {
  id: number;
  product: string;
  price: number;
  time: string;
}

function RevenueSimulator({ products }: { products: EditableProduct[] }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [flash, setFlash] = useState(false);

  const simulateOrder = () => {
    if (products.length === 0) return;
    const random = products[Math.floor(Math.random() * products.length)];
    const now = new Date();
    const time = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const newOrder: Order = {
      id: Date.now(),
      product: random.name,
      price: random.editedPrice,
      time,
    };
    setOrders((prev) => [newOrder, ...prev].slice(0, 5));
    setTotalRevenue((prev) => prev + random.editedPrice);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-amber-800 mb-4">📊 Proyeksi Pendapatan</h3>
      <div
        className={`rounded-xl p-4 mb-4 text-center transition-colors duration-300 ${
          flash ? "bg-green-100" : "bg-amber-50"
        }`}
      >
        <p className="text-xs text-amber-500 mb-0.5">Estimasi Pendapatan Hari Ini</p>
        <p
          className={`text-2xl font-extrabold transition-colors duration-300 ${
            flash ? "text-green-600" : "text-amber-900"
          }`}
        >
          Rp {totalRevenue.toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-amber-400 mt-0.5">{orders.length} porsi terjual (simulasi)</p>
      </div>
      <button
        onClick={simulateOrder}
        disabled={products.length === 0}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed active:scale-95 text-white font-bold py-3 rounded-xl transition-all duration-150 shadow-sm mb-4"
      >
        + Simulasi 1 Porsi Terjual
      </button>
      {orders.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
            Log Simulasi
          </p>
          {orders.map((order, i) => (
            <div
              key={order.id}
              className={`flex items-center justify-between text-xs py-2 px-3 rounded-lg ${
                i === 0 ? "bg-green-50 border border-green-100" : "bg-amber-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {i === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                )}
                <span className="text-amber-800 font-medium truncate max-w-[140px]">
                  {order.product}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-bold text-orange-600">
                  +Rp {order.price.toLocaleString("id-ID")}
                </span>
                <span className="text-amber-400">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Page ----

export default function GenerateResultPage() {
  const router = useRouter();
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [storeName, setStoreName] = useState("");
  const [showSuccess, setShowSuccess] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("businessPlan");
    if (!raw) { router.replace("/"); return; }
    try {
      const plan: GeneratedBusinessPlan = JSON.parse(raw);
      setStoreName(plan.storeName);
      setProducts(
        plan.products.map((p, i) => ({
          ...p,
          id: `${p.name}-${i}`,
          editedPrice: p.price,
          isEditingPrice: false,
          removing: false,
        }))
      );
    } catch {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (!storeName) return;
    const t = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [storeName]);

  if (!storeName) {
    return (
      <main className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-amber-400 animate-pulse">Memuat rencana bisnis...</p>
      </main>
    );
  }

  const activeCount = products.filter((p) => !p.removing).length;
  const emptySlots = MAX_PRODUCTS - activeCount;

  const avgMargin =
    products.reduce((sum, p) => sum + p.margin, 0) / (products.length || 1);
  const minPrice = products.length
    ? Math.min(...products.map((p) => p.editedPrice))
    : 0;

  // Trigger fade-out then remove from list after animation
  const handleRemove = (id: string) => {
    // Mark as removing → triggers CSS transition
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, removing: true } : p))
    );
    // Remove from list after animation completes (300ms)
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }, 300);
  };

  const handlePriceChange = (id: string, price: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, editedPrice: price || p.editedPrice, isEditingPrice: !p.isEditingPrice }
          : p
      )
    );
  };

  const handleRefresh = async () => {
    if (emptySlots === 0) return;

    const rawInput = sessionStorage.getItem("businessInput");
    if (!rawInput) return;

    const businessInput: BusinessInput = JSON.parse(rawInput);
    const excludeProducts = products.map((p) => p.name);

    setRefreshing(true);
    setRefreshError(null);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...businessInput,
          count: emptySlots,
          excludeProducts,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyegarkan saran.");
      }

      const newProducts: EditableProduct[] = json.data.products.map(
        (p: ProductIdea, i: number) => ({
          ...p,
          id: `${p.name}-new-${Date.now()}-${i}`,
          editedPrice: p.price,
          isEditingPrice: false,
          removing: false,
        })
      );

      setProducts((prev) => [...prev, ...newProducts]);
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleConfirm = () => {
    const finalPlan: GeneratedBusinessPlan = {
      storeName,
      products: products.map((p) => ({ ...p, price: p.editedPrice })),
    };
    sessionStorage.setItem("businessPlan", JSON.stringify(finalPlan));
    router.push("/store");
  };

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-10">

      {/* Success Banner */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4 pointer-events-none">
          <div className="bg-green-500 text-white rounded-2xl px-6 py-4 shadow-xl flex items-center gap-3 animate-bounce">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-extrabold text-sm">Toko Takjilmu Siap!</p>
              <p className="text-green-100 text-xs">Your Takjil Store is Ready</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto space-y-6">

        {/* Store Header */}
        <div className="text-center pt-4">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-3xl font-extrabold text-amber-900 leading-tight">
            {storeName}
          </h1>
          <p className="text-amber-500 text-sm mt-1">
            Review dan sesuaikan produkmu sebelum toko dibuka
          </p>
        </div>

        {/* Summary Strip */}
        <div className="bg-orange-500 rounded-2xl p-4 flex justify-around text-white">
          <div className="text-center">
            <p className="text-xs opacity-80">Produk Aktif</p>
            <p className="text-xl font-extrabold">
              {activeCount}/{MAX_PRODUCTS}
            </p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-xs opacity-80">Avg. Margin</p>
            <p className="text-xl font-extrabold">{Math.round(avgMargin)}%</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-xs opacity-80">Harga Mulai</p>
            <p className="text-xl font-extrabold">
              Rp {minPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Product Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
              Rekomendasi AI
            </h2>
            <p className="text-xs text-amber-400">
              Klik ✓ untuk hapus produk
            </p>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={() => handleRemove(product.id)}
                onPriceChange={(price) => handlePriceChange(product.id, price)}
              />
            ))}
          </div>

          {/* Segarkan Saran */}
          {emptySlots > 0 && (
            <div className="mt-3">
              {refreshError && (
                <p className="text-xs text-red-500 mb-2 text-center">⚠️ {refreshError}</p>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-amber-300 hover:border-orange-400 bg-white hover:bg-orange-50 text-amber-600 hover:text-orange-600 font-semibold py-3 rounded-2xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    AI sedang mencari saran baru...
                  </>
                ) : (
                  <>🔄 Segarkan Saran ({emptySlots} slot kosong)</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Revenue Simulator */}
        <RevenueSimulator products={products.filter((p) => !p.removing)} />

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleConfirm}
            disabled={activeCount === 0}
            className="w-full text-center bg-orange-500 hover:bg-orange-600 disabled:bg-amber-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-md transition-all duration-200"
          >
            {activeCount === 0
              ? "Tambah minimal 1 produk dulu"
              : `🛍️ Buka Toko dengan ${activeCount} Produk`}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("businessPlan");
              sessionStorage.removeItem("businessInput");
              sessionStorage.removeItem("mayarLink");
              router.push("/");
            }}
            className="w-full text-center text-amber-500 hover:text-amber-700 text-sm font-medium py-2 transition-colors"
          >
            ← Mulai dari awal
          </button>
        </div>

      </div>
    </main>
  );
}