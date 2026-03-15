import BusinessForm from "@/components/BusinessForm";

export default function GeneratePage() {
  return (
    <main className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌙</div>
          <h1 className="text-2xl font-extrabold text-amber-900">
            Setup Bisnis Takjilmu
          </h1>
          <p className="text-amber-600 text-sm mt-1">
            Isi data di bawah, AI kami siapkan semuanya
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-amber-100">
          <BusinessForm />
        </div>
      </div>
    </main>
  );
}