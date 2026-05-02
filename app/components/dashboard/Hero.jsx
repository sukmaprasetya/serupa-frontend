"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const PHOTOS = [
  { src: "/img/Anak1.jpg", tilt: "left-far" },
  { src: "/img/Anak2.jpg", tilt: "left-mid" },
  { src: "/img/Anak3.jpg", tilt: "left-near" },
  { src: "/img/Anak4.jpg", tilt: "center" },
  { src: "/img/Anak5.jpg", tilt: "right-near" },
  { src: "/img/Anak6.jpg", tilt: "right-mid" },
  { src: "/img/Anak7.jpg", tilt: "right-far" },
];

const tiltStyles = {
  "left-far":   { width: 95,  height: 148, transform: "perspective(1000px) rotateY(24deg) translateX(-12px)", opacity: 0.4,  borderRadius: 16 },
  "left-mid":   { width: 130, height: 188, transform: "perspective(1000px) rotateY(14deg)", opacity: 0.72, borderRadius: 18 },
  "left-near":  { width: 148, height: 210, transform: "perspective(1000px) rotateY(6deg)",  opacity: 0.9,  borderRadius: 20 },
  "center":     { width: 162, height: 230, transform: "none", opacity: 1, borderRadius: 22, boxShadow: "0 20px 48px rgba(0,0,0,0.14)", zIndex: 10 },
  "right-near": { width: 148, height: 210, transform: "perspective(1000px) rotateY(-6deg)", opacity: 0.9,  borderRadius: 20 },
  "right-mid":  { width: 130, height: 188, transform: "perspective(1000px) rotateY(-14deg)", opacity: 0.72, borderRadius: 18 },
  "right-far":  { width: 95,  height: 148, transform: "perspective(1000px) rotateY(-24deg) translateX(12px)", opacity: 0.4, borderRadius: 16 },
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
      <section
        className="relative flex flex-col items-center overflow-hidden px-6"
        style={{
          background: "linear-gradient(to bottom, #f0fdf4 0%, #fafffe 25%, #ffffff 55%)",
          paddingTop: 48,
          paddingBottom: 0,
          minHeight: "100vh",
        }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
          style={{
            border: "1.5px solid #86efac",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          <span
            className="font-bold uppercase tracking-widest"
            style={{ fontSize: 9.5, color: "#6b7280", letterSpacing: "0.13em" }}
          >
            Sistem Rekomendasi SAW & Ontologi
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-center font-black mb-5 max-w-4xl"
          style={{
            fontSize: "clamp(28px, 3.8vw, 40px)",
            color: "#1a2e1a",
            lineHeight: 1.25,
          }}
        >
          Dukung Cahaya Uniknya,{" "}
          <span style={{ color: "#16a34a" }}>Temukan Jalan Belajar Terbaik</span>{" "}
          bagi Buah Hati Anda
        </h1>

        {/* Subheadline */}
        <p
          className="text-center max-w-sm mb-6 px-2"
          style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65 }}
        >
          Kami menghadirkan rekomendasi pembelajaran untuk membantu menemukan
          metode belajar mandiri yang paling tepat sesuai kebutuhan unik setiap anak.
        </p>

        {/* Photo Strip */}
        <div
          className="w-full flex items-end justify-center mb-8"
          style={{ gap: 8, paddingLeft: 4, paddingRight: 4 }}
        >
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative shrink-0 overflow-hidden group transition-all duration-500 hover:scale-105 hover:opacity-100 hover:z-20"
              style={{
                ...tiltStyles[photo.tilt],
                borderRadius: 18,                                   // konsisten semua kartu
                boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)", // mengapung
              }}
            >
              <div
                className="absolute inset-0 group-hover:bg-transparent transition-colors z-10"
                style={{ background: "rgba(0,0,0,0.03)" }}
              />
              <Image
                src={photo.src}
                alt={`Anak berkebutuhan khusus ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="200px"
                priority={i === 3}
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="#langkah"
          className="group inline-flex items-center gap-2.5 font-bold rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-all duration-300 hover:bg-green-600 hover:border-green-600 hover:text-white hover:-translate-y-0.5 mb-6"
          style={{ fontSize: 13, padding: "12px 32px" }}
        >
          Mulai Pelajari
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>

      </section>
  );
}