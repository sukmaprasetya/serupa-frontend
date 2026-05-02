"use client";

import { useState } from "react";
import Link from "next/link";
import { DATA_EDUKASI, DAFTAR_JENIS } from "../../lib/edukasiData";

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">{children}</p>
  );
}

function DaftarBernomor({ items, warna }) {
  return (
    <div className="flex flex-col gap-5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: warna }}>{i + 1}</span>
          <div>
            <p className="text-base font-semibold text-gray-800 mb-1">{item.judul}</p>
            <p className="text-sm text-gray-600 leading-relaxed text-justify">{item.isi}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EdukasiPage() {
  const [aktif, setAktif] = useState(DAFTAR_JENIS[0]?.id || ""); // Tambahkan optional chaining
  const data = DATA_EDUKASI[aktif];

  // Jika data tidak ditemukan
  if (!data) {
    return <div className="p-20 text-center">Memuat data edukasi...</div>;
  }
  
  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <div className="py-14 px-6 text-center bg-white">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-green-100 bg-green-50">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-green-600">
            Pusat Informasi
          </span>
        </div>

        {/* Judul */}
        <h1
          className="mb-3"
          style={{
            fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 700,
            color: "#1a2e1a",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          <span className="text-green-600">Edukasi</span> ABK
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-8">
          Kenali jenis-jenis kebutuhan khusus anak mulai dari definisi, ciri-ciri, tingkatan,
          kebutuhan pembelajaran, dan peran orang tua di rumah.
        </p>

        {/* Tab Fitur — di atas garis aksen */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {DAFTAR_JENIS.map((j) => {
            const aktifTab = aktif === j.id;
            return (
              <button
                key={j.id}
                onClick={() => setAktif(j.id)}
                className="flex items-center gap-2.5 text-sm font-semibold transition-all duration-200"
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: `2px solid ${aktifTab ? j.warna : "#e5e7eb"}`,
                  backgroundColor: aktifTab ? j.warna : "#ffffff",
                  color: aktifTab ? "#ffffff" : "#6b7280",
                  boxShadow: aktifTab ? `0 4px 14px ${j.warna}33` : "none",
                }}
              >
                <span>{j.label}</span>
              </button>
            );
          })}
        </div>

        {/* Garis aksen hijau — setelah tombol */}
        <div className="flex justify-center">
          <div
            className="rounded-full"
            style={{ width: 200, height: 3, backgroundColor: "#16a34a" }}
          />
        </div>

      </div>

      {data && (
        <div className="max-w-5xl mx-auto w-full px-6 py-10 flex-1">

          {/* Gambar + Definisi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 mb-12">
            {/* Bagian Kiri: Gambar (Statis agar tidak flickr) */}
            <div className="relative h-72 md:h-auto">
                <img 
                src={data.gambar || "/img/hero.jpg"} 
                alt={data.label}
                className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
                <div className="absolute bottom-5 left-5">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: data.bg }}>{data.emoji}</div>
                    <div>
                    <p className="text-white font-bold text-lg leading-none">{data.label}</p>
                    <p className="text-white/70 text-xs mt-0.5">
                        {data.labelPanjang.match(/\(([^)]+)\)/)?.[1] || ""}
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* Bagian Kanan: Teks dengan Animasi Transisi */}
            <div 
                key={aktif} 
                className="p-7 flex flex-col justify-center gap-4 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <SectionLabel>Definisi</SectionLabel>
                
                {/* Tagline */}
                <p className="italic text-gray-500 text-sm leading-relaxed border-b border-gray-50 pb-2">
                "{data.tagline}"
                </p>

                {/* Deskripsi */}
                <p className="text-sm leading-relaxed border-l-2 pl-5 text-gray-700 text-justify"
                style={{ borderColor: data.warna }}>
                {data.definisi}
                </p>
            </div>
            </div>

          {/* Tingkatan */}
          <section className="mb-12">
            <SectionLabel>Tingkatan</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.tingkat.map((t, i) => (
                <div key={i} className="rounded-2xl p-5 border"
                  style={{ backgroundColor: data.bg, borderColor: data.border }}>
                  <p className="text-sm font-bold mb-2" style={{ color: data.warna }}>{t.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">{t.deskripsi}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ciri-ciri + Kebutuhan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <section>
              <SectionLabel>Ciri-Ciri yang Perlu Dikenali</SectionLabel>
              <DaftarBernomor items={data.ciriCiri} warna={data.warna}/>
            </section>
            <section>
              <SectionLabel>Kebutuhan Pembelajaran</SectionLabel>
              <DaftarBernomor items={data.kebutuhanBelajar} warna={data.warna}/>
            </section>
          </div>

          {/* Peran Orang Tua */}
          <section className="mb-12">
            <SectionLabel>Peran Orang Tua di Rumah</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.peranOrtu.map((p, i) => (
                <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-5">
                  <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: data.warna }}>{i + 1}</span>
                  <div>
                    <p className="text-base font-semibold text-gray-800 mb-1">{p.judul}</p>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">{p.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sumber + CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <SectionLabel>Sumber Referensi</SectionLabel>
              <ul className="flex flex-col gap-2">
                {data.sumber.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                    <a href={s} target="_blank" rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 hover:underline break-all transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl p-6 border flex flex-col justify-between gap-4"
              style={{ backgroundColor: data.bg, borderColor: data.border }}>
              <div>
                <p className="text-base font-bold text-gray-800 mb-2">
                  Siap mencari metode untuk anak {data.label}?
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Jelajahi katalog metode pembelajaran atau dapatkan rekomendasi yang dipersonalisasi.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/fitur/katalog"
                  className="flex-1 text-center text-white text-sm font-bold px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: data.warna }}>
                  Katalog Metode
                </Link>
                <Link href="/fitur/rekomendasi"
                  className="flex-1 text-center text-sm font-bold px-4 py-3 rounded-lg border-2 hover:opacity-80 transition-opacity"
                  style={{ borderColor: data.warna, color: data.warna }}>
                  Rekomendasi
                </Link>
              </div>
            </section>
          </div>
        </div>
      )}
    </main>
  );
}