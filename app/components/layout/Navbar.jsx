// abk-frontend/app/components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_INFO = [
  { label: "Beranda", href: "/" },
  { label: "Edukasi", href: "/fitur/edukasi" },
  { label: "Tentang", href: "/fitur/tentang" },
];

const MENU_AKSI = [
  { label: "Katalog", href: "/fitur/katalog", tipe: "outline" },
  { label: "Rekomendasi", href: "/fitur/rekomendasi", tipe: "solid" },
  {
    label: "Riwayat", href: "/fitur/riwayat", tipe: "icon",
    ikon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Perbaikan logika aktif agar lebih akurat
  const isAktif = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6 relative">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 hover:opacity-80 transition-opacity">
          {/* Pastikan file ada di /public/img/logoo.png */}
          <img src="/img/logoo.png" alt="SERUPA" className="h-10 w-auto md:h-12 object-contain"/>
        </Link>

        {/* Menu tengah - Hidden di Mobile */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {MENU_INFO.map((item) => {
            const aktif = isAktif(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${aktif ? 'font-semibold' : 'hover:bg-gray-50'}`}
                style={{
                  color: aktif ? "#0F741B" : "#6b7280",
                  backgroundColor: aktif ? "#f0fdf4" : "transparent"
                }}>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Menu kanan - Hidden di Mobile */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {MENU_AKSI.map((item) => {
            const aktif = isAktif(item.href);
            if (item.tipe === "icon") return (
              <Link key={item.href} href={item.href} title={item.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:shadow-md"
                style={{ color: aktif ? "#0F741B" : "#9ca3af", backgroundColor: aktif ? "#f0fdf4" : "transparent", border: aktif ? "1px solid #dcfce7" : "1px solid transparent" }}>
                {item.ikon}
              </Link>
            );
            if (item.tipe === "outline") return (
              <Link key={item.href} href={item.href}
                className="flex items-center px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm"
                style={{ borderColor: aktif ? "#0F741B" : "#e5e7eb", color: aktif ? "#0F741B" : "#374151", backgroundColor: aktif ? "#f0fdf4" : "#ffffff" }}>
                {item.label}
              </Link>
            );
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 shadow-md hover:shadow-green-900/20 transition-all"
                style={{ backgroundColor: "#0F741B" }}>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Hamburger mobile */}
        <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 animate-in slide-in-from-top duration-300">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4 px-4">Informasi</p>
          <div className="flex flex-col gap-1 mb-6">
            {MENU_INFO.map((item) => {
              const aktif = isAktif(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ color: aktif ? "#0F741B" : "#374151", backgroundColor: aktif ? "#f0fdf4" : "transparent", fontWeight: aktif ? "700" : "500" }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 mb-4 px-4">Fitur Utama</p>
          <div className="flex flex-col gap-2">
            <Link href="/fitur/rekomendasi" onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center px-4 py-4 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: "#0F741B" }}>
              Dapatkan Rekomendasi
            </Link>
            <div className="grid grid-cols-2 gap-2">
                <Link href="/fitur/katalog" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
                Katalog
                </Link>
                <Link href="/fitur/riwayat" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
                Riwayat
                </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}