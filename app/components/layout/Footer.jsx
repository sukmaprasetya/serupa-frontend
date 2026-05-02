"use client";

import Link from "next/link";

const NAVIGASI = [
  {
    grup: "Fitur Utama",
    items: [
      { label: "Rekomendasi Metode",  href: "/fitur/rekomendasi" },
      { label: "Katalog Pembelajaran", href: "/fitur/katalog"     },
      { label: "Riwayat Pencarian",   href: "/fitur/riwayat"     },
    ],
  },
  {
    grup: "Informasi",
    items: [
      { label: "Edukasi ABK",   href: "/fitur/edukasi" },
      { label: "Tentang SERUPA", href: "/fitur/tentang" },
    ],
  },
  {
    grup: "Jenis ABK",
    items: [
      { label: "Autisme",     href: "/fitur/edukasi" },
      { label: "Tunagrahita", href: "/fitur/edukasi" },
      { label: "Tunarungu",   href: "/fitur/edukasi" },
      { label: "Tunanetra",   href: "/fitur/edukasi" },
      { label: "Tunadaksa",   href: "/fitur/edukasi" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0a5214] text-white overflow-hidden">
      {/* Aksen atas */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent"/>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/img/logo.png" alt="SERUPA Logo" className="h-12 w-auto"/>
            </div>
            <p className="text-sm text-green-100/70 leading-relaxed max-w-sm">
              SERUPA adalah platform cerdas berbasis Ontologi yang membantu orang tua memberikan
              pendidikan terbaik bagi Anak Berkebutuhan Khusus melalui rekomendasi metode yang dipersonalisasi.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                <span className="text-[11px] uppercase tracking-wider font-bold text-green-100">SAW Algorithm</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
                <span className="text-[11px] uppercase tracking-wider font-bold text-green-100">Ontology Based</span>
              </div>
            </div>
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {NAVIGASI.map((nav) => (
              <div key={nav.grup} className="space-y-5">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-green-300/80">
                  {nav.grup}
                </h4>
                <ul className="space-y-3">
                  {nav.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}
                        className="text-sm text-green-100/60 hover:text-white hover:translate-x-1 flex items-center gap-2 transition-all duration-300 group">
                        <span className="w-0 h-[1px] bg-green-400 group-hover:w-3 transition-all duration-300"/>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-green-100/50">
            © 2026 SERUPA — Solusi Edukasi Anak Berkebutuhan Khusus.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold text-green-100/40 uppercase tracking-tighter">Powered by:</span>
            <p className="text-[10px] text-green-100/40 font-mono italic">Next.js · Flask · RDFlib · Tailwind · SAW</p>
          </div>
        </div>
      </div>
    </footer>
  );
}