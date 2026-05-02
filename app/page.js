"use client"; // Wajib untuk menggunakan hooks seperti useEffect

import { useEffect, useState } from "react";
import { getHelloFromFlask } from "./lib/api"; // Import fungsi yang kita buat tadi
import HeroSection from "./components/dashboard/Hero";
import LangkahSection from "./components/dashboard/Langkah";
import StatistikSection from "./components/dashboard/Statistik"; // Import Statistik
import QuoteSection from "./components/dashboard/Quote";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <LangkahSection />
      <StatistikSection />
      <QuoteSection />
    </main>
  );
}