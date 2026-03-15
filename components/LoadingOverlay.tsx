"use client";

const STEPS = [
  "Menganalisis lokasi jualanmu...",
  "Menghitung peluang pasar takjil...",
  "Memilih produk terbaik untukmu...",
  "Menyusun rencana bisnis...",
  "Hampir selesai!",
];

export default function LoadingOverlay({ step }: { step: number }) {
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const progress = Math.min(((step + 1) / STEPS.length) * 100, 95);

  return (
    <div className="fixed inset-0 z-50 bg-amber-50 flex flex-col items-center justify-center px-6">
      {/* Pulsing moon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-orange-300 opacity-30 animate-ping scale-150" />
        <div className="relative text-6xl animate-bounce">🌙</div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-extrabold text-amber-900 text-center mb-1">
        AI sedang membangun bisnis takjilmu...
      </h2>
      <p className="text-sm text-amber-500 text-center mb-8 min-h-[20px] transition-all duration-300">
        {current}
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs bg-amber-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 bg-orange-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-amber-400 mt-2">{Math.round(progress)}%</p>
    </div>
  );
}