"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getInfoOntologi } from "../../lib/api";

const IKON_STAT = {
  metode:  "/img/book.png",
  jenis:   "/img/group.png",
  jenjang: "/img/study.png",
  media:   "/img/layers.png",
};

function CountUp({ target, duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const sudahJalan = useRef(false);

  useEffect(() => {
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sudahJalan.current) {
          sudahJalan.current = true;
          let start = null;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setVal(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{val.toLocaleString("id-ID")}</span>;
}

export default function StatistikSection() {
  const [stat, setStat] = useState({
    totalMetode: 0,
    totalJenis: 0,
    totalJenjang: 0,
    totalMedia: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInfoOntologi();
        setStat({
          totalMetode:  data.total_metode || 243,
          totalJenis:   hitungJenisInduk(data.jenis_abk || []),
          totalJenjang: data.jenjang?.length || 6,
          totalMedia:   data.total_media || 340,
        });
      } catch {
        setStat({ totalMetode: 243, totalJenis: 5, totalJenjang: 6, totalMedia: 340 });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayData = [
    { tipe: "metode",  nilai: stat.totalMetode,  label: "Metode Belajar", sub: "Tervalidasi Ontologi" },
    { tipe: "jenis",   nilai: stat.totalJenis,   label: "Jenis ABK",      sub: "Kategori Utama"      },
    { tipe: "jenjang", nilai: stat.totalJenjang, label: "Jenjang",        sub: "SMPLB & SMALB"       },
    { tipe: "media",   nilai: stat.totalMedia,   label: "Media Belajar",  sub: "Digital & Fisik"     },
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* ── Header: stack di mobile, row di desktop ── */}
        <div className="mb-10 md:mb-16">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-green-600 mb-3">
            Data & Metodologi
          </p>
          {/* Judul + deskripsi: kolom di mobile, berdampingan di md */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight max-w-xl leading-snug">
              Dibangun di Atas Basis Pengetahuan yang Luas
            </h2>
            <p className="text-gray-500 text-sm md:max-w-xs leading-relaxed md:shrink-0">
              Seluruh data bersumber dari riset ontologi terstruktur untuk memastikan rekomendasi yang akurat.
            </p>
          </div>
        </div>

        {/* ── Grid kartu: 2 kolom di mobile, 4 kolom di lg ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {displayData.map((item) => (
            <div
              key={item.tipe}
              className="group rounded-2xl border border-gray-100 bg-gray-50/50
                         hover:bg-white hover:shadow-xl hover:shadow-green-900/5
                         transition-all duration-500
                         p-4 md:p-6 lg:p-8
                         flex flex-col gap-3"
            >
              {/* Ikon — ukuran lebih kecil di mobile */}
              <div className="relative w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10
                              transition-transform group-hover:scale-110 shrink-0">
                <Image
                  src={IKON_STAT[item.tipe]}
                  alt={item.label}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Angka — lebih kecil di mobile agar tidak overflow */}
              <p className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900
                            tabular-nums tracking-tighter leading-none">
                {loading ? (
                  <span className="text-gray-200 animate-pulse">···</span>
                ) : (
                  <CountUp target={item.nilai} />
                )}
              </p>

              {/* Label */}
              <div>
                <p className="text-xs md:text-sm font-bold text-gray-800 leading-snug">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function hitungJenisInduk(jenisAbkList) {
  const INDUK = ["Autis", "Tunagrahita", "Tunarungu", "Tunanetra", "Tunadaksa"];
  if (!jenisAbkList.length) return 5;
  const ditemukan = new Set(
    jenisAbkList
      .map((j) => INDUK.find((induk) => j.startsWith(induk)))
      .filter(Boolean)
  );
  return ditemukan.size || 5;
}