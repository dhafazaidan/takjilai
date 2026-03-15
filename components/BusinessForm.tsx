"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BusinessInput, ProductCategory } from "@/types/business";
import LoadingOverlay from "./LoadingOverlay";

const CATEGORIES: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: "minuman", label: "Minuman", emoji: "🥤" },
  { value: "gorengan", label: "Gorengan", emoji: "🍟" },
  { value: "kolak", label: "Kolak", emoji: "🍲" },
  { value: "kue", label: "Kue & Jajanan", emoji: "🍮" },
  { value: "es", label: "Es & Dessert", emoji: "🧊" },
  { value: "lainnya", label: "Lainnya", emoji: "✨" },
];

function isValidMayarUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith("mayar.to");
  } catch {
    return false;
  }
}

export default function BusinessForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const stepInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [form, setForm] = useState<BusinessInput>({
    location: "",
    capital: 0,
    category: "minuman",
    mayarLink: "",
  });

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      stepInterval.current = setInterval(() => {
        setLoadingStep((s) => Math.min(s + 1, 4));
      }, 1400);
    } else {
      if (stepInterval.current) clearInterval(stepInterval.current);
    }
    return () => {
      if (stepInterval.current) clearInterval(stepInterval.current);
    };
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.capital) return;

    if (!isValidMayarUrl(form.mayarLink)) {
      setError("Payment link harus berformat https://mayar.to/username");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal generate. Coba lagi ya!");
      }

      // Simpan business plan, input asli, dan mayar link
      sessionStorage.setItem("businessPlan", JSON.stringify(json.data));
      sessionStorage.setItem("businessInput", JSON.stringify(form));
      sessionStorage.setItem("mayarLink", form.mayarLink);
      router.push("/generate/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const mayarValid = isValidMayarUrl(form.mayarLink);
  const canSubmit = !loading && form.location && form.capital && mayarValid;

  return (
    <>
      {loading && <LoadingOverlay step={loadingStep} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-1.5">
            📍 Lokasi Jualan
          </label>
          <input
            type="text"
            placeholder="Contoh: Depok, Jawa Barat"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-amber-900 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Capital */}
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-1.5">
            💰 Modal Awal (Rp)
          </label>
          <input
            type="number"
            placeholder="Contoh: 150000"
            value={form.capital || ""}
            onChange={(e) => setForm({ ...form, capital: Number(e.target.value) })}
            required
            min={10000}
            className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-amber-900 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          {form.capital > 0 && (
            <p className="text-xs text-amber-500 mt-1">
              Rp {form.capital.toLocaleString("id-ID")}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-2">
            🍴 Kategori Produk
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm({ ...form, category: cat.value })}
                className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                  form.category === cat.value
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-amber-100 bg-white text-amber-600 hover:border-amber-300"
                }`}
              >
                <span className="text-xl mb-1">{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mayar Payment Link */}
        <div>
          <label className="block text-sm font-semibold text-amber-800 mb-1.5">
            💳 Mayar Payment Link
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://mayar.to/username"
              value={form.mayarLink}
              onChange={(e) => setForm({ ...form, mayarLink: e.target.value })}
              required
              className={`w-full px-4 py-3 pr-10 rounded-xl border bg-white text-amber-900 placeholder-amber-300 focus:outline-none focus:ring-2 transition ${
                form.mayarLink && !mayarValid
                  ? "border-red-300 focus:ring-red-300"
                  : form.mayarLink && mayarValid
                  ? "border-green-300 focus:ring-green-300"
                  : "border-amber-200 focus:ring-orange-400"
              }`}
            />
            {form.mayarLink && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {mayarValid ? "✅" : "❌"}
              </span>
            )}
          </div>
          {form.mayarLink && !mayarValid ? (
            <p className="text-xs text-red-500 mt-1">
              URL harus berformat https://mayar.to/username
            </p>
          ) : (
            <p className="text-xs text-amber-400 mt-1">
              Dapatkan link dari{" "}
              <a
                href="https://mayar.id"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-600"
              >
                dashboard Mayar
              </a>{" "}
              kamu
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-amber-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          ✨ Generate Bisnis Takjil
        </button>
      </form>
    </>
  );
}