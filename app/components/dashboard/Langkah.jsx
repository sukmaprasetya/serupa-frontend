"use client";

import Link from "next/link";
import Image from "next/image";

const JENIS_ABK = [
  { id: "Autis",       label: "Autisme",     warna: "#7c3aed", border: "#e9d5ff" },
  { id: "Tunagrahita", label: "Tunagrahita", warna: "#b45309", border: "#fde68a" },
  { id: "Tunarungu",   label: "Tunarungu",   warna: "#0e7490", border: "#a5f3fc" },
  { id: "Tunanetra",   label: "Tunanetra",   warna: "#0f766e", border: "#99f6e4" },
  { id: "Tunadaksa",   label: "Tunadaksa",   warna: "#be123c", border: "#fecdd3" },
];

const IKON_LANGKAH = {
  1: "/img/book.png",
  2: "/img/library.png",
  3: "/img/star.png",
};

function IkonLangkah({ nomor }) {
  const src = IKON_LANGKAH[nomor];
  if (!src) return <div className="w-8 h-8 bg-gray-200 rounded-lg" />;
  
  return (
    <div className="relative w-9 h-9">
      <Image 
        src={src} 
        alt={`Ikon Langkah ${nomor}`} 
        fill 
        className="object-contain"
      />
    </div>
  );
}

export default function LangkahSection() {
  return (
    <section id="langkah" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-black tracking-[0.3em] uppercase text-green-600 mb-4">
            Cara Penggunaan
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            3 Langkah Menuju Metode yang Tepat
          </h2>
          <div className="w-16 h-1 bg-green-500 mx-auto rounded-full mb-6" />
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed font-medium">
            SERUPA dirancang agar orang tua dapat dengan mudah menemukan
            pendekatan pembelajaran yang sesuai untuk buah hati tercinta.
          </p>
        </div>

        {/* Langkah 01 */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm shadow-green-900/5">
              <IkonLangkah nomor={1} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold tracking-widest uppercase text-green-600">Langkah 01</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Identifikasi Kebutuhan Anak</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                Kenali karakteristik unik anak Anda melalui basis pengetahuan kami. 
                Pilih kategori di bawah ini untuk mempelajari jenis kebutuhan khusus secara lebih mendalam.
              </p>
            </div>
          </div>

          {/* Grid jenis ABK */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {JENIS_ABK.map((j) => (
              <Link
                key={j.id}
                href="/fitur/edukasi"
                className="group border rounded-2xl px-5 py-6 flex flex-col gap-3 transition-all duration-300 bg-white hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1"
                style={{ borderColor: j.border }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = j.warna}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = j.border}
              >
                <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: j.warna }} />
                <p className="text-base font-bold text-gray-800 leading-snug">{j.label}</p>
                <span
                  className="text-xs font-semibold flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-all"
                  style={{ color: j.warna }}
                >
                  Pelajari
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-20" />

        {/* Langkah 02 + 03 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Langkah 02 */}
          <div className="flex flex-col justify-between gap-6 bg-gray-50/40 p-8 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:shadow-md duration-300">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                <IkonLangkah nomor={2} />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-green-600 block mb-2">Langkah 02</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Telusuri Katalog Metode</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Jelajahi berbagai metode pembelajaran yang telah tervalidasi dalam basis pengetahuan ontologi SERUPA.
                </p>
              </div>
            </div>
            <Link
              href="/fitur/katalog"
              className="inline-flex items-center justify-center gap-2.5 border border-gray-200 text-gray-700 text-sm font-bold px-6 py-3.5 rounded-xl hover:border-gray-900 hover:text-gray-950 transition-all bg-white shadow-sm"
            >
              Buka Katalog Metode
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Langkah 03 */}
          <div className="flex flex-col justify-between gap-6 bg-gray-50/40 p-8 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:shadow-md duration-300">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                <IkonLangkah nomor={3} />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-green-600 block mb-2">Langkah 03</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Dapatkan Rekomendasi Cerdas</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Gunakan algoritma SAW untuk menemukan metode yang paling relevan dengan kondisi unik buah hati Anda.
                </p>
              </div>
            </div>
            <Link
              href="/fitur/rekomendasi"
              className="inline-flex items-center justify-center gap-2.5 text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-md group"
              style={{ backgroundColor: "#0F741B" }}
            >
              Mulai Rekomendasi
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}