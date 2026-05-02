"use client";

import { useState } from "react";
import Link from "next/link";
import { useRekomendasiStore } from "../../store/rekomendasiStore";
import {
  IconUser, IconGraduationCap, IconClock, IconBrain,
  IconBox, IconUsers, IconBook, IconPin,
  IconClipboard, IconAlertTriangle, IconArrowRight,
  IconMonitor, IconTimer, IconTrendingUp, IconHandshake,
  IconTrash, IconX,
} from "../../components/icons";

// ── Label & helper ────────────────────────────────────────────────────────

const LABEL_JENIS = {
  Autis:       "Autis",
  Tunagrahita: "Tunagrahita",
  Tunarungu:   "Tunarungu",
  Tunanetra:   "Tunanetra",
  Tunadaksa:   "Tunadaksa",
};

function labelKesesuaian(skor) {
  if (skor >= 0.85) return { teks: "Sangat Cocok",    warna: "#0F741B", bg: "#f0fdf4", border: "#bbf7d0" };
  if (skor >= 0.65) return { teks: "Cukup Cocok",     warna: "#d97706", bg: "#fffbeb", border: "#fde68a" };
  return                    { teks: "Perlu Dicermati", warna: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };
}

function BadgeKesesuaian({ skor }) {
  const cfg = labelKesesuaian(skor);
  return (
    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full border"
      style={{ backgroundColor: cfg.bg, color: cfg.warna, borderColor: cfg.border }}>
      {cfg.teks}
    </span>
  );
}

// ── Ringkasan kondisi anak ────────────────────────────────────────────────
function RingkasanKondisi({ inputForm }) {
  const items = [
    {
      Ic: IconUser,
      label: "Kondisi anak",
      nilai: [inputForm?.jenisABK, inputForm?.tingkatABK].filter(Boolean).join(" — ") || "—",
    },
    {
      Ic: IconGraduationCap,
      label: "Jenjang",
      nilai: inputForm?.jenjang || "Semua jenjang",
    },
    {
      Ic: IconClock,
      label: "Waktu latihan",
      nilai: inputForm?.waktuTersedia ? `${inputForm.waktuTersedia} menit per sesi` : "—",
    },
    {
      Ic: IconBrain,
      label: "Usia mental anak",
      nilai: inputForm?.usiaMental ? `Sekitar ${inputForm.usiaMental} tahun` : "—",
    },
    {
      Ic: IconBox,
      label: "Media tersedia",
      nilai: inputForm?.mediaDimiliki?.length
        ? `${inputForm.mediaDimiliki.length} jenis media`
        : "Tidak ada",
    },
    {
      Ic: IconUsers,
      label: "Waktu pendampingan",
      nilai: (() => {
        const k = inputForm?.kesibukanOrtu;
        if (k == null || k === "") return "—";
        if (k > 10) return `Sekitar ${k} menit/hari`;
        if (k <= 3) return "Waktu pendampingan terbatas";
        if (k <= 6) return "Waktu pendampingan sedang";
        return "Banyak waktu mendampingi";
      })(),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ Ic, label, nilai }) => (
        <div key={label} className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-start gap-2.5">
          <div className="shrink-0 mt-0.5 text-gray-400">
            <Ic size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className="text-xs font-semibold text-gray-700 leading-snug">{nilai}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Bobot prioritas SAW ───────────────────────────────────────────────────
const LABEL_BOBOT = {
  c1_media:        { label: "Ketersediaan media",     IkonBobot: IconMonitor    },
  c2_durasi:       { label: "Durasi latihan",          IkonBobot: IconTimer      },
  c3_kemandirian:  { label: "Kemampuan anak saat ini", IkonBobot: IconTrendingUp },
  c4_pendampingan: { label: "Waktu pendampingan",      IkonBobot: IconHandshake  },
};

function BobotPrioritas({ bobot }) {
  const entri = Object.entries(bobot)
    .map(([key, val]) => ({ key, val: Number(val), ...LABEL_BOBOT[key] }))
    .filter(e => e.label)
    .sort((a, b) => b.val - a.val);

  const maks = entri[0]?.val || 1;

  return (
    <div className="flex flex-col gap-3">
      {entri.map(({ key, val, label, IkonBobot }) => {
        const pct = Math.round((val / maks) * 100);
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-600 flex items-center gap-1.5">
                <IkonBobot size={13} color="#9ca3af" />
                {label}
              </span>
              <span className="text-xs font-semibold text-gray-500">Bobot {val}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: "#0F741B" }} />
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
        Bobot lebih tinggi berarti kriteria tersebut lebih berpengaruh pada hasil rekomendasi.
      </p>
    </div>
  );
}

// ── Deteksi duplikasi ─────────────────────────────────────────────────────
function adaDuplikasi(riwayat, id) {
  const r = riwayat.find(x => x.id === id);
  if (!r) return false;
  return riwayat.some(x =>
    x.id !== id &&
    x.inputForm?.jenisABK   === r.inputForm?.jenisABK &&
    x.inputForm?.tingkatABK === r.inputForm?.tingkatABK
  );
}

// ── Halaman utama ──────────────────────────────────────────────────────────
export default function RiwayatPage() {
  const { riwayat, resetSemua } = useRekomendasiStore();

  const [terpilih,     setTerpilih]     = useState(null);
  const [konfirmHapus, setKonfirmHapus] = useState(false);

  const handleHapusSemua = () => {
    resetSemua();
    setTerpilih(null);
    setKonfirmHapus(false);
  };

  const entriAktif = riwayat.find((r) => r.id === terpilih);

  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Header */}
      <section className="border-b border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Riwayat Pencarian
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Rekomendasi metode yang pernah Anda cari sebelumnya.
            </p>
          </div>

          {riwayat.length > 0 && (
            !konfirmHapus ? (
              <button
                onClick={() => setKonfirmHapus(true)}
                className="flex items-center gap-1.5 text-xs text-red-400 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors self-start">
                <IconTrash size={13} color="#f87171" />
                Hapus Semua
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start">
                <p className="text-xs text-red-500">Yakin hapus semua?</p>
                <button onClick={handleHapusSemua}
                  className="text-xs text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                  Ya, hapus
                </button>
                <button onClick={() => setKonfirmHapus(false)}
                  className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <IconX size={12} color="#6b7280" />
                  Batal
                </button>
              </div>
            )
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1">

        {/* ── Kosong ── */}
        {riwayat.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-100">
                <IconClipboard size={28} color="#d1d5db" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Belum ada pencarian</p>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Setiap kali Anda mendapatkan rekomendasi metode, hasilnya akan tersimpan di sini.
            </p>
            <Link href="/fitur/rekomendasi"
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0F741B" }}>
              Cari Rekomendasi Sekarang
              <IconArrowRight size={14} color="white" />
            </Link>
          </div>
        )}

        {/* ── Ada riwayat ── */}
        {riwayat.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Kolom kiri */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <p className="text-xs text-gray-400 mb-1">
                {riwayat.length} pencarian tersimpan — pilih untuk melihat detail
              </p>

              {riwayat.map((r) => {
                const kesesuaian = r.topMetode ? labelKesesuaian(r.topMetode.skor) : null;
                const aktif      = terpilih === r.id;
                const duplikat   = adaDuplikasi(riwayat, r.id);

                return (
                  <button key={r.id}
                    onClick={() => setTerpilih(aktif ? null : r.id)}
                    className="text-left w-full rounded-xl border-2 px-4 py-3.5 transition-all hover:shadow-sm"
                    style={{
                      borderColor:     aktif ? "#0F741B" : "#f3f4f6",
                      backgroundColor: aktif ? "#f0fdf4" : "white",
                    }}>

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-bold text-gray-800 leading-snug">
                        {LABEL_JENIS[r.inputForm?.jenisABK] || r.inputForm?.jenisABK || "—"}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                        {r.tanggal}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-2 leading-snug">
                      {r.inputForm?.tingkatABK || "—"}
                    </p>

                    {duplikat && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <IconAlertTriangle size={11} color="#f59e0b" />
                        <p className="text-[10px] text-amber-500">
                          Profil serupa dengan pencarian lain
                        </p>
                      </div>
                    )}

                    {r.topMetode && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <IconPin size={11} color="#9ca3af" />
                          <p className="text-xs text-gray-500 truncate">
                            {r.topMetode.namaMetode}
                          </p>
                        </div>
                        {kesesuaian && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0"
                            style={{
                              backgroundColor: kesesuaian.bg,
                              color:           kesesuaian.warna,
                              borderColor:     kesesuaian.border,
                            }}>
                            {kesesuaian.teks}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Kolom kanan */}
            <div className="lg:col-span-3">
              {!entriAktif ? (
                <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-2xl py-20">
                  <p className="text-xs text-gray-400 text-center px-6">
                    Pilih salah satu pencarian di sebelah kiri untuk melihat detail rekomendasi
                  </p>
                </div>
              ) : (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">

                  {/* Header detail */}
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{entriAktif.tanggal}</p>
                        <p className="text-base font-bold text-gray-800">
                          {LABEL_JENIS[entriAktif.inputForm?.jenisABK] || entriAktif.inputForm?.jenisABK}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {entriAktif.inputForm?.tingkatABK}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metode terbaik */}
                  {entriAktif.topMetode && (
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                        Metode Paling Direkomendasikan
                      </p>
                      <Link href={`/fitur/detail/${entriAktif.topMetode.idMetode}`}
                        className="flex items-center gap-4 rounded-xl border-2 px-4 py-4 transition-all hover:shadow-sm group"
                        style={{ borderColor: "#d1fae5", backgroundColor: "#f0fdf4" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#dcfce7" }}>
                          <IconBook size={18} color="#0F741B" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors leading-snug">
                            {entriAktif.topMetode.namaMetode}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <BadgeKesesuaian skor={entriAktif.topMetode.skor} />
                            <span className="text-xs text-gray-400">
                              dari {entriAktif.totalHasil ?? 1} metode yang ditemukan
                            </span>
                          </div>
                        </div>
                        <IconArrowRight size={16} color="#6ee7b7"
                          className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}

                  {/* Kondisi anak */}
                  <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                      Kondisi Anak Saat Dicari
                    </p>
                    <RingkasanKondisi inputForm={entriAktif.inputForm} />
                  </div>

                  {/* Bobot prioritas */}
                  {entriAktif.inputForm?.bobot && (
                    <div className="px-5 py-4">
                      <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">
                        Prioritas yang Anda Tetapkan
                      </p>
                      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                        Sistem menyesuaikan rekomendasi berdasarkan tingkat kepentingan berikut:
                      </p>
                      <BobotPrioritas bobot={entriAktif.inputForm.bobot} />
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}