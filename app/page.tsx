import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-300 rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-xl">
        {/* Icon */}
        <div className="text-6xl mb-6">🌙</div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-amber-900 leading-tight mb-3">
          TakjilAI
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-amber-700 mb-2 font-medium">
          Powered by AI · Untuk Ramadan Kamu
        </p>

        {/* Description */}
        <p className="text-amber-600 mb-10 text-sm leading-relaxed">
          Masukkan modal, lokasi, dan kategori produkmu — AI kami akan
          merekomendasikan produk takjil terbaik, harga jual, dan membuat
          halaman toko siap pakai.
        </p>

        {/* CTA Button */}
        <Link
          href="/generate"
          className="inline-block bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          🚀 Mulai Bisnis Takjil Kamu
        </Link>

        {/* Footer note */}
        <p className="mt-8 text-xs text-amber-400">
          Gratis · Tanpa daftar · Langsung jalan
        </p>
      </div>
    </main>
  );
}