"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllMetode } from "../../lib/api";
import {
  IconAutis, IconTunagrahita, IconTunarungu,
  IconTunanetra, IconTunadaksa,
  IconCheck, IconX, IconSearch, IconChevronRight,
} from "../../components/icons";


// ── Data ──────────────────────────────────────────────────────────────────

const JENIS_ABK = [
  {
    id: "Autis", label: "Autisme", icon: IconAutis,
    warna: "#7c3aed", bg: "#f5f3ff", border: "#e9d5ff",
    tingkat: [
      { value: "AutisFungsionalRingan", label: "Fungsional Ringan" },
      { value: "AutisFungsionalSedang", label: "Fungsional Sedang" },
      { value: "AutisFungsionalBerat",  label: "Fungsional Berat"  },
    ],
  },
  {
    // BUG FIX 1: field harus "icon" bukan nama jenis (Tunagrahita, Tunarungu, dst)
    id: "Tunagrahita", label: "Tunagrahita", icon: IconTunagrahita,
    warna: "#b45309", bg: "#fffbeb", border: "#fde68a",
    tingkat: [
      { value: "TunagrahitaRingan", label: "Ringan" },
      { value: "TunagrahitaSedang", label: "Sedang" },
      { value: "TunagrahitaBerat",  label: "Berat"  },
    ],
  },
  {
    id: "Tunarungu", label: "Tunarungu", icon: IconTunarungu,
    warna: "#0e7490", bg: "#ecfeff", border: "#a5f3fc",
    tingkat: [
      { value: "TunarunguKurangDengar", label: "Kurang Dengar" },
      { value: "TunarunguTuli",         label: "Tuli"          },
    ],
  },
  {
    id: "Tunanetra", label: "Tunanetra", icon: IconTunanetra,
    warna: "#0f766e", bg: "#f0fdfa", border: "#99f6e4",
    tingkat: [
      { value: "TunanetraKurangPenglihatan", label: "Kurang Penglihatan" },
      { value: "TunanetraButaTotal",         label: "Buta Total"         },
    ],
  },
  {
    id: "Tunadaksa", label: "Tunadaksa", icon: IconTunadaksa,
    warna: "#be123c", bg: "#fff1f2", border: "#fecdd3",
    tingkat: [
      { value: "TunadaksaRingan", label: "Ringan" },
      { value: "TunadaksaSedang", label: "Sedang" },
      { value: "TunadaksaBerat",  label: "Berat"  },
    ],
  },
];

const JENJANG_OPTIONS = [
  { value: "SMPLB_7",  label: "SMPLB 7"  },
  { value: "SMPLB_8",  label: "SMPLB 8"  },
  { value: "SMPLB_9",  label: "SMPLB 9"  },
  { value: "SMALB_1O", label: "SMALB 10" },
  { value: "SMALB_11", label: "SMALB 11" },
  { value: "SMALB_12", label: "SMALB 12" },
];

const LABEL_JENJANG = {
  SMPLB_7: "SMPLB 7", SMPLB_8: "SMPLB 8", SMPLB_9: "SMPLB 9",
  SMALB_1O: "SMALB 10", SMALB_11: "SMALB 11", SMALB_12: "SMALB 12",
};

const PER_HALAMAN = 9;

// ── Modal Detail ──────────────────────────────────────────────────────────

function ModalDetail({ metode, jenis, onTutup }) {
  const { warna, bg, border } = jenis;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onTutup(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onTutup]);

  const aktivitas = (metode.rincian_aktivitas || metode.rincianAktivitas || "")
    .split(/\d+\.\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-6"
      style={{ backgroundColor: "rgba(15,23,42,0.6)" }}
      onClick={onTutup}
    >
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl"
        style={{ borderRadius: "1.5rem 1.5rem 0 0" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                {metode.idMetode}
              </span>
              {(metode.nama_pembelajaran || metode.namaPembelajaran) && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium border"
                  style={{ backgroundColor: bg, color: warna, borderColor: border }}
                >
                  {metode.nama_pembelajaran || metode.namaPembelajaran}
                </span>
              )}
              {(metode.durasi_pembelajaran || metode.durasiPembelajaran) && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                  {metode.durasi_pembelajaran || metode.durasiPembelajaran}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {metode.nama_metode || metode.namaMetode}
            </h2>
          </div>
          {/* BUG FIX 3a: IconX menggantikan SVG inline */}
          <button
            onClick={onTutup}
            className="shrink-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <IconX size={15} color="#6b7280" />
          </button>
        </div>

        {/* Konten scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="flex flex-col gap-6">

            {/* Info ringkas */}
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Durasi", metode.durasiPembelajaran],
                ["Usia Kronologis",
                  metode.usiaKronologisMin != null && metode.usiaKronologisMax != null
                    ? `${metode.usiaKronologisMin}–${metode.usiaKronologisMax} thn` : null],
                ["Usia Mental",
                  metode.usiaMentalMin != null && metode.usiaMentalMax != null
                    ? `${metode.usiaMentalMin}–${metode.usiaMentalMax} thn` : null],
              ].map(([label, nilai]) => (
                <div key={label} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-700">{nilai || "—"}</p>
                </div>
              ))}
            </div>

            {(metode.tujuan_metode || metode.tujuanMetode) && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Tujuan Pembelajaran</p>
                <p className="text-sm text-gray-700 leading-relaxed border-l-2 pl-4" style={{ borderColor: warna }}>
                  {metode.tujuan_metode || metode.tujuanMetode}
                </p>
              </div>
            )}

            {(metode.deskripsi_metode || metode.deskripsiMetode) && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Deskripsi</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metode.deskripsi_metode || metode.deskripsiMetode}
                </p>
              </div>
            )}

            {aktivitas.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Rincian Aktivitas</p>
                <ol className="flex flex-col gap-3">
                  {aktivitas.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: warna }}
                      >{i + 1}</span>
                      <span className="text-sm text-gray-600 leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {(metode.kriteria_berhasil || metode.kriteriaBerhasil) && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Kriteria Keberhasilan</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metode.kriteria_berhasil || metode.kriteriaBerhasil}
                </p>
              </div>
            )}

            {(metode.catatan_pendampingan || metode.catatanPendampingan) && (
              <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: bg, borderColor: border }}>
                <p className="text-xs font-bold mb-1" style={{ color: warna }}>Catatan Pendampingan</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metode.catatan_pendampingan || metode.catatanPendampingan}
                </p>
              </div>
            )}

            {metode.media?.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Media yang Digunakan</p>
                <div className="flex flex-wrap gap-2">
                  {metode.media.map(m => (
                    <span key={m} className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{ backgroundColor: bg, color: warna, borderColor: border }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {metode.untukJenjang?.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Untuk Jenjang</p>
                <div className="flex flex-wrap gap-2">
                  {metode.untukJenjang.map(j => (
                    <span key={j} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {LABEL_JENJANG[j] || j}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {((metode.prasyarat?.length > 0) || (metode.metode_lanjutan?.length > 0) || (metode.metodeLanjutan?.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {metode.prasyarat?.length > 0 && (
                  <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-4">
                    <p className="text-xs font-bold text-orange-700 mb-2">Prasyarat</p>
                    {metode.prasyarat.map(p => (
                      <p key={p} className="text-xs text-orange-700 leading-relaxed">{p}</p>
                    ))}
                  </div>
                )}
                {(metode.metode_lanjutan || metode.metodeLanjutan)?.length > 0 && (
                  <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-4">
                    <p className="text-xs font-bold text-blue-700 mb-2">Metode Lanjutan</p>
                    {(metode.metode_lanjutan || metode.metodeLanjutan).map(m => (
                      <p key={m} className="text-xs text-blue-700 leading-relaxed">{m}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer modal */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100">
          <button onClick={onTutup}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:opacity-80"
            style={{ borderColor: warna, color: warna }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Halaman Utama ─────────────────────────────────────────────────────────

export default function KatalogPage() {
  const [jenisAktif,   setJenisAktif]   = useState("");
  const [tingkatAktif, setTingkatAktif] = useState("");
  const [jenjangAktif, setJenjangAktif] = useState("");
  const [halaman,      setHalaman]      = useState(1);
  const [cari,         setCari]         = useState("");
  const [semuaMetode,  setSemuaMetode]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [modal,        setModal]        = useState(null);

  const jenisData   = JENIS_ABK.find(j => j.id === jenisAktif);
  const warnaAktif  = jenisData?.warna  || "#0F741B";
  const bgAktif     = jenisData?.bg     || "#f0fdf4";
  const borderAktif = jenisData?.border || "#bbf7d0";

  // BUG FIX 4: jenisModal dideteksi dari data metode jika tidak ada filter jenis aktif
  // Sehingga warna modal selalu sesuai jenis ABK metode yang dibuka
  const jenisModal = useMemo(() => {
    if (jenisData) return jenisData;
    if (modal) {
      const abkUtama = modal.untukJenisABK?.[0] || "";
      return JENIS_ABK.find(j => abkUtama.toLowerCase().includes(j.id.toLowerCase()))
        || { warna: "#0F741B", bg: "#f0fdf4", border: "#bbf7d0" };
    }
    return { warna: "#0F741B", bg: "#f0fdf4", border: "#bbf7d0" };
  }, [jenisData, modal]);

  const tutupModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    let aktif = true;
    setLoading(true);
    setError("");
    const filter = {};
    if (tingkatAktif) filter.jenis = tingkatAktif;
    else if (jenisAktif) filter.jenis = jenisAktif;
    getAllMetode(filter)
      .then(data => {
        if (!aktif) return;
        const arr = data?.metode || data || [];
        const unik = Array.from(new Map(arr.map(m => [m.idMetode, m])).values());
        setSemuaMetode(unik);
      })
      .catch(e => { if (!aktif) return; setError(e?.message || "Gagal terhubung ke server."); })
      .finally(() => { if (aktif) setLoading(false); });
    return () => { aktif = false; };
  }, [jenisAktif, tingkatAktif]);

  const metodeTerfilter = useMemo(() => {
    return semuaMetode.filter(m => {
      if (jenjangAktif && !m.untukJenjang?.includes(jenjangAktif)) return false;
      if (cari) {
        const q = cari.toLowerCase();
        if (!m.namaMetode?.toLowerCase().includes(q) &&
            !m.tujuanMetode?.toLowerCase().includes(q) &&
            !m.idMetode?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [semuaMetode, jenjangAktif, cari]);

  const totalHalaman   = Math.max(Math.ceil(metodeTerfilter.length / PER_HALAMAN), 1);
  const halamanAman    = halaman > totalHalaman ? 1 : halaman;
  const metodeDiTampil = metodeTerfilter.slice(
    (halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN
  );

  // BUG FIX 5: reset jenjangAktif saat ganti jenis agar filter tidak "tertinggal"
  const pilihJenis = (id) => {
    if (id === jenisAktif) {
      setJenisAktif(""); setTingkatAktif(""); setJenjangAktif(""); setHalaman(1); setCari("");
    } else {
      setJenisAktif(id); setTingkatAktif(""); setJenjangAktif(""); setHalaman(1); setCari("");
    }
  };

  const pilihTingkat = (v) => { setTingkatAktif(prev => prev === v ? "" : v); setHalaman(1); };
  const gantiHalaman = (n) => { setHalaman(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const resetSemua   = () => { setJenisAktif(""); setTingkatAktif(""); setJenjangAktif(""); setCari(""); setHalaman(1); };
  const adaFilter    = jenisAktif || tingkatAktif || jenjangAktif || cari;

  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero */}
      <div className="relative py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/img/hero.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.3, zIndex: 0 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white" style={{ zIndex: 1 }} />
        <div className="relative" style={{ zIndex: 2 }}>
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-green-100 bg-green-50/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-600">Basis Pengetahuan Ontologi</span>
          </div>
          <h1 className="mb-3" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#0a1a0a", lineHeight: 1.2 }}>
            <span className="text-green-600">Katalog</span> Metode Pembelajaran
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed mb-8">
            Eksplorasi referensi terstruktur untuk mendukung proses belajar mengajar Anak Berkebutuhan Khusus secara lebih efektif.
          </p>
          <div className="flex justify-center">
            <div className="rounded-full shadow-sm" style={{ width: 60, height: 4, backgroundColor: "#16a34a" }} />
          </div>
        </div>
      </div>

      {/* Panel filter */}
      <div className="bg-gray-50 border-y border-gray-200 px-4 py-4 sticky top-[72px] z-40">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">

          {/* Baris 1: Search + Counter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <IconSearch size={15} />
              </div>
              <input
                type="text" value={cari}
                onChange={e => { setCari(e.target.value); setHalaman(1); }}
                placeholder="Cari metode..."
                className="w-full border border-gray-200 bg-white rounded-xl pl-9 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400 shadow-sm"
              />
              {cari && (
                <button onClick={() => { setCari(""); setHalaman(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors">
                  <IconX size={14} color="currentColor" />
                </button>
              )}
            </div>
            {/* Counter — ringkas di mobile */}
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {loading ? "—" : metodeTerfilter.length}
                <span className="text-xs font-normal text-gray-400 ml-1">metode</span>
              </p>
            </div>
          </div>

          {/* Baris 2: Jenjang (full width di mobile) */}
          <select value={jenjangAktif} onChange={e => { setJenjangAktif(e.target.value); setHalaman(1); }}
            className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-gray-400 shadow-sm cursor-pointer">
            <option value="">Semua Jenjang</option>
            {JENJANG_OPTIONS.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
          </select>

          {/* Baris 3: Filter jenis — grid 5 kolom di mobile agar rapi */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Jenis Kebutuhan Khusus
            </p>
            <div className="grid grid-cols-5 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
              {JENIS_ABK.map(j => {
                const aktif = jenisAktif === j.id;
                const IkonJenis = j.icon;
                return (
                  <button key={j.id} onClick={() => pilihJenis(j.id)}
                    className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-1.5 px-1 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-semibold transition-all border"
                    style={{
                      backgroundColor: aktif ? j.warna  : "#ffffff",
                      color:           aktif ? "#ffffff" : "#6b7280",
                      borderColor:     aktif ? j.warna  : "#e5e7eb",
                    }}>
                    {IkonJenis && <IkonJenis size={16} color={aktif ? "#ffffff" : "#9ca3af"} />}
                    <span className="text-[10px] sm:text-sm leading-tight text-center">{j.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter tingkatan */}
          {jenisAktif && jenisData && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Tingkatan
                <span className="ml-2 normal-case font-normal text-gray-400">
                  (opsional — kosongkan untuk semua tingkatan {jenisData.label})
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {jenisData.tingkat.map(t => {
                  const aktif = tingkatAktif === t.value;
                  return (
                    <button key={t.value} onClick={() => pilihTingkat(t.value)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                      style={{
                        backgroundColor: aktif ? jenisData.bg    : "#ffffff",
                        color:           aktif ? jenisData.warna : "#6b7280",
                        borderColor:     aktif ? jenisData.warna : "#e5e7eb",
                      }}>
                      {/* BUG FIX 3d: IconCheck menggantikan SVG inline centang */}
                      {aktif && <IconCheck size={12} color={jenisData.warna} className="shrink-0" />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Area hasil */}
      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">

        {/* Status + Reset */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {tingkatAktif
                ? `${jenisData?.label} · ${jenisData?.tingkat.find(t => t.value === tingkatAktif)?.label}`
                : jenisAktif ? jenisData?.label : "Semua Metode"}
              {jenjangAktif && <span className="ml-2 text-gray-400 font-normal">· {LABEL_JENJANG[jenjangAktif]}</span>}
            </p>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                {metodeTerfilter.length} metode
                {totalHalaman > 1 && ` · halaman ${halamanAman}/${totalHalaman}`}
              </p>
            )}
          </div>
          {adaFilter && (
            <button onClick={resetSemua}
              className="text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Reset semua filter
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-7 h-7 border-[3px] rounded-full animate-spin"
              style={{ borderColor: borderAktif, borderTopColor: warnaAktif }} />
            <p className="text-sm text-gray-400">Memuat data dari server...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-5 text-center">
            <p className="text-sm font-semibold text-red-700 mb-1">Gagal terhubung ke server</p>
            <p className="text-xs text-red-400 font-mono mb-4">{error}</p>
            <button onClick={() => window.location.reload()}
              className="text-xs font-semibold border border-red-300 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && metodeDiTampil.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            {/* BUG FIX 3e: IconSearch menggantikan SVG emoji wajah */}
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <IconSearch size={24} color="#d1d5db" />
            </div>
            <p className="text-sm font-semibold text-gray-500 mb-1">
              {cari ? `Tidak ada hasil untuk "${cari}"` : "Tidak ada metode untuk filter ini"}
            </p>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mt-1">
              Coba reset filter atau pilih jenis/jenjang yang berbeda.
            </p>
            <button onClick={resetSemua} className="text-xs font-semibold underline mt-3" style={{ color: warnaAktif }}>
              Tampilkan semua metode
            </button>
          </div>
        )}

        {/* Grid + Pagination */}
        {!loading && !error && metodeDiTampil.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {metodeDiTampil.map(m => (
                <button key={m.idMetode} onClick={() => setModal(m)}
                  className="group text-left w-full bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-300 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{m.idMetode}</span>
                    {m.durasiPembelajaran && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold border shrink-0 uppercase tracking-wider"
                        style={{ backgroundColor: bgAktif, color: warnaAktif, borderColor: borderAktif }}>
                        {m.durasiPembelajaran}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-green-700 transition-colors">
                    {m.namaMetode}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{m.tujuanMetode}</p>
                  {m.media?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {m.media.slice(0, 2).map(med => (
                        <span key={med} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500">{med}</span>
                      ))}
                      {m.media.length > 2 && <span className="text-[10px] text-gray-400 self-center">+{m.media.length - 2} media</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                      {m.usiaKronologisMin != null && m.usiaKronologisMax != null
                        ? `Usia ${m.usiaKronologisMin}–${m.usiaKronologisMax} thn` : "Semua Usia"}
                    </p>
                    {/* BUG FIX 3f: IconChevronRight menggantikan SVG inline panah */}
                    <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: warnaAktif }}>
                      Lihat Detail
                      <IconChevronRight size={13} color={warnaAktif} />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {totalHalaman > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Menampilkan {(halamanAman - 1) * PER_HALAMAN + 1}–{Math.min(halamanAman * PER_HALAMAN, metodeTerfilter.length)} dari {metodeTerfilter.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => gantiHalaman(halamanAman - 1)} disabled={halamanAman === 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                    Sebelumnya
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalHalaman }, (_, i) => i + 1)
                      .filter(n => n === 1 || n === totalHalaman || Math.abs(n - halamanAman) <= 1)
                      .reduce((acc, n, idx, arr) => {
                        if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
                        acc.push(n);
                        return acc;
                      }, [])
                      .map((n, i) => n === "..." ? (
                        <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                      ) : (
                        <button key={n} onClick={() => gantiHalaman(n)}
                          className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                          style={{
                            backgroundColor: halamanAman === n ? warnaAktif : "#fff",
                            color:           halamanAman === n ? "#fff"     : "#6b7280",
                            border:          `1px solid ${halamanAman === n ? warnaAktif : "#e5e7eb"}`,
                          }}>
                          {n}
                        </button>
                      ))}
                  </div>
                  <button onClick={() => gantiHalaman(halamanAman + 1)} disabled={halamanAman === totalHalaman}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-colors">
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {modal && <ModalDetail metode={modal} jenis={jenisModal} onTutup={tutupModal} />}

    </main>
  );
}