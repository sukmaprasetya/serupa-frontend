"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getInfoOntologi } from "../../lib/api";

// ── DATA ────────────────────────────────────────────────────

const SUMBER_DATA = [
  {
    kategori: "Wawancara Pakar",
    deskripsi: "Konsultasi dan wawancara langsung dengan guru SLB Negeri 1 Badung untuk memahami metode pembelajaran efektif.",
    ikon: "/img/group.png",
  },
  {
    kategori: "Modul Kemendikdasmen",
    deskripsi: "Referensi kurikulum resmi sebagai landasan ilmiah penyusunan metode pembelajaran.",
    ikon: "/img/book.png",
  },
];

const TEKNOLOGI = [
  {
    nama: "Protégé 5.6.3",
    peran: "Ontologi",
    deskripsi: "Membangun dan validasi struktur ontologi OWL.",
    ikon: "/img/stack.png",
  },
  {
    nama: "Flask Python",
    peran: "Backend API",
    deskripsi: "Server API ringan untuk query ontologi dan kalkulasi SAW.",
    ikon: "/img/hosting.png",
  },
  {
    nama: "Algoritma SAW",
    peran: "Rekomendasi",
    deskripsi: "Perhitungan multi-kriteria untuk rekomendasi metode.",
    ikon: "/img/star.png",
  },
];

const STACK = [
  { nama: "Next.js",      peran: "Frontend",   deskripsi: "Framework modern dengan performa tinggi.", warna: "#111827" },
  { nama: "Tailwind CSS", peran: "Styling",     deskripsi: "Utility-first CSS responsif.",             warna: "#0891b2" },
  { nama: "Flask",       peran: "Backend",       deskripsi: "API Python untuk query ontologi dan logika SAW.", warna: "#0F741B" },
  { nama: "OWL/RDF",      peran: "Knowledge",   deskripsi: "Representasi data semantik.",              warna: "#7c3aed" },
];

const BATASAN = [
  {
    kode: "A",
    judul: "Kategori ABK",
    isi: "Penelitian difokuskan pada lima kategori hambatan anak berkebutuhan khusus (ABK), yaitu tunanetra, tunarungu, tunadaksa, tunagrahita, dan autisme.",
  },
  {
    kode: "B",
    judul: "Hambatan Tunggal",
    isi: "Sistem hanya memberikan rekomendasi untuk anak dengan hambatan tunggal (single disability) dan tidak mencakup anak dengan hambatan majemuk (multiple disabilities).",
  },
  {
    kode: "C",
    judul: "Privasi Data",
    isi: "Sistem tidak menyimpan atau memproses data identitas personal anak secara rinci.",
  },
  {
    kode: "D",
    judul: "Penggunaan Bahasa",
    isi: "Sistem saat ini disajikan dalam Bahasa Indonesia dan belum mendukung bahasa daerah serta bahasa isyarat.",
  },
    {
    kode: "E",
    judul: "Jenjang Pendidikan",
    isi: "Materi dan metode pembelajaran dibatasi pada kebutuhan pembelajaran mandiri untuk jenjang SMPLB dan SMALB.",
  },
    {
    kode: "F",
    judul: "Peran Sistem",
    isi: "Sistem dirancang sebagai alat bantu bagi orang tua dalam merencanakan pembelajaran mandiri di lingkungan rumah, bukan sebagai pengganti kurikulum sekolah formal.",
  },
];

// ── HELPER ──────────────────────────────────────────────────

function hitungJenisInduk(jenisAbkList) {
  if (!jenisAbkList || !Array.isArray(jenisAbkList)) return 5;
  const INDUK = ["Autis", "Tunagrahita", "Tunarungu", "Tunanetra", "Tunadaksa"];
  const ditemukan = new Set(
    jenisAbkList
      .map(j => INDUK.find(induk => j.includes(induk)))
      .filter(Boolean)
  );
  return ditemukan.size || 5;
}

// ── SUB-KOMPONEN ─────────────────────────────────────────────

function SectionLabel({ children, center = false }) {
  return (
    <p className={`text-xs font-bold tracking-widest uppercase text-green-600 mb-3 ${center ? "text-center" : ""}`}>
      {children}
    </p>
  );
}

// ── PAGE ────────────────────────────────────────────────────

export default function TentangPage() {
  // 1. Berikan nilai awal (initial state) yang masuk akal agar tidak langsung 0
  const [stat, setStat] = useState({
    totalMetode: 0,
    totalJenis: 0,
    totalJenjang: 0,
    totalMedia: 340
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInfoOntologi()
      .then((res) => {
        // Log untuk memastikan data yang diterima dari Flask benar
        console.log("Data API Info:", res);

        // Pastikan data yang diambil sesuai dengan struktur JSON dari Flask
        setStat({
          totalMetode:  res.total_metode || 243,
          totalJenis:   hitungJenisInduk(res.jenis_abk),
          // Perbaikan: Tambahkan pengecekan ekstra untuk array jenjang
          totalJenjang: Array.isArray(res.jenjang) && res.jenjang.length > 0 
                        ? res.jenjang.length 
                        : 6, 
          totalMedia:   res.total_media || 340,
        });
      })
      .catch((err) => {
        console.error("Gagal mengambil info ontologi:", err);
        // Fallback jika API error
        setStat({ totalMetode: 243, totalJenis: 5, totalJenjang: 6, totalMedia: 340 });
      })
      .finally(() => setLoading(false));
  }, []);

  const KARTU_ANGKA = [
    { nilai: loading ? "..." : stat.totalMetode,  label: "Metode Pembelajaran" },
    { nilai: loading ? "..." : stat.totalJenis,   label: "Jenis ABK" },
    { nilai: loading ? "..." : stat.totalJenjang, label: "Jenjang Pendidikan" },
    { nilai: loading ? "..." : stat.totalMedia,   label: "Media Belajar" },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div className="py-14 px-6 text-center bg-white">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-green-100 bg-green-50">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-green-600">
            Tentang SERUPA
          </span>
        </div>
        <h1
          className="mb-3"
          style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#0a1a0a", lineHeight: 1.2 }}
        >
          <span className="text-green-600">Tentang</span> Sistem
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed mb-6">
          Mengenal SERUPA lebih dekat sebagai Sistem Edukasi Rekomendasi untuk Pembelajaran ABK
        </p>
        <div className="flex justify-center">
          <div className="rounded-full" style={{ width: 200, height: 3, backgroundColor: "#16a34a" }} />
        </div>
      </div>

      {/* ── FILOSOFI ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <SectionLabel>Filosofi & Identitas</SectionLabel>
              <h2 className="text-2xl font-bold text-gray-900 mb-5 leading-tight">
                Mengapa Kami<br />Bernama SERUPA?
              </h2>
              <blockquote
                className="border-l-2 pl-5 text-gray-600 text-sm leading-relaxed italic mb-5"
                style={{ borderColor: "#0F741B" }}
              >
                "Nama SERUPA lahir dari sebuah keyakinan sederhana: bahwa meski setiap anak
                memiliki kebutuhan unik yang berbeda, mereka memiliki hak yang serupa untuk
                mendapatkan pendidikan terbaik."
              </blockquote>
              <p className="text-gray-500 text-sm leading-relaxed">
                Website ini dikembangkan untuk menjembatani keterbatasan informasi dalam
                menemukan metode belajar yang tepat bagi Anak Berkebutuhan Khusus (ABK).
                Dengan menggabungkan kekuatan ontologi semantik dan algoritma rekomendasi,
                SERUPA hadir sebagai panduan praktis yang dapat digunakan langsung oleh orang tua.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {KARTU_ANGKA.map(({ nilai, label }) => (
                <div key={label} className="border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition-shadow">
                  <p className="text-4xl font-bold mb-1" style={{ color: "#0F741B" }}>
                    {loading ? "—" : nilai}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BATASAN MASALAH ───────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-gray-100" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel center>Ruang Lingkup</SectionLabel>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Batasan Sistem</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              SERUPA dirancang untuk membantu orang tua, namun tetap memiliki beberapa batasan dalam penggunaannya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BATASAN.map((b) => (
              <div
                key={b.kode}
                className="bg-white border border-green-100 rounded-2xl p-5 flex gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Kode huruf sebagai aksen */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black"
                  style={{ backgroundColor: "#0F741B" }}
                >
                  {b.kode}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{b.judul}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{b.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUMBER DATA ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel center>Metodologi & Data</SectionLabel>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sumber Data yang Tervalidasi</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              Seluruh metode pembelajaran dalam basis pengetahuan SERUPA bersumber dari
              referensi akademik dan praktis yang terverifikasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {SUMBER_DATA.map((s) => (
              <div key={s.kategori}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <img src={s.ikon} alt={s.kategori} className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{s.kategori}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-10">
            <SectionLabel center>Teknologi yang Digunakan</SectionLabel>
            <h3 className="text-xl font-bold text-gray-900">Perangkat & Algoritma</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEKNOLOGI.map((t) => (
              <div key={t.nama}
                className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <img src={t.ikon} alt={t.nama} className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5">{t.nama}</p>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "#0F741B" }}>{t.peran}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK TEKNOLOGI ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel center>Arsitektur Sistem</SectionLabel>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Stack Teknologi</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              SERUPA dibangun di atas teknologi modern yang mendukung performa,
              aksesibilitas, dan eksplorasi data semantik secara efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {STACK.map((s) => (
              <div key={s.nama}
                className="flex items-start gap-4 border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: s.warna }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900">{s.nama}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border border-gray-200 text-gray-400 bg-gray-50">
                      {s.peran}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.deskripsi}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Alur sistem */}
          <div className="border border-gray-100 rounded-2xl p-7 bg-gray-50">
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-6 text-center">
              Alur Sistem
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {[
                ["Ontologi OWL", "Sumber pengetahuan"],
                ["rdflib",       "Parser RDF"],
                ["Flask API",       "Query engine"],
                ["SAW",          "Rekomendasi"],
                ["Next.js",      "Antarmuka"],
              ].map((item, i, arr) => (
                <div key={item[0]} className="flex items-center gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center min-w-[100px]">
                    <p className="text-xs font-bold text-gray-800">{item[0]}</p>
                    <p className="text-[10px] text-green-600 font-semibold mt-0.5">{item[1]}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <svg className="w-4 h-4 text-gray-300 shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATATAN AKADEMIK ──────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-gray-100" style={{ backgroundColor: "#f0fdf4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10">
            <div className="shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white border border-green-100 flex items-center justify-center shadow-sm">
                <img src="/img/study.png" alt="Akademik" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div>
              <SectionLabel>Latar Belakang Proyek</SectionLabel>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Atribusi Akademik</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Sistem SERUPA dikembangkan sebagai <strong>Tugas Akhir</strong> pada
                Program Studi Informatika, Fakultas Matematika dan Ilmu Pengetahuan Alam,
                Universitas Udayana tahun 2026.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ["Program Studi", "Informatika"],
                  ["Fakultas",      "FMIPA — Universitas Udayana"],
                  ["Jenis Karya",   "Tugas Akhir / Skripsi"],
                  ["Tahun",         "2026"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white border border-green-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Siap Mencoba SERUPA?</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Mulai temukan metode pembelajaran yang tepat untuk anak Anda sekarang juga.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fitur/rekomendasi"
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-7 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0F741B" }}>
              Dapatkan Rekomendasi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/fitur/katalog"
              className="inline-flex items-center gap-2 border-2 text-sm font-bold px-7 py-3.5 rounded-xl hover:opacity-80 transition-opacity"
              style={{ borderColor: "#0F741B", color: "#0F741B" }}>
              Lihat Katalog Metode
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}