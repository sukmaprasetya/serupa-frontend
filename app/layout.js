// abk-frontend/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/layout/Navbar"; // Cek apakah path ini benar
import Footer from "./components/layout/Footer"; // Cek apakah path ini benar
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = {
  title: {
    default:  "SERUPA — Sistem Edukasi Rekomendasi Untuk Pembelajaran ABK",
    template: "%s | SERUPA",
  },
  description:
    "Sistem Edukasi Rekomendasi Untuk Pembelajaran ABK berbasis Ontologi dan Algoritma SAW.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}