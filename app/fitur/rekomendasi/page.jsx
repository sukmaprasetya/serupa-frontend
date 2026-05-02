"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRekomendasiStore } from "../../store/rekomendasiStore";
import { getRekomendasi, getMediaKandidat } from "../../lib/api";
import {
  JENIS_ABK,
  TINGKAT_ABK,
  ALAT_BANTU,
  CHECKLIST_KEMANDIRIAN,
  RENTANG_USIA_MENTAL,
  konversiChecklistKeUsiaMental,
} from "../../lib/konstanta";
import {
  IconCheck, IconArrowRight, IconChevronRight,
  IconStar, IconSearch, IconFilter,
  IconUser, IconGraduationCap, IconBox,
  IconAlertTriangle, IconX, IconTrash,
  IconAutis, IconTunagrahita, IconTunarungu,
  IconTunanetra, IconTunadaksa,
} from "../../components/icons";

// ── Map icon per jenis ABK ────────────────────────────────────────────────
// Terpisah dari konstanta agar konstanta tetap bebas dari JSX/React
const ICON_ABK = {
  Autis:       IconAutis,
  Tunagrahita: IconTunagrahita,
  Tunarungu:   IconTunarungu,
  Tunanetra:   IconTunanetra,
  Tunadaksa:   IconTunadaksa,
};

// ── Konstanta lokal ───────────────────────────────────────────────────────

const PILIHAN_JENJANG = [
  { label: "Semua Jenjang (opsional)", value: ""        },
  { label: "SMPLB Kelas 7",           value: "SMPLB_7"  },
  { label: "SMPLB Kelas 8",           value: "SMPLB_8"  },
  { label: "SMPLB Kelas 9",           value: "SMPLB_9"  },
  { label: "SMALB Kelas 10",          value: "SMALB_1O" },
  { label: "SMALB Kelas 11",          value: "SMALB_11" },
  { label: "SMALB Kelas 12",          value: "SMALB_12" },
];

const PILIHAN_KESIBUKAN = [
  { label: "Pilih tingkat kesibukan",          value: "" },
  { label: "Sangat Sibuk — < 15 menit/hari",  value: "1" },
  { label: "Sibuk — sekitar 30 menit/hari",   value: "2" },
  { label: "Sedang — sekitar 1 jam/hari",     value: "3" },
  { label: "Fleksibel — 1–2 jam/hari",        value: "4" },
  { label: "Full Time — bisa kapan saja",     value: "5" },
];

const DESKRIPSI_BOBOT = {
  c1_media:        "Media yang tersedia menjadi penentu utama keberhasilan karena tanpa media yang sesuai metode tidak dapat dijalankan.",
  c2_durasi:       "Efisiensi waktu penting agar metode realistis diterapkan di rumah dengan jadwal orang tua yang beragam.",
  c3_kemandirian:  "Kesesuaian usia mental memastikan kompleksitas metode sesuai tahap perkembangan anak.",
  c4_pendampingan: "Intensitas pendampingan disesuaikan dengan kapasitas waktu orang tua untuk mencegah kelelahan pengasuh.",
};

// ── Komponen kecil ────────────────────────────────────────────────────────

function StepIndicator({ langkahAktif }) {
  const LANGKAH = ["Profil Anak", "Kriteria Penilaian", "Hasil"];
  return (
    <div className="flex items-center gap-0 mb-10">
      {LANGKAH.map((l, i) => {
        const nomor   = i + 1;
        const aktif   = langkahAktif === nomor;
        const selesai = langkahAktif > nomor;
        return (
          <div key={l} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                style={{
                  backgroundColor: selesai || aktif ? "#0F741B" : "#ffffff",
                  borderColor:     selesai || aktif ? "#0F741B" : "#e5e7eb",
                  color:           selesai || aktif ? "#ffffff" : "#9ca3af",
                }}
              >
                {selesai ? (
                  <IconCheck size={14} color="white" />
                ) : nomor}
              </div>
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: aktif || selesai ? "#0F741B" : "#9ca3af" }}
              >
                {l}
              </span>
            </div>
            {i < LANGKAH.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 mb-5 rounded-full"
                style={{ backgroundColor: selesai ? "#0F741B" : "#e5e7eb" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProgressBar({ skor, warna }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${(skor * 100).toFixed(1)}%`, backgroundColor: warna }}
      />
    </div>
  );
}

// ── Modal detail perhitungan SAW ──────────────────────────────────────────
// Penyesuaian: field dari Flask adalah rawC1–4, normC1–4, bobotDipakai
// (bukan rawScores/normScores/weights seperti versi lama)

function ModalPerhitungan({ metode, onTutup }) {
  // Escape key & lock scroll
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onTutup(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onTutup]);

  // Mapping field Flask → baris tabel
  const w = metode.bobotDipakai || {};
  const BARIS = [
    { kode: "C1", nama: "Kesesuaian Media",       tipe: "BENEFIT", raw: metode.rawC1, norm: metode.normC1, bobot: w.c1_media        },
    { kode: "C2", nama: "Efisiensi Durasi",        tipe: "COST",    raw: metode.rawC2, norm: metode.normC2, bobot: w.c2_durasi       },
    { kode: "C3", nama: "Kemandirian Anak",        tipe: "BENEFIT", raw: metode.rawC3, norm: metode.normC3, bobot: w.c3_kemandirian  },
    { kode: "C4", nama: "Intensitas Pendampingan", tipe: "COST",    raw: metode.rawC4, norm: metode.normC4, bobot: w.c4_pendampingan },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onTutup}
    >
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl"
        style={{ borderRadius: "1rem 1rem 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs font-mono text-gray-300 mb-1">{metode.idMetode}</p>
            <h2 className="text-base font-bold text-gray-900">Detail Analisis Kesesuaian</h2>
            <p className="text-sm text-gray-500">{metode.namaMetode}</p>
          </div>
          <button
            onClick={onTutup}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors"
          >
            <IconX size={15} color="#6b7280" />
          </button>
        </div>

        {/* Konten */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">
          {/* Formula */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-bold text-gray-500 mb-1">Cara Sistem Menilai Kesesuaian</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>V(i) = Σ Wⱼ × rᵢⱼ</strong> &nbsp;|&nbsp;
              BENEFIT: rᵢⱼ = xᵢⱼ / max(x) &nbsp;|&nbsp;
              COST: rᵢⱼ = min(x) / xᵢⱼ
            </p>
          </div>

          {/* Tabel */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Matriks Perhitungan</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div
                className="grid bg-gray-50 border-b border-gray-100 px-4 py-2.5 text-xs font-bold uppercase text-gray-400"
                style={{ gridTemplateColumns: "3rem 1fr 5rem 5rem 5rem 5rem" }}
              >
                <span>Kode</span>
                <span>Kriteria</span>
                <span className="text-center">Tipe</span>
                <span className="text-center">Nilai (x)</span>
                <span className="text-center">Normal (r)</span>
                <span className="text-center">Bobot (W)</span>
              </div>
              {BARIS.map((b) => (
                <div
                  key={b.kode}
                  className="grid items-center px-4 py-3 border-b border-gray-50 last:border-0"
                  style={{ gridTemplateColumns: "3rem 1fr 5rem 5rem 5rem 5rem" }}
                >
                  <span className="text-xs font-mono font-bold" style={{ color: "#0F741B" }}>{b.kode}</span>
                  <span className="text-xs text-gray-700 pr-2">{b.nama}</span>
                  <span className="text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.tipe === "BENEFIT" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                      {b.tipe}
                    </span>
                  </span>
                  <span className="text-xs text-gray-600 text-center font-mono">{b.raw?.toFixed(4) ?? "—"}</span>
                  <span className="text-xs font-bold text-center font-mono" style={{ color: "#0F741B" }}>{b.norm?.toFixed(4) ?? "—"}</span>
                  <span className="text-xs text-gray-600 text-center font-mono">{b.bobot?.toFixed(4) ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kalkulasi akhir */}
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-4">
            <p className="text-xs font-bold text-green-700 mb-2">Nilai Kesesuaian Akhir</p>
            <p className="text-xs text-green-600 font-mono mb-1">
              V = {BARIS.map((b) => `(${b.norm?.toFixed(3) ?? "0"} × ${b.bobot?.toFixed(3) ?? "0"})`).join(" + ")}
            </p>
            <p className="text-xl font-bold" style={{ color: "#0F741B" }}>
              V = {metode.skor.toFixed(4)}&nbsp;
              <span className="text-sm font-normal text-green-600">({(metode.skor * 100).toFixed(2)}%)</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onTutup}
            className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Halaman utama ─────────────────────────────────────────────────────────

export default function RekomendasiPage() {
  // ── Zustand store (ganti usePersistedState) ───────────────────────────
  const {
    inputForm,
    setInput,
    toggleMedia,
    toggleChecklist,
    setBobot,
    hasil,
    setHasil,
    isLoading,
    setLoading,
    setError,
    simpanKeRiwayat,
    resetForm,
  } = useRekomendasiStore();

  // Destructure inputForm untuk kemudahan akses
  const {
    jenisABK,
    tingkatABK:     tingkat,
    jenjang,
    mediaDimiliki:  mediaDipilih,
    checklist:      checklistDipilih,
    waktuTersedia,
    kesibukanOrtu,
    bobot,
  } = inputForm;

  // ── State lokal (UI saja, tidak perlu persist) ────────────────────────
  // Selalu mulai dari langkah 1 saat SSR untuk menghindari hydration mismatch.
  // useEffect di bawah akan set ke langkah 3 setelah rehydrate jika ada hasil.
  const [langkah,         setLangkah]         = useState(1);
  const [_mounted,        set_Mounted]        = useState(false);
  const [alatBantu,       setAlatBantu]       = useState(null);
  const [pesan,           setPesan]           = useState({ teks: "", tipe: "" });
  const [riwayatDisimpan, setRiwayatDisimpan] = useState(true);
  const [modalMetode,     setModalMetode]     = useState(null);
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);

  // ── State untuk C1 media dari kandidat ───────────────────────────────
  const [mediaKandidat,     setMediaKandidat]     = useState([]);   // [{id, label, media:[]}]
  const [loadingMedia,      setLoadingMedia]       = useState(false);

  // ── State untuk C3 usia mental ────────────────────────────────────────
  // usiaMentalManual: nilai slider yang diisi pengguna secara langsung
  // showChecklist: tampilkan checklist panduan atau tidak
  // Diinisialisasi dari store agar nilai tetap saat kembali dari langkah 3
  const [usiaMentalManual,  setUsiaMentalManual]   = useState(
    inputForm.usiaMental !== null && inputForm.usiaMental !== undefined ? inputForm.usiaMental : null
  );
  const [showChecklist,     setShowChecklist]       = useState(false);
 
  // ── Rehydrate: set langkah ke 3 jika sudah ada hasil setelah refresh ──────
  useEffect(() => {
    set_Mounted(true);
    if (Array.isArray(hasil) && hasil.length > 0) {
      setLangkah(3);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya run sekali saat mount (setelah rehydrate)

  // ── Fetch media kandidat setiap kali langkah 2 aktif ─────────────────────
  // Dipanggil dari onClick "Lanjut" DAN dari tombol "Ubah Kriteria"
  // karena keduanya menghasilkan langkah === 2
  useEffect(() => {
    if (langkah !== 2) return;
    if (!jenisABK) return;
    // Fetch ulang setiap masuk langkah 2 agar selalu sinkron
    setLoadingMedia(true);
    getMediaKandidat({ jenis: tingkat || jenisABK, jenjang: jenjang || "" })
      .then(res => setMediaKandidat(res.kategori || []))
      .catch(() => setMediaKandidat([]))
      .finally(() => setLoadingMedia(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langkah]); // intentional: hanya re-fetch saat langkah berubah ke 2
 
  // ── Handler ───────────────────────────────────────────────────────────

  const handlePilihJenis = (id) => {
    setInput({ jenisABK: id, tingkatABK: "", checklist: [] });
    setAlatBantu(null);
    setPesan({ teks: "", tipe: "" });
    setRiwayatDisimpan(true);
    // Reset media kandidat dan usia mental manual saat ganti jenis
    setMediaKandidat([]);
    setUsiaMentalManual(null);
    setShowChecklist(false);
  };

  const handleSetTingkat = (value) => {
    setInput({ tingkatABK: value });
    setPesan({ teks: "", tipe: "" });
  };

  const handleSetBobot = (key, nilai) => {
    setBobot(key, Math.max(1, Math.min(10, Number(nilai) || 1)));
  };

  const doReset = () => {
    resetForm();
    setAlatBantu(null);
    setPesan({ teks: "", tipe: "" });
    setRiwayatDisimpan(true);
    setLangkah(1);
    setKonfirmasiReset(false);
    // Reset state C1, C3 lokal
    setMediaKandidat([]);
    setUsiaMentalManual(null);
    setShowChecklist(false);
  };

  // ── Kirim ke Flask API ────────────────────────────────────────────────
    const handleRekomendasi = async () => {
    if (!jenisABK) {
      setPesan({ teks: "Pilih jenis kebutuhan khusus terlebih dahulu.", tipe: "error" });
      return;
    }
    if (!tingkat) {
      setPesan({ teks: "Pilih tingkat kemampuan anak.", tipe: "error" });
      return;
    }
    if (!waktuTersedia || parseInt(waktuTersedia) < 5) {
      setPesan({ teks: "Isi waktu pendampingan per sesi (C2) terlebih dahulu.", tipe: "error" });
      return;
    }
    if (usiaMentalManual === null && checklistDipilih.length === 0) {
      setPesan({ teks: "Tentukan usia mental anak (C3) melalui slider atau panduan checklist.", tipe: "error" });
      return;
    }
    if (!kesibukanOrtu) {
      setPesan({ teks: "Pilih tingkat kesibukan orang tua (C4) terlebih dahulu.", tipe: "error" });
      return;
    }

    setLoading(true);
    setPesan({ teks: "", tipe: "" });
    setRiwayatDisimpan(true);

    try {
      // Prioritas: manual (slider) → checklist
      // Validasi sudah memastikan salah satunya terisi
      const usiaMentalHasil = usiaMentalManual !== null
        ? usiaMentalManual
        : konversiChecklistKeUsiaMental(checklistDipilih, jenisABK);

      // Update usiaMental di store agar UI sinkron
      setInput({ usiaMental: usiaMentalHasil });

      // PAYLOAD DISESUAIKAN: Key harus sama dengan saw.py (snake_case)
      const payload = {
        jenis_abk:      tingkat,                   // Backend pakai jenis_abk
        jenjang:        jenjang || "",             // Kosongkan jika ingin semua jenjang
        media_dimiliki: mediaDipilih,              // Backend pakai media_dimiliki
        waktu_tersedia: parseInt(waktuTersedia) || 30,
        usia_mental:    usiaMentalHasil,           // Backend pakai usia_mental
        kesibukan_ortu: parseInt(kesibukanOrtu) || 3,
        bobot:          bobot,                     // Menggunakan bobot dari store
      };

      console.log("Kirim Payload ke Flask:", payload);

      const response = await getRekomendasi(payload);

      // Backend (app.py) biasanya mengirim status: "success" dan hasil_ranking: [...]
      let dataHasil = response.hasil_ranking || [];

      // Filter alat bantu (Client-side)
      if (alatBantu && dataHasil.length > 0) {
        // Pastikan m.media ada dan merupakan array sebelum filter
        const filtered = dataHasil.filter((m) => 
          m.media && Array.isArray(m.media) && m.media.includes(alatBantu)
        );
        if (filtered.length > 0) dataHasil = filtered;
      }

      // Set hasil ke store — kirim array langsung
      setHasil(dataHasil);

      setLangkah(3); // Pindah ke layar hasil
      setPesan({
        teks: `${response.jumlah_kandidat ?? dataHasil.length} metode ditemukan dan telah diperingkat.`,
        tipe: "sukses",
      });

      // Panggil simpan riwayat SETELAH hasil masuk ke state
      setTimeout(() => {
        simpanKeRiwayat();
        setRiwayatDisimpan(true);
      }, 500);

    } catch (err) {
      console.error("Error Rekomendasi:", err);
      setPesan({
        teks: "Gagal terhubung ke Backend. Pastikan Flask berjalan.",
        tipe: "error",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Helper UI ─────────────────────────────────────────────────────────

  const badgeSkor = (skor) => {
    if (skor >= 0.8) return { bg: "#dcfce7", warna: "#15803d", label: "Sangat Cocok", bar: "#22c55e" };
    if (skor >= 0.6) return { bg: "#fef9c3", warna: "#854d0e", label: "Cocok",        bar: "#eab308" };
    return               { bg: "#fee2e2", warna: "#b91c1c", label: "Cukup Cocok",  bar: "#ef4444" };
  };

  // grupMedia dihapus — media kini berasal dari mediaKandidat (API)
  // usiaMentalEstimasi dihapus — estimasi kini dihitung inline di dalam blok C3
  const totalBobotNorm     = Object.values(bobot).reduce((s, v) => s + v, 0);
  // `hasil` di store adalah array langsung (bukan objek dengan .data)
  const hasilData          = Array.isArray(hasil) ? hasil : [];

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen flex flex-col bg-white">
      
      {/* Hero */}
      <div className="relative py-16 px-6 text-center overflow-hidden">
        {/* Background foto */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
            zIndex: 0,
          }}
        />
        {/* Gradasi di atas foto */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white"
          style={{ zIndex: 1 }}
        />
        {/* Konten hero */}
        <div className="relative" style={{ zIndex: 2 }}>
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-green-100 bg-green-50/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-600">
              Sistem Pendukung Keputusan SAW
            </span>
          </div>
          <h1
            className="mb-3"
            style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#0a1a0a", lineHeight: 1.2 }}
          >
            Dapatkan <span className="text-green-600">Rekomendasi</span> Terbaik
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed mb-8">
            Bantu temukan metode pembelajaran yang paling relevan dengan profil 
            dan kebutuhan spesifik anak Anda melalui perhitungan algoritma cerdas.
          </p>
          <div className="flex justify-center">
            <div className="rounded-full shadow-sm" style={{ width: 60, height: 4, backgroundColor: "#16a34a" }} />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 py-10 flex-1">

        <StepIndicator langkahAktif={langkah} />

        {/* Pesan error / sukses */}
        {pesan.teks && (
          <div
            className="mb-6 px-4 py-3 rounded-xl text-sm font-medium border"
            style={{
              backgroundColor: pesan.tipe === "error" ? "#fee2e2" : "#dcfce7",
              color:           pesan.tipe === "error" ? "#b91c1c" : "#15803d",
              borderColor:     pesan.tipe === "error" ? "#fca5a5" : "#86efac",
            }}
          >
            {pesan.teks}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            LANGKAH 1 — PROFIL ANAK
        ══════════════════════════════════════════════════ */}
        {langkah >= 1 && (
          <div className={`mb-8 ${langkah !== 1 ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#0F741B" }}>1</div>
                <div>
                  <h2 className="font-bold text-gray-800">Profil Anak</h2>
                  <p className="text-xs text-gray-400">Filter untuk menyaring metode dari ontologi</p>
                </div>
              </div>
              {langkah > 1 && (
                <button onClick={() => setLangkah(1)} className="text-xs font-semibold underline" style={{ color: "#0F741B" }}>
                  Ubah
                </button>
              )}
            </div>

            {/* Jenis ABK */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-600 mb-3">
                Jenis Kebutuhan Khusus <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {JENIS_ABK.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => handlePilihJenis(j.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all"
                    style={{
                      borderColor:     jenisABK === j.id ? "#0F741B" : "#e5e7eb",
                      backgroundColor: jenisABK === j.id ? "#f0fdf4" : "#ffffff",
                    }}
                  >
                    {/* Icon spesifik per jenis ABK dari ICON_ABK map */}
                    {(() => {
                      const IkonABK = ICON_ABK[j.id];
                      return IkonABK ? (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: jenisABK === j.id ? "#0F741B" : "#f3f4f6",
                          }}
                        >
                          <IkonABK
                            size={22}
                            color={jenisABK === j.id ? "#ffffff" : "#9ca3af"}
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: jenisABK === j.id ? "#0F741B" : "#f3f4f6",
                            color:           jenisABK === j.id ? "#ffffff" : "#6b7280",
                          }}
                        >
                          {j.label.charAt(0)}
                        </div>
                      );
                    })()}
                    <span className="text-xs font-semibold text-center leading-tight"
                      style={{ color: jenisABK === j.id ? "#0F741B" : "#374151" }}>
                      {j.label}
                    </span>
                  </button>
                ))}
              </div>
              {jenisABK && (
                <p className="text-xs text-gray-400 mt-2 italic leading-relaxed">
                  {JENIS_ABK.find((j) => j.id === jenisABK)?.deskripsi}
                </p>
              )}
            </div>

            {/* Tingkat */}
            {jenisABK && TINGKAT_ABK[jenisABK] && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-600 mb-3">
                  Tingkat Kemampuan <span className="text-red-500">*</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TINGKAT_ABK[jenisABK].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleSetTingkat(t.value)}
                      className="text-left p-4 rounded-xl border-2 transition-all"
                      style={{
                        borderColor:     tingkat === t.value ? "#0F741B" : "#e5e7eb",
                        backgroundColor: tingkat === t.value ? "#f0fdf4" : "#ffffff",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold" style={{ color: tingkat === t.value ? "#0F741B" : "#374151" }}>
                          {t.label}
                        </span>
                        {tingkat === t.value && (
                          <IconCheck size={16} color="#0F741B" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{t.deskripsi}</p>
                      {t.catatan && (
                        <p className="text-xs mt-2 font-medium" style={{ color: "#0F741B" }}>{t.catatan}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Alat bantu */}
            {jenisABK && ALAT_BANTU[jenisABK] && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-600 mb-3">
                  {ALAT_BANTU[jenisABK].pertanyaan}
                </p>
                <div className="flex flex-wrap gap-3">
                  {ALAT_BANTU[jenisABK].pilihan.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setAlatBantu(p.value)}
                      className="px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        borderColor:     alatBantu === p.value ? "#0F741B" : "#e5e7eb",
                        backgroundColor: alatBantu === p.value ? "#f0fdf4" : "#ffffff",
                        color:           alatBantu === p.value ? "#0F741B" : "#374151",
                      }}
                    >
                      {alatBantu === p.value && (
                        <IconCheck size={14} color="#0F741B" className="shrink-0" />
                      )}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Jenjang */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Jenjang Pendidikan{" "}
                <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <select
                value={jenjang}
                onChange={(e) => setInput({ jenjang: e.target.value })}
                className="w-full md:w-64 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-600 bg-white"
              >
                {PILIHAN_JENJANG.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Tombol lanjut */}
            {langkah === 1 && (
              <button
                onClick={() => {
                  if (!jenisABK) { setPesan({ teks: "Pilih jenis kebutuhan khusus terlebih dahulu.", tipe: "error" }); return; }
                  if (!tingkat)  { setPesan({ teks: "Pilih tingkat kemampuan anak.", tipe: "error" }); return; }
                  setPesan({ teks: "", tipe: "" });
                  setLangkah(2);
                  // Fetch media dipindah ke useEffect agar terpanggil
                  // dari manapun langkah 2 dimasuki (onClick maupun tombol Ubah)
                }}
                className="text-white text-sm font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ backgroundColor: "#0F741B" }}
              >
                Lanjut ke Kriteria Penilaian
                <IconChevronRight size={16} color="white" />
              </button>
            )}
          </div>
        )}

        {langkah >= 2 && <hr className="border-gray-100 mb-8" />}

        {/* ══════════════════════════════════════════════════
            LANGKAH 2 — KRITERIA SAW
        ══════════════════════════════════════════════════ */}
        {langkah >= 2 && (
          <div className={`mb-8 ${langkah !== 2 ? "opacity-60 pointer-events-none" : ""}`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#0F741B" }}>2</div>
                <div>
                  <h2 className="font-bold text-gray-800">Kriteria Penilaian</h2>
                  <p className="text-xs text-gray-400">Personalisasi berdasarkan kondisi Anda</p>
                </div>
              </div>
              {langkah > 2 && (
                <button onClick={() => setLangkah(2)} className="text-xs font-semibold underline" style={{ color: "#0F741B" }}>
                  Ubah
                </button>
              )}
            </div>

            {/* Info bobot */}
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-bold text-blue-700 mb-1">Tentang Tingkat Kepentingan</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                Tingkat kepentingan skala 1–10 menunjukkan seberapa besar pengaruh suatu kriteria terhadap hasil rekomendasi.
                Nilai default ditetapkan berdasarkan hasil wawancara guru SLB dan referensi literatur metode pembelajaran ABK.
              </p>
            </div>

            <div className="flex flex-col gap-8">

              {/* C1: Media dari kandidat ontologi */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">C1</span>
                      <span className="text-sm font-bold text-gray-800">Media yang Tersedia di Rumah</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{DESKRIPSI_BOBOT.c1_media}</p>
                  </div>
                  <div className="shrink-0 text-center w-20">
                    <p className="text-xs text-gray-400 mb-1">Kepentingan</p>
                    <input
                      type="number" min="1" max="10"
                      value={bobot.c1_media}
                      onChange={(e) => handleSetBobot("c1_media", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-green-600"
                    />
                    <p className="text-xs text-gray-300 mt-0.5">
                      Porsi: {((bobot.c1_media / totalBobotNorm) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {loadingMedia ? (
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{ borderColor: "#0F741B", borderTopColor: "transparent" }} />
                    <span className="text-xs text-gray-400">Memuat media dari ontologi...</span>
                  </div>
                ) : mediaKandidat.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-xs">
                    Media akan dimuat berdasarkan profil anak yang dipilih
                  </div>
                ) : (
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex flex-col gap-4">
                    {/* Info bahwa media berasal dari ontologi */}
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Media berikut berasal dari metode-metode yang relevan untuk profil anak Anda,
                      dikelompokkan berdasarkan class ontologi MediaPembelajaran.
                      Centang media yang tersedia di rumah.
                    </p>
                    {mediaKandidat.map((kat) => (
                      <div key={kat.id}>
                        <p className="text-xs font-bold text-gray-600 mb-2">{kat.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {kat.media.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => toggleMedia(m.id)}
                              className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5"
                              style={{
                                backgroundColor: mediaDipilih.includes(m.id) ? "#dcfce7" : "#ffffff",
                                borderColor:     mediaDipilih.includes(m.id) ? "#0F741B" : "#d1d5db",
                                color:           mediaDipilih.includes(m.id) ? "#15803d" : "#374151",
                              }}
                            >
                              {mediaDipilih.includes(m.id) && (
                                <IconCheck size={12} color="#15803d" />
                              )}
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {mediaDipilih.length > 0 && (
                      <p className="text-xs font-semibold" style={{ color: "#0F741B" }}>
                        {mediaDipilih.length} media dipilih
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* C2: Waktu */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">C2</span>
                      <span className="text-sm font-bold text-gray-800">Waktu Pendampingan per Sesi</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{DESKRIPSI_BOBOT.c2_durasi}</p>
                  </div>
                  <div className="shrink-0 text-center w-20">
                    <p className="text-xs text-gray-400 mb-1">Kepentingan</p>
                    <input
                      type="number" min="1" max="10"
                      value={bobot.c2_durasi}
                      onChange={(e) => handleSetBobot("c2_durasi", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-green-600"
                    />
                    <p className="text-xs text-gray-300 mt-0.5">
                      Porsi: {((bobot.c2_durasi / totalBobotNorm) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="number" min="5" max="300"
                    value={waktuTersedia || ""}
                    onChange={(e) => setInput({ waktuTersedia: e.target.value })}
                    placeholder="Contoh: 30"
                    className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                  />
                  <span className="text-sm text-gray-500">menit per sesi</span>
                </div>
                {/* Tombol preset — tidak ada yang aktif saat belum dipilih */}
                <div className="flex flex-wrap gap-2">
                  {[10, 15, 20, 30, 45, 60, 90].map((n) => (
                    <button
                      key={n}
                      onClick={() => setInput({ waktuTersedia: String(n) })}
                      className="px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
                      style={{
                        backgroundColor: String(waktuTersedia) === String(n) ? "#0F741B" : "#ffffff",
                        borderColor:     String(waktuTersedia) === String(n) ? "#0F741B" : "#d1d5db",
                        color:           String(waktuTersedia) === String(n) ? "#ffffff" : "#374151",
                      }}
                    >
                      {n} menit
                    </button>
                  ))}
                </div>
              </div>

              {/* C3: Checklist kemandirian */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">C3</span>
                      <span className="text-sm font-bold text-gray-800">Kemampuan Anak Saat Ini</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{DESKRIPSI_BOBOT.c3_kemandirian}</p>
                  </div>
                  <div className="shrink-0 text-center w-20">
                    <p className="text-xs text-gray-400 mb-1">Kepentingan</p>
                    <input
                      type="number" min="1" max="10"
                      value={bobot.c3_kemandirian}
                      onChange={(e) => handleSetBobot("c3_kemandirian", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-green-600"
                    />
                    <p className="text-xs text-gray-300 mt-0.5">
                      Porsi: {((bobot.c3_kemandirian / totalBobotNorm) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {!jenisABK ? (
                  <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center text-gray-400 text-xs">
                    Pilih jenis kebutuhan khusus di Langkah 1 terlebih dahulu
                  </div>
                ) : (() => {
                  const rentang = RENTANG_USIA_MENTAL[
                    Object.keys(RENTANG_USIA_MENTAL).find(k => jenisABK.toLowerCase().includes(k.toLowerCase()))
                  ] || { min: 5, max: 18, default: 9 };
                  // nilaiSlider: posisi fisik thumb slider
                  //   - belum disentuh (null) → posisi paling kiri (min)
                  //   - sudah disentuh → nilai yang dipilih
                  const nilaiSlider = usiaMentalManual !== null ? usiaMentalManual : rentang.min;
                  const estimasiChecklist = checklistDipilih.length > 0
                    ? konversiChecklistKeUsiaMental(checklistDipilih, jenisABK)
                    : null;
                  // nilaiAktif: nilai yang ditampilkan & dikirim ke SAW
                  //   - belum disentuh & tidak ada checklist → null (belum diisi)
                  //   - sudah disentuh atau ada checklist → angka
                  const nilaiAktif = usiaMentalManual !== null
                    ? usiaMentalManual
                    : (estimasiChecklist ?? null);
                  return (
                    <div className="flex flex-col gap-4">
                      {/* Slider usia mental langsung */}
                      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-gray-600">Usia mental anak</p>
                          <span className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: nilaiAktif !== null ? "#f0fdf4" : "#f9fafb",
                              color:           nilaiAktif !== null ? "#0F741B" : "#9ca3af",
                            }}>
                            {nilaiAktif !== null ? `${nilaiAktif} tahun` : "Geser untuk memilih"}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={rentang.min}
                          max={rentang.max}
                          step={1}
                          value={nilaiSlider}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setUsiaMentalManual(val);
                            setInput({ usiaMental: val });
                            // Reset checklist jika user geser manual
                            if (checklistDipilih.length > 0) {
                              setInput({ checklist: [] });
                              setShowChecklist(false);
                            }
                          }}
                          className="w-full accent-green-700"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                          <span>{rentang.min} tahun</span>
                          <span>{rentang.max} tahun</span>
                        </div>
                      </div>

                      {/* Tombol panduan checklist */}
                      <button
                        onClick={() => setShowChecklist(v => !v)}
                        className="flex items-center gap-2 text-xs font-semibold transition-colors self-start"
                        style={{ color: "#0F741B" }}
                      >
                        <div className="w-4 h-4 rounded border-2 flex items-center justify-center"
                          style={{ borderColor: "#0F741B" }}>
                          {showChecklist
                            ? <IconCheck size={10} color="#0F741B" />
                            : <span className="text-[8px] font-bold" style={{ color: "#0F741B" }}>?</span>}
                        </div>
                        {showChecklist ? "Sembunyikan panduan" : "Saya tidak tahu usia mental anak saya — tampilkan panduan"}
                      </button>

                      {/* Checklist panduan — hanya muncul jika diminta */}
                      {showChecklist && (
                        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col gap-2.5">
                          <p className="text-xs text-gray-500 leading-relaxed mb-1">
                            Centang kemampuan yang sudah dimiliki anak. Sistem akan memperkirakan usia mental
                            secara otomatis dan mengisi slider di atas.
                          </p>
                          {(CHECKLIST_KEMANDIRIAN[
                            Object.keys(CHECKLIST_KEMANDIRIAN).find(k => jenisABK.toLowerCase().includes(k.toLowerCase()))
                          ] || []).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                toggleChecklist(item.id);
                                // Update slider dari hasil checklist
                                const baru = checklistDipilih.includes(item.id)
                                  ? checklistDipilih.filter(x => x !== item.id)
                                  : [...checklistDipilih, item.id];
                                const est = konversiChecklistKeUsiaMental(baru, jenisABK);
                                setUsiaMentalManual(null); // Biarkan checklist yang tentukan
                                setInput({ usiaMental: est });
                              }}
                              className="flex items-start gap-3 text-left w-full"
                            >
                              <div
                                className="mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors"
                                style={{
                                  backgroundColor: checklistDipilih.includes(item.id) ? "#0F741B" : "#ffffff",
                                  borderColor:     checklistDipilih.includes(item.id) ? "#0F741B" : "#d1d5db",
                                }}
                              >
                                {checklistDipilih.includes(item.id) && <IconCheck size={9} color="white" />}
                              </div>
                              <span className="text-sm text-gray-700 leading-relaxed">{item.label}</span>
                            </button>
                          ))}
                          {estimasiChecklist && (
                            <div className="mt-1 pt-2 border-t border-gray-200">
                              <p className="text-xs" style={{ color: "#0F741B" }}>
                                Estimasi dari checklist: <strong>{estimasiChecklist} tahun</strong>
                                <span className="text-gray-400 ml-1">({checklistDipilih.length} kemampuan dicentang)</span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* C4: Kesibukan */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">C4</span>
                      <span className="text-sm font-bold text-gray-800">Tingkat Kesibukan Orang Tua</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{DESKRIPSI_BOBOT.c4_pendampingan}</p>
                  </div>
                  <div className="shrink-0 text-center w-20">
                    <p className="text-xs text-gray-400 mb-1">Kepentingan</p>
                    <input
                      type="number" min="1" max="10"
                      value={bobot.c4_pendampingan}
                      onChange={(e) => handleSetBobot("c4_pendampingan", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-green-600"
                    />
                    <p className="text-xs text-gray-300 mt-0.5">
                      Porsi: {((bobot.c4_pendampingan / totalBobotNorm) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <select
                  value={kesibukanOrtu}
                  onChange={(e) => setInput({ kesibukanOrtu: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 bg-white"
                >
                  {PILIHAN_KESIBUKAN.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pesan error inline — muncul tepat di atas tombol submit agar terlihat */}
            {pesan.tipe === "error" && pesan.teks && langkah === 2 && (
              <div className="px-4 py-3 rounded-xl text-sm font-medium border mt-4"
                style={{ backgroundColor: "#fee2e2", color: "#b91c1c", borderColor: "#fca5a5" }}>
                {pesan.teks}
              </div>
            )}

            {/* Tombol aksi langkah 2 */}
            {langkah === 2 && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleRekomendasi}
                  disabled={isLoading}
                  className="flex-1 text-white text-sm font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#0F741B" }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menghitung...
                    </>
                  ) : (
                    <>
                      Dapatkan Rekomendasi
                      <IconChevronRight size={16} color="white" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setLangkah(1)}
                  className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
              </div>
            )}
          </div>
        )}

        {langkah >= 3 && <hr className="border-gray-100 mb-8" />}

        {/* ══════════════════════════════════════════════════
            LANGKAH 3 — HASIL
        ══════════════════════════════════════════════════ */}
        {langkah === 3 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#0F741B" }}>3</div>
                <div>
                  <h2 className="font-bold text-gray-800">Hasil Rekomendasi</h2>
                  <p className="text-xs text-gray-400">{hasilData.length} metode diurutkan berdasarkan tingkat kesesuaian</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {riwayatDisimpan && (
                  <Link
                    href="/fitur/riwayat"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                    style={{ color: "#0F741B", borderColor: "#0F741B" }}
                  >
                    Lihat Riwayat
                  </Link>
                )}
                <button
                  onClick={() => setKonfirmasiReset(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-20 gap-3">
                <div className="w-7 h-7 border-4 rounded-full animate-spin" style={{ borderColor: "#0F741B", borderTopColor: "transparent" }} />
                <span className="text-gray-400 text-sm">Sedang mencarikan metode yang paling sesuai untuk Anda...</span>
              </div>
            )}

            {/* Kartu hasil */}
            {!isLoading && hasilData.length > 0 && (
              <div className="flex flex-col gap-4">
                {hasilData.map((m, i) => {
                  const badge = badgeSkor(m.skor);
                  const paling = i === 0;
                  return (
                    <div
                      key={m.idMetode}
                      className="border rounded-2xl p-5 transition-all hover:shadow-sm"
                      style={{
                        borderColor:     paling ? "#0F741B" : "#f3f4f6",
                        backgroundColor: paling ? "#f0fdf4" : "#ffffff",
                      }}
                    >
                      {/* Header kartu */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              backgroundColor: paling ? "#0F741B" : "#f3f4f6",
                              color:           paling ? "#ffffff" : "#6b7280",
                            }}
                          >
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            {paling && (
                              <span
                                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5"
                                style={{ backgroundColor: "#0F741B", color: "#ffffff" }}
                              >
                                <IconStar size={10} color="white" />
                                Paling Direkomendasikan
                              </span>
                            )}
                            <p className="font-bold text-gray-900 leading-snug">{m.namaMetode}</p>
                            <p className="text-xs font-mono text-gray-300 mt-0.5">{m.idMetode}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: badge.bg, color: badge.warna }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Tujuan */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{m.tujuanMetode}</p>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-400 font-medium">Tingkat Kesesuaian</span>
                          <span className="text-sm font-bold" style={{ color: badge.warna }}>
                            {(m.skor * 100).toFixed(1)}%
                          </span>
                        </div>
                        <ProgressBar skor={m.skor} warna={badge.bar} />
                      </div>

                      {/* Footer kartu */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Durasi: {m.durasiPembelajaran}</p>
                        <div className="flex gap-2">
                          {/* Tombol detail perhitungan — tampil jika data normalisasi tersedia */}
                          {m.normC1 !== undefined && (
                            <button
                              onClick={() => setModalMetode(m)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                              style={{ color: "#6b7280", borderColor: "#e5e7eb" }}
                            >
                              Lihat Cara Penghitungan
                            </button>
                          )}
                          <Link
                            href={`/fitur/detail/${m.idMetode}`}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                            style={{ color: "#0F741B", borderColor: "#0F741B" }}
                          >
                            Lihat Metode →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tidak ada hasil */}
            {!isLoading && hasilData.length === 0 && (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl px-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-100">
                    <IconSearch size={26} color="#d1d5db" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Tidak ada metode yang cocok
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mb-5 max-w-xs mx-auto">
                  Tidak ditemukan metode yang sesuai dengan kombinasi profil anak dan kriteria saat ini.
                  Coba ubah jenjang, kurangi filter media, atau sesuaikan kriteria penilaian.
                </p>
                <button
                  onClick={() => setLangkah(2)}
                  className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border-2 transition-all hover:opacity-80"
                  style={{ borderColor: "#0F741B", color: "#0F741B" }}>
                  <IconFilter size={13} color="#0F741B" />
                  Ubah Kriteria Pencarian
                </button>
              </div>
            )}

            {/* Ubah kriteria */}
            {!isLoading && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setLangkah(2)}
                  className="w-full py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "#0F741B", color: "#0F741B" }}
                >
                  Ubah Kriteria Penilaian & Cari Lagi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog konfirmasi reset */}
      {konfirmasiReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setKonfirmasiReset(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-900 mb-2">Reset semua data?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Semua input dan hasil rekomendasi akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={doReset}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Ya, Reset
              </button>
              <button
                onClick={() => setKonfirmasiReset(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detail perhitungan SAW */}
      {modalMetode && (
        <ModalPerhitungan metode={modalMetode} onTutup={() => setModalMetode(null)} />
      )}
    </main>
  );
}