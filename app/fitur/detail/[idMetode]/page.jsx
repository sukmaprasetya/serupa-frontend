"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getDetailMetode,
  getPrasyaratMetode,
  getMetodeTerkait,
  getMetodeLanjutan,
} from "../../../lib/api";
import {
  IconCheck, IconChevronDown, IconChevronRight, IconArrowRight,
  IconSearch, IconInfo, IconStar, IconAlertTriangle,
  IconPin, IconBook,
  IconCircleEmpty, IconCircleHalf, IconCircleFull,
} from "../../../components/icons";

const LABEL_JENJANG = {
  SMPLB_7:  "SMPLB Kelas 7",
  SMPLB_8:  "SMPLB Kelas 8",
  SMPLB_9:  "SMPLB Kelas 9",
  SMALB_1O: "SMALB Kelas 10",
  SMALB_11: "SMALB Kelas 11",
  SMALB_12: "SMALB Kelas 12",
};

// ── Parse "Berhasil: ... Hampir: ... Belum: ..." dari RDF ─────────────────
function parseKriteria(raw = "") {
  const r = { berhasil: "", hampir: "", belum: "" };
  if (!raw) return r;
  const b  = raw.match(/Berhasil\s*:\s*(.*?)(?=Hampir\s*:|Belum\s*:|$)/is);
  const h  = raw.match(/Hampir\s*:\s*(.*?)(?=Berhasil\s*:|Belum\s*:|$)/is);
  const bl = raw.match(/Belum\s*:\s*(.*?)(?=Berhasil\s*:|Hampir\s*:|$)/is);
  if (b)  r.berhasil = b[1].trim();
  if (h)  r.hampir   = h[1].trim();
  if (bl) r.belum    = bl[1].trim();
  return r;
}

// ── Atom: Badge ───────────────────────────────────────────────────────────
function Badge({ children, warna = "#0F741B", bg = "#f0fdf4", border = "#bbf7d0" }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full border"
      style={{ backgroundColor: bg, color: warna, borderColor: border }}>
      {children}
    </span>
  );
}

function SectionHeader({ children }) {
  return <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">{children}</p>;
}

function Spinner({ label = "Memuat..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <div className="w-4 h-4 border-[3px] rounded-full animate-spin"
        style={{ borderColor: "#0F741B", borderTopColor: "transparent" }} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

// ── Kartu satu item prasyarat ─────────────────────────────────────────────
function KartuPrasyarat({ p, nomor }) {
  return (
    <Link href={`/fitur/detail/${p.idMetode}`}
      className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:shadow-sm group"
      style={{ backgroundColor: "white", borderColor: "#e5e7eb" }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}>
        {nomor}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
          {p.namaMetode}
        </p>
        {p.durasiPembelajaran && (
          <p className="text-xs text-gray-400 mt-0.5">{p.durasiPembelajaran}</p>
        )}
      </div>
      <IconChevronRight size={15} color="#d1d5db" className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

// ── Urutan persiapan ──────────────────────────────────────────────────────
// Default: tampilkan hanya prasyarat LANGSUNG (kedalaman 1) agar tidak
// overwhelming. Rantai lengkap bisa dibuka dengan tombol "Lihat semua".
function UrutanPersiapan({ prasyaratList, loading }) {
  const [tampilSemua, setTampilSemua] = useState(false);

  if (loading) return <Spinner label="Mengecek persiapan..." />;

  const semua    = prasyaratList || [];
  const langsung = semua.filter(p => p.kedalaman === 1);
  const lainnya  = semua.filter(p => p.kedalaman >  1)
                        .sort((a, b) => b.kedalaman - a.kedalaman);

  if (semua.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#f0fdf4", border: "2px solid #86efac" }}>
            <IconCheck size={16} color="#0F741B" />
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-700">Cocok untuk berbagai tahap perkembangan</p>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Metode ini tidak memerlukan kemampuan khusus sebelumnya
          dan bisa langsung dicoba bersama anak.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 leading-relaxed mb-1">
        Metode ini direkomendasikan untuk anak yang idealnya sudah mengenal
        kemampuan berikut. Jika belum, tetap bisa dicoba — ini hanya gambaran 
        <strong className="text-gray-600"> jalur perkembangan</strong> yang biasanya mendahului metode ini:
      </p>

      {/* Prasyarat langsung — selalu tampil */}
      {langsung.map((p, i) => (
        <KartuPrasyarat key={p.idMetode} p={p} nomor={i + 1} />
      ))}

      {/* Rantai tambahan — collapsed by default */}
      {lainnya.length > 0 && (
        <>
          <button
            onClick={() => setTampilSemua(v => !v)}
            className="flex items-center gap-2 text-xs font-semibold mt-1 transition-colors"
            style={{ color: "#0F741B" }}>
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full border transition-transform"
              style={{
                borderColor: "#0F741B",
                transform: tampilSemua ? "rotate(180deg)" : "rotate(0deg)",
              }}>
              <IconChevronDown size={10} color="#0F741B" />
            </span>
            {tampilSemua
              ? "Sembunyikan kemampuan pendukung"
              : `Lihat ${lainnya.length} kemampuan pendukung lainnya`}
          </button>

          {tampilSemua && (
            <div className="flex flex-col gap-2 pl-4 border-l-2 border-dashed border-gray-200 mt-1">
              <p className="text-xs text-gray-400 mb-1">
                Kemampuan pendukung — anak yang sudah mengenal ini biasanya lebih cepat berkembang:
              </p>
              {lainnya.map((p, i) => (
                <KartuPrasyarat key={p.idMetode} p={p} nomor={`+${i + 1}`} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Konektor visual ke "metode ini" */}
      <div className="pl-3 py-0.5">
        <div className="w-0.5 h-4 bg-gray-200 rounded-full ml-2.5" />
      </div>
      <div className="flex items-center gap-3 rounded-xl border-2 px-4 py-3"
        style={{ borderColor: "#0F741B", backgroundColor: "#f0fdf4" }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#0F741B" }}>
          <IconCheck size={14} color="white" />
        </div>
        <p className="text-sm font-bold text-gray-800">Metode yang direkomendasikan untuk anak Anda</p>
      </div>
    </div>
  );
}

// ── Kartu status anak — 3 pilihan besar ───────────────────────────────────
function KartuStatusAnak({ status, kriteria, onStatusChange }) {
  // Icon sebagai komponen — disimpan di object bukan di JSX langsung
  // agar bisa dirender secara dinamis
  const opsi = [
    {
      key: "belum",
      Ikon: () => <IconCircleEmpty size={22} color="#9ca3af" />,
      judul: "Belum dicoba",
      desc: "Kami belum mencoba metode ini",
      aktifBorder: "#6b7280", aktifBg: "#f9fafb", textColor: "#374151",
    },
    {
      key: "hampir",
      Ikon: () => <IconCircleHalf size={22} color="#f59e0b" />,
      judul: "Sedang berproses",
      desc: "Sudah dicoba, anak belum konsisten",
      aktifBorder: "#f59e0b", aktifBg: "#fffbeb", textColor: "#92400e",
    },
    {
      key: "berhasil",
      Ikon: () => <IconCircleFull size={22} color="#0F741B" />,
      judul: "Berhasil dikuasai",
      desc: "Anak sudah bisa melakukan ini",
      aktifBorder: "#0F741B", aktifBg: "#f0fdf4", textColor: "#166534",
    },
  ];

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
        Pilih kondisi anak saat ini. Sistem akan memberikan panduan langkah selanjutnya.
      </p>

      {/* Tiga tombol pilihan */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {opsi.map((o) => {
          const aktif = status === o.key;
          return (
            <button key={o.key} onClick={() => onStatusChange(o.key)}
              className="flex flex-col items-center text-center gap-1.5 py-4 px-2 rounded-2xl border-2 transition-all"
              style={{
                borderColor:     aktif ? o.aktifBorder : "#e5e7eb",
                backgroundColor: aktif ? o.aktifBg     : "white",
              }}>
              <o.Ikon />
              <span className="text-xs font-bold leading-tight"
                style={{ color: aktif ? o.textColor : "#374151" }}>
                {o.judul}
              </span>
              <span className="text-[10px] leading-tight"
                style={{ color: aktif ? o.textColor : "#9ca3af" }}>
                {o.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Konten sesuai status */}
      {status === "belum" && kriteria.berhasil && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="flex items-center gap-1.5 mb-2">
            <IconStar size={13} color="#6b7280" />
            <p className="text-xs font-bold text-gray-500">Yang ingin dicapai:</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{kriteria.berhasil}</p>
        </div>
      )}

      {status === "hampir" && (
        <div className="rounded-2xl border px-5 py-4 flex flex-col gap-3"
          style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}>
          {kriteria.hampir && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <IconInfo size={13} color="#d97706" />
                <p className="text-xs font-bold text-amber-700">Kondisi yang mungkin terjadi:</p>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">{kriteria.hampir}</p>
            </div>
          )}
          <div className="border-t border-amber-100 pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <IconAlertTriangle size={13} color="#d97706" />
              <p className="text-xs font-bold text-amber-700">Yang bisa dilakukan orang tua:</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {[
                "Ulangi latihan di suasana yang lebih tenang",
                "Kurangi bantuan sedikit demi sedikit",
                "Beri pujian untuk setiap kemajuan kecil",
                "Coba 3–5 sesi lagi, lalu nilai ulang",
              ].map((tip, i) => (
                <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                  <IconChevronRight size={12} color="#fbbf24" className="shrink-0 mt-0.5" />{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {status === "berhasil" && (
        <div className="rounded-2xl border px-5 py-4"
          style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "#dcfce7" }}>
              <IconStar size={16} color="#0F741B" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800 mb-1">Luar biasa! Anak berhasil.</p>
              {kriteria.berhasil && (
                <p className="text-xs text-green-700 leading-relaxed">{kriteria.berhasil}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Panel langkah berikutnya — muncul hanya saat berhasil ────────────────
function PanelLanjutan({ status, lanjutanList, loading }) {
  if (status !== "berhasil") return null;
  if (loading || lanjutanList === null) return null;

  return (
    <div className="rounded-2xl border-2 px-5 py-5"
      style={{ borderColor: "#0F741B", backgroundColor: "#f0fdf4" }}>
      <p className="text-sm font-bold text-green-800 mb-1">
        Apa langkah selanjutnya?
      </p>

      {lanjutanList.length === 0 ? (
        <>
          <p className="text-xs text-green-700 leading-relaxed mb-3">
            Anak telah mencapai kemampuan tertinggi di jalur ini.
          </p>
          <div className="rounded-xl bg-white border border-green-200 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-green-700">
              Pertimbangkan untuk mulai program vokasional atau evaluasi portofolio kompetensi anak.
            </p>
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-green-700 leading-relaxed mb-3">
            Sistem merekomendasikan metode berikut sebagai langkah selanjutnya:
          </p>
          <div className="flex flex-col gap-2">
            {lanjutanList.map((m) => (
              <Link key={m.idMetode} href={`/fitur/detail/${m.idMetode}`}
                className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all hover:shadow-sm group"
                style={{ borderColor: "#d1fae5" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#dcfce7" }}>
                  <IconChevronRight size={13} color="#0F741B" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors truncate">
                    {m.namaMetode}
                  </p>
                  {m.durasiPembelajaran && (
                    <p className="text-xs text-gray-400 mt-0.5">{m.durasiPembelajaran}</p>
                  )}
                </div>
                <IconChevronRight size={15} color="#6ee7b7" className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Halaman utama ──────────────────────────────────────────────────────────
export default function DetailPage() {
  const { idMetode: idMetodeRaw } = useParams();
  const idMetode = idMetodeRaw ? decodeURIComponent(String(idMetodeRaw)) : null;

  const [metode,        setMetode]        = useState(null);
  const [prasyaratList, setPrasyaratList] = useState(null);
  const [relasiList,    setRelasiList]    = useState(null);
  const [lanjutanList,  setLanjutanList]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [loadPrasyarat, setLoadPrasyarat] = useState(false);
  const [loadRelasi,    setLoadRelasi]    = useState(false);
  const [loadLanjutan,  setLoadLanjutan]  = useState(false);
  const [tabAktif,      setTabAktif]      = useState("panduan");
  const [error,         setError]         = useState("");
  const [statusAnak,    setStatusAnak]    = useState("belum");

  // Muat status dari localStorage
  useEffect(() => {
    if (!idMetode) return;
    try {
      const saved = localStorage.getItem(`status_${idMetode}`);
      if (saved && ["belum", "hampir", "berhasil"].includes(saved)) setStatusAnak(saved);
      else setStatusAnak("belum");
    } catch (_) { setStatusAnak("belum"); }
  }, [idMetode]);

  const handleStatusChange = (s) => {
    setStatusAnak(s);
    try { localStorage.setItem(`status_${idMetode}`, s); } catch (_) {}
  };

  // Reset saat idMetode berganti — loading=true mencegah render sebelum data siap
  useEffect(() => {
    setLoading(true);
    setMetode(null);
    setError("");
    setPrasyaratList(null);
    setRelasiList(null);
    setLanjutanList(null);
    setTabAktif("panduan");
  }, [idMetode]);

  // Fetch detail
  useEffect(() => {
    if (!idMetode) return;
    setLoading(true);
    getDetailMetode(idMetode)
      .then((res) => {
        const d = res?.data ?? res;
        if (!d?.namaMetode) throw new Error("Data tidak valid");
        setMetode(d);
      })
      .catch(() => setError("Gagal memuat metode."))
      .finally(() => setLoading(false));
  }, [idMetode]);

  // Fetch prasyarat saat tab panduan aktif
  useEffect(() => {
    if (tabAktif !== "panduan" || prasyaratList !== null || !idMetode) return;
    setLoadPrasyarat(true);
    getPrasyaratMetode(idMetode)
      .then((res) => setPrasyaratList(res.data || []))
      .catch(() => setPrasyaratList([]))
      .finally(() => setLoadPrasyarat(false));
  }, [tabAktif, idMetode, prasyaratList]);

  // Fetch lanjutan saat tab panduan aktif atau status berhasil
  useEffect(() => {
    if (!idMetode || lanjutanList !== null) return;
    const perlu = tabAktif === "panduan" || statusAnak === "berhasil";
    if (!perlu) return;
    setLoadLanjutan(true);
    getMetodeLanjutan(idMetode)
      .then((res) => setLanjutanList(res.data || []))
      .catch(() => setLanjutanList([]))
      .finally(() => setLoadLanjutan(false));
  }, [tabAktif, statusAnak, idMetode, lanjutanList]);

  // Fetch terkait
  useEffect(() => {
    if (tabAktif !== "terkait" || relasiList !== null || !idMetode) return;
    setLoadRelasi(true);
    getMetodeTerkait(idMetode)
      .then((res) => setRelasiList(res.data || []))
      .catch(() => setRelasiList([]))
      .finally(() => setLoadRelasi(false));
  }, [tabAktif, idMetode, relasiList]);

  // ── Skeleton loading
  if (loading) return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16 flex flex-col gap-4">
        {[70, 40, 90, 55].map((w, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${w}%` }} />
        ))}
      </div>
    </main>
  );

  if (error || !metode) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-gray-100 mb-4">404</p>
        <p className="text-gray-400 text-sm mb-4">Metode tidak ditemukan.</p>
        <Link href="/fitur/katalog" className="text-sm font-semibold underline"
          style={{ color: "#0F741B" }}>
          Kembali ke Katalog
        </Link>
      </div>
    </main>
  );

  const kriteria  = parseKriteria(metode.kriteriaBerhasil);
  const statusCfg = {
    belum:    { label: "Belum Dicoba",     color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb",
                IkonBadge: () => <IconCircleEmpty size={11} color="#9ca3af" /> },
    hampir:   { label: "Sedang Berproses", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
                IkonBadge: () => <IconCircleHalf size={11} color="#d97706" /> },
    berhasil: { label: "Berhasil",         color: "#0F741B", bg: "#f0fdf4", border: "#bbf7d0",
                IkonBadge: () => <IconCircleFull size={11} color="#0F741B" /> },
  }[statusAnak];

  const TABS = [
    { id: "panduan", label: "Panduan & Langkah" },
    { id: "info",    label: "Info Lengkap"       },
    { id: "terkait", label: "Metode Terkait"        },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link href="/fitur/rekomendasi" className="hover:text-gray-700 transition-colors">
            ← Rekomendasi
          </Link>
          <span>/</span>
          <Link href="/fitur/katalog" className="hover:text-gray-700 transition-colors">
            Katalog
          </Link>
          <span>/</span>
          <span className="text-gray-500 font-medium truncate max-w-[160px]">{metode.namaMetode}</span>
        </div>
      </div>

      {/* Hero header */}
      <header className="px-5 py-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {metode.namaPembelajaran && <Badge>{metode.namaPembelajaran}</Badge>}
            <Badge warna="#374151" bg="#f3f4f6" border="#e5e7eb">
              {metode.durasiPembelajaran}
            </Badge>
            {/* Status badge */}
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ backgroundColor: statusCfg.bg, color: statusCfg.color, borderColor: statusCfg.border }}>
              <statusCfg.IkonBadge /> {statusCfg.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
            {metode.namaMetode}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">{metode.tujuanMetode}</p>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-gray-100 bg-white sticky top-0 z-10 px-5">
        <div className="max-w-3xl mx-auto flex">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTabAktif(t.id)}
              className="px-4 py-3.5 text-xs font-semibold border-b-2 transition-all"
              style={{
                borderColor: tabAktif === t.id ? "#0F741B" : "transparent",
                color:       tabAktif === t.id ? "#0F741B" : "#9ca3af",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-5 py-8 flex-1">

        {/* ══════════════════════════════════════════
            TAB 1: PANDUAN & LANGKAH
            Urutan linear: Persiapan → Cara → Nilai → Lanjutan
        ══════════════════════════════════════════ */}
        {tabAktif === "panduan" && (
          <div className="flex flex-col gap-8">

            {/* Langkah 1 — Konteks perkembangan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#0F741B" }}>1</div>
                <h2 className="text-base font-bold text-gray-800">Konteks perkembangan anak</h2>
              </div>
              <div className="pl-10">
                <UrutanPersiapan prasyaratList={prasyaratList} loading={loadPrasyarat} />
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Langkah 2 — Cara melakukan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#0F741B" }}>2</div>
                <h2 className="text-base font-bold text-gray-800">Cara melakukan</h2>
              </div>
              <div className="pl-10 flex flex-col gap-3">
                {metode.deskripsiMetode && (
                  <p className="text-sm text-gray-600 leading-relaxed border-l-2 pl-4"
                    style={{ borderColor: "#0F741B" }}>
                    {metode.deskripsiMetode}
                  </p>
                )}

                {metode.rincianAktivitas && (() => {
                  const teks  = metode.rincianAktivitas;
                  let   items = teks.split(/\d+\.\s+/).filter(Boolean);
                  if (items.length <= 1)
                    items = teks.split(/\n+/).map(s => s.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
                  if (items.length === 0 && teks.trim()) items = [teks.trim()];
                  return (
                    <ol className="flex flex-col gap-2.5 mt-1">
                      {items.map((a, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                          <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: "#0F741B" }}>{i + 1}</span>
                          <span className="leading-relaxed pt-0.5">{a.trim()}</span>
                        </li>
                      ))}
                    </ol>
                  );
                })()}

                {metode.catatanPendampingan && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 mt-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <IconPin size={13} color="#1d4ed8" />
                      <p className="text-xs font-bold text-blue-700">Catatan untuk orang tua:</p>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">{metode.catatanPendampingan}</p>
                  </div>
                )}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Langkah 3 — Nilai perkembangan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: "#0F741B" }}>3</div>
                <h2 className="text-base font-bold text-gray-800">Nilai perkembangan anak</h2>
              </div>
              <div className="pl-10 flex flex-col gap-4">
                <KartuStatusAnak
                  status={statusAnak}
                  kriteria={kriteria}
                  onStatusChange={handleStatusChange}
                />
                <PanelLanjutan
                  status={statusAnak}
                  lanjutanList={lanjutanList}
                  loading={loadLanjutan}
                />
              </div>
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB 2: INFO LENGKAP
        ══════════════════════════════════════════ */}
        {tabAktif === "info" && (
          <div className="flex flex-col gap-8">

            <section>
              <SectionHeader>Informasi Metode</SectionHeader>
              <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50">
                {[
                  ["Kode Metode",    metode.idMetode],
                  ["Jenis Metode",   metode.namaPembelajaran],
                  ["Durasi",         metode.durasiPembelajaran],
                  ["Usia Kronologis",
                    metode.usiaKronologisMin != null && metode.usiaKronologisMax != null
                      ? `${metode.usiaKronologisMin}–${metode.usiaKronologisMax} tahun` : "—"],
                  ["Usia Mental",
                    metode.usiaMentalMin != null && metode.usiaMentalMax != null
                      ? `${metode.usiaMentalMin}–${metode.usiaMentalMax} tahun` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center px-5 py-3 gap-4">
                    <span className="text-xs text-gray-400">{k}</span>
                    <span className="text-xs font-semibold text-gray-700 text-right">{v || "—"}</span>
                  </div>
                ))}
              </div>
            </section>

            {metode.untukJenisABK?.length > 0 && (
              <section>
                <SectionHeader>Cocok untuk jenis ABK</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {metode.untukJenisABK.map(j => <Badge key={j}>{j}</Badge>)}
                </div>
              </section>
            )}

            {metode.untukJenjang?.length > 0 && (
              <section>
                <SectionHeader>Jenjang pendidikan</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {metode.untukJenjang.map(j => (
                    <Badge key={j} warna="#374151" bg="#f3f4f6" border="#e5e7eb">
                      {LABEL_JENJANG[j] || j}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {metode.media?.length > 0 && (
              <section>
                <SectionHeader>Media yang digunakan</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {metode.media.map(m => (
                    <Badge key={m} warna="#0e7490" bg="#ecfeff" border="#a5f3fc">{m}</Badge>
                  ))}
                </div>
              </section>
            )}

            {metode.kriteriaBerhasil && (
              <section>
                <SectionHeader>Kriteria keberhasilan lengkap</SectionHeader>
                <div className="flex flex-col gap-3">
                  {kriteria.berhasil && (
                    <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconCircleFull size={13} color="#15803d" />
                        <p className="text-xs font-bold text-green-700">Berhasil jika:</p>
                      </div>
                      <p className="text-xs text-green-800 leading-relaxed">{kriteria.berhasil}</p>
                    </div>
                  )}
                  {kriteria.hampir && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconCircleHalf size={13} color="#d97706" />
                        <p className="text-xs font-bold text-amber-700">Hampir berhasil jika:</p>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">{kriteria.hampir}</p>
                    </div>
                  )}
                  {kriteria.belum && (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconCircleEmpty size={13} color="#9ca3af" />
                        <p className="text-xs font-bold text-gray-600">Belum berhasil jika:</p>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{kriteria.belum}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {metode.cocokUntukDeskripsi && (
              <section>
                <SectionHeader>Cocok untuk kondisi</SectionHeader>
                <p className="text-sm text-gray-600 leading-relaxed">{metode.cocokUntukDeskripsi}</p>
              </section>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB 3: METODE TERKAIT
        ══════════════════════════════════════════ */}
        {tabAktif === "terkait" && (
          <div className="flex flex-col gap-6">
            {loadRelasi ? <Spinner label="Mencari metode Terkait..." /> : (
              <>
                {(!relasiList || relasiList.length === 0) ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <IconSearch size={24} color="#d1d5db" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Tidak ada metode terkait</p>
                    <p className="text-xs text-gray-400">Tidak ditemukan metode lain yang serupa.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-1">
                        {relasiList.length} metode lain yang mungkin relevan
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Metode berikut memiliki kesamaan dengan{" "}
                        <strong className="text-gray-600">{metode.namaMetode}</strong>.
                        Ini bukan urutan wajib, melainkan pilihan alternatif.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(relasiList || []).map((m) => (
                        <Link key={m.idMetode} href={`/fitur/detail/${m.idMetode}`}
                          className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-2.5 hover:shadow-md hover:border-gray-200 transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-mono text-gray-300">{m.idMetode}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0"
                              style={{ backgroundColor: "#f0fdf4", color: "#0F741B", borderColor: "#bbf7d0" }}>
                              {m.totalKesamaan} kesamaan
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 leading-snug">{m.namaMetode}</p>
                          <p className="text-xs text-gray-400">{m.durasiPembelajaran}</p>

                          {m.mediaYangSama?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {m.mediaYangSama.slice(0, 3).map(med => (
                                <span key={med} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-100">
                                  {med}
                                </span>
                              ))}
                              {m.mediaYangSama.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{m.mediaYangSama.length - 3} lainnya</span>
                              )}
                            </div>
                          )}

                          {m.jenjangYangSama?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {m.jenjangYangSama.slice(0, 2).map(j => (
                                <span key={j} className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full border border-purple-100">
                                  {LABEL_JENJANG[j] || j}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}