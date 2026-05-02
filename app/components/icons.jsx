/**
 * app/components/icons.jsx
 * ─────────────────────────────────────────────────────────────
 * Kumpulan icon SVG untuk SERUPA.
 * Semua icon menerima props: size (default 16), color (default "currentColor"), className.
 * Gunakan dengan: <IconNama size={20} color="#0F741B" />
 *
 * Sumber: Heroicons (MIT) — https://heroicons.com
 * ─────────────────────────────────────────────────────────────
 */

function Icon({ size = 16, color = "currentColor", className = "", children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ── Pengguna & Anak ───────────────────────────────────────────

/** Digunakan untuk: kondisi anak, profil pengguna */
export function IconUser(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </Icon>
  );
}

/** Digunakan untuk: jenis kebutuhan khusus (ABK) */
export function IconHeart(props) {
  return (
    <Icon {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Icon>
  );
}

// ── Akademik & Jenjang ────────────────────────────────────────

/** Digunakan untuk: jenjang pendidikan */
export function IconGraduationCap(props) {
  return (
    <Icon {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
      <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5" />
    </Icon>
  );
}

/** Digunakan untuk: metode/buku panduan */
export function IconBook(props) {
  return (
    <Icon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Icon>
  );
}

// ── Waktu ─────────────────────────────────────────────────────

/** Digunakan untuk: durasi latihan, waktu sesi */
export function IconClock(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

/** Digunakan untuk: tanggal riwayat */
export function IconCalendar(props) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </Icon>
  );
}

// ── Otak & Kemampuan ─────────────────────────────────────────

/** Digunakan untuk: usia mental, kemampuan kognitif */
export function IconBrain(props) {
  return (
    <Icon {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
    </Icon>
  );
}

/** Digunakan untuk: kemampuan anak saat ini (kriteria kemandirian) */
export function IconStar(props) {
  return (
    <Icon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  );
}

// ── Media & Alat ─────────────────────────────────────────────

/** Digunakan untuk: media tersedia, ketersediaan alat */
export function IconBox(props) {
  return (
    <Icon {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </Icon>
  );
}

// ── Pendampingan & Keluarga ───────────────────────────────────

/** Digunakan untuk: waktu pendampingan orang tua */
export function IconUsers(props) {
  return (
    <Icon {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Icon>
  );
}

// ── Navigasi & Aksi ───────────────────────────────────────────

/** Digunakan untuk: panah navigasi, tombol lanjut */
export function IconArrowRight(props) {
  return (
    <Icon {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  );
}

/** Digunakan untuk: tombol kembali */
export function IconArrowLeft(props) {
  return (
    <Icon {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Icon>
  );
}

/** Digunakan untuk: external link, buka detail */
export function IconExternalLink(props) {
  return (
    <Icon {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 1 2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </Icon>
  );
}

/** Digunakan untuk: pin/penanda metode terbaik */
export function IconPin(props) {
  return (
    <Icon {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </Icon>
  );
}

// ── Status & Feedback ─────────────────────────────────────────

/** Digunakan untuk: state kosong, tidak ada data */
export function IconClipboard(props) {
  return (
    <Icon {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </Icon>
  );
}

/** Digunakan untuk: berhasil, centang */
export function IconCheck(props) {
  return (
    <Icon {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}

/** Digunakan untuk: peringatan duplikasi */
export function IconAlertTriangle(props) {
  return (
    <Icon {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9"  x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

/** Digunakan untuk: informasi tambahan */
export function IconInfo(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8"  x2="12.01" y2="8" />
    </Icon>
  );
}

// ── Bobot & Prioritas ─────────────────────────────────────────

/** Digunakan untuk: bobot media (C1) */
export function IconMonitor(props) {
  return (
    <Icon {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </Icon>
  );
}

/** Digunakan untuk: bobot durasi (C2) */
export function IconTimer(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3 2 6" />
      <path d="m19 3 3 3" />
      <path d="M10 3h4" />
    </Icon>
  );
}

/** Digunakan untuk: bobot kemandirian anak (C3) */
export function IconTrendingUp(props) {
  return (
    <Icon {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Icon>
  );
}

/** Digunakan untuk: bobot pendampingan (C4) */
export function IconHandshake(props) {
  return (
    <Icon {...props}>
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </Icon>
  );
}

// ── Pencarian ─────────────────────────────────────────────────

/** Digunakan untuk: search, eksplorasi */
export function IconSearch(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}

/** Digunakan untuk: filter */
export function IconFilter(props) {
  return (
    <Icon {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </Icon>
  );
}

// ── Hapus ─────────────────────────────────────────────────────

/** Digunakan untuk: hapus riwayat */
export function IconTrash(props) {
  return (
    <Icon {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Icon>
  );
}

/** Digunakan untuk: tutup, dismiss */
export function IconX(props) {
  return (
    <Icon {...props}>
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </Icon>
  );
}

// ── Chevron ───────────────────────────────────────────────────

/** Digunakan untuk: expand/collapse */
export function IconChevronDown(props) {
  return (
    <Icon {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  );
}

export function IconChevronRight(props) {
  return (
    <Icon {...props}>
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  );
}

// ── Icon Jenis ABK ────────────────────────────────────────────
// Satu icon per jenis ABK untuk menggantikan emoji di kartu pilihan

/** Autis — puzzle piece (melambangkan spektrum dan kompleksitas) */
export function IconAutis(props) {
  return (
    <Icon {...props}>
      <path d="M12 2a2 2 0 0 1 2 2c0 .5-.18.96-.47 1.32L15 7h3a2 2 0 0 1 2 2v2.53A2 2 0 0 1 22 13a2 2 0 0 1-2 2v3a2 2 0 0 1-2 2H9l-2-2H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 0-4V9a2 2 0 0 1 2-2h3L9.47 5.32A2 2 0 0 1 9 4a2 2 0 0 1 2-2h1z" />
    </Icon>
  );
}

/** Tunagrahita — Otak */
export function IconTunagrahita(props) {
  const { color = "currentColor", ...rest } = props;
  return (
    <Icon {...rest} color={color}>
      <path
        fill={color}
        stroke="none"
        d="M14 18l-2 4-2-4 4 0z"
      />
      <path
        d="M16 17c1.7 0 3-1.3 3-3s-1.3-3-3-3m-4 6c-1.7 0-3-1.3-3-3s1.3-3 3-3m4-4c0-1.7-1.3-3-3-3s-3 1.3-3 3m-4 4c0-1.7 1.3-3 3-3s3 1.3 3 3m-4 6c-2.2 0-4-1.8-4-4s1.8-4 4-4m8 0c2.2 0 4 1.8 4 4s-1.8 4-4 4m-4-8c0-2.2-1.8-4-4-4s-4 1.8-4 4"
      />
      <path
        d="M10 13a2 2 0 0 0 4 0m-2-5a2 2 0 0 1 2 2"
      />
    </Icon>
  );
}

/** Tunarungu — telinga dengan garis (melambangkan hambatan pendengaran) */
export function IconTunarungu(props) {
  return (
    <Icon {...props}>
      <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.2-1.2 4.1-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-.8" />
      <path d="M10 19h4" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </Icon>
  );
}

/** Tunanetra — mata dengan garis (melambangkan hambatan penglihatan) */
export function IconTunanetra(props) {
  return (
    <Icon {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </Icon>
  );
}

/** Tunadaksa — figur dengan kursi roda (melambangkan hambatan fisik/motorik) */
export function IconTunadaksa(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="4" r="1.5" />
      <path d="M9 9h3l2 5h3" />
      <path d="M9 9c0 2 1 3.5 3 4.5" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M8 17c0-2 1.5-3 3-3h3l1 3" />
    </Icon>
  );
}

/** Belum dicoba — lingkaran kosong */
export function IconCircleEmpty(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
    </Icon>
  );
}
 
/** Sedang berproses — lingkaran setengah terisi
 *  Setengah kiri diisi solid, setengah kanan kosong */
export function IconCircleHalf({ size = 16, color = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Lingkaran penuh sebagai border */}
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.75} fill="none" />
      {/* Setengah lingkaran terisi — bagian kiri */}
      <path d="M12 3 A9 9 0 0 0 12 21 Z" fill={color} stroke="none" />
    </svg>
  );
}
 
/** Berhasil dikuasai — lingkaran penuh terisi */
export function IconCircleFull({ size = 16, color = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" fill={color} stroke="none" />
    </svg>
  );
}