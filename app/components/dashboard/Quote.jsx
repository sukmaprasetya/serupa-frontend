"use client";

import Link from "next/link";

export default function QuoteSection() {
  return (
    <section className="py-28 px-6 bg-green-50/50 relative overflow-hidden">
      {/* Ornamen Latar Belakang Halus */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Tanda petik dekoratif besar */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 text-[180px] font-serif leading-none select-none pointer-events-none text-green-700/5"
        >
          &ldquo;
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10">
          {/* Garis aksen hijau */}
          <div className="w-12 h-1 bg-green-700 rounded-full" />

          {/* Quote dengan font yang lebih elegan */}
          <blockquote className="text-2xl md:text-3xl font-medium leading-[1.6] text-green-900 tracking-tight italic px-4">
            Langkah kecil hari ini adalah awal kemandirian mereka di masa depan.
            <span className="block mt-4 md:inline md:mt-0">
              {" "}SERUPA hadir memberikan dukungan tulus, karena setiap anak berhak atas
              kesempatan yang sama untuk tumbuh, belajar, dan bercahaya dengan caranya sendiri.
            </span>
          </blockquote>

          {/* Atribusi */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-bold uppercase tracking-widest text-green-800">
              — SERUPA —
            </p>
            <p className="text-xs font-medium text-green-700/70">
              Sistem Edukasi Rekomendasi Untuk Pembelajaran ABK
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
            <Link
              href="/fitur/rekomendasi"
              className="group inline-flex items-center justify-center gap-2 bg-[#0F741B] text-white text-sm font-bold px-10 py-4 rounded-2xl hover:bg-[#0a5214] transition-all shadow-xl shadow-green-900/10 active:scale-95"
            >
              Mulai Sekarang
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              href="/fitur/edukasi"
              className="inline-flex items-center justify-center gap-2 border-2 border-green-700/20 text-green-800 text-sm font-bold px-10 py-4 rounded-2xl transition-all hover:bg-green-100/50 hover:border-green-700/40"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}