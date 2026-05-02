/**
 * lib/konstanta.js — Data Statis Aplikasi
 */

// ── Bobot Default SAW ─────────────────────────────────────────────────────
export const BOBOT_DEFAULT = {
  c1_media:        8,
  c2_durasi:       6,
  c3_kemandirian:  4,
  c4_pendampingan: 2,
};

// ── Rentang usia mental per jenis ABK (dari data ontologi aktual) ─────────
export const RENTANG_USIA_MENTAL = {
  Autis:       { min: 5,  max: 18, default: 9  },
  Tunagrahita: { min: 4,  max: 12, default: 7  },
  Tunarungu:   { min: 9,  max: 18, default: 12 },
  Tunanetra:   { min: 7,  max: 19, default: 14 },
  Tunadaksa:   { min: 12, max: 19, default: 15 },
};

// ── Jenis ABK ─────────────────────────────────────────────────────────────
export const JENIS_ABK = [
  { id: "Autis",       label: "Autis",
    deskripsi: "Gangguan spektrum autisme yang mempengaruhi komunikasi dan interaksi sosial" },
  { id: "Tunagrahita", label: "Tunagrahita",
    deskripsi: "Hambatan intelektual yang mempengaruhi kemampuan belajar dan kemandirian" },
  { id: "Tunarungu",   label: "Tunarungu",
    deskripsi: "Hambatan pada indera pendengaran, sebagian atau seluruhnya" },
  { id: "Tunanetra",   label: "Tunanetra",
    deskripsi: "Hambatan pada indera penglihatan, sebagian atau seluruhnya" },
  { id: "Tunadaksa",   label: "Tunadaksa",
    deskripsi: "Hambatan pada fungsi fisik/motorik akibat kelainan otot, tulang, atau persendian" },
];

// ── Tingkat per Jenis ABK ─────────────────────────────────────────────────
export const TINGKAT_ABK = {
  Autis: [
    { value: "AutisFungsionalRingan", label: "Fungsional Ringan",
      deskripsi: "Anak dapat berkomunikasi verbal, melakukan aktivitas sehari-hari dengan sedikit bantuan." },
    { value: "AutisFungsionalSedang", label: "Fungsional Sedang",
      deskripsi: "Anak membutuhkan dukungan rutin. Komunikasi terbatas dengan pendampingan." },
    { value: "AutisFungsionalBerat",  label: "Fungsional Berat",
      deskripsi: "Anak membutuhkan bantuan dan pengawasan penuh. Komunikasi sangat terbatas." },
  ],
  Tunagrahita: [
    { value: "TunagrahitaRingan", label: "Ringan",
      deskripsi: "Anak dapat belajar keterampilan akademis dasar.", catatan: "IQ 50–70" },
    { value: "TunagrahitaSedang", label: "Sedang",
      deskripsi: "Anak dapat belajar keterampilan fungsional dengan pendampingan.", catatan: "IQ 35–49" },
    { value: "TunagrahitaBerat",  label: "Berat",
      deskripsi: "Anak membutuhkan bantuan penuh untuk hampir semua aktivitas.", catatan: "IQ < 35" },
  ],
  Tunarungu: [
    { value: "TunarunguKurangDengar", label: "Kurang Dengar",
      deskripsi: "Masih memiliki sisa pendengaran, dapat menggunakan alat bantu dengar." },
    { value: "TunarunguTuli", label: "Tuli",
      deskripsi: "Komunikasi utama melalui bahasa isyarat (BISINDO/SIBI) atau visual." },
  ],
  Tunanetra: [
    { value: "TunanetraKurangPenglihatan", label: "Kurang Penglihatan (Low Vision)",
      deskripsi: "Masih memiliki sisa penglihatan dengan jarak dekat atau alat bantu optik." },
    { value: "TunanetraButaTotal", label: "Buta Total",
      deskripsi: "Belajar melalui indera peraba, pendengaran, dan media braille." },
  ],
  Tunadaksa: [
    { value: "TunadaksaRingan", label: "Ringan",
      deskripsi: "Dapat bergerak dengan sedikit hambatan, sebagian besar aktivitas mandiri." },
    { value: "TunadaksaSedang", label: "Sedang",
      deskripsi: "Membutuhkan alat bantu mobilitas atau pendampingan untuk aktivitas fisik." },
    { value: "TunadaksaBerat",  label: "Berat",
      deskripsi: "Keterbatasan fisik signifikan, membutuhkan bantuan penuh dan alat bantu khusus." },
  ],
};

// ── Alat Bantu per Jenis ABK ──────────────────────────────────────────────
export const ALAT_BANTU = {
  Tunadaksa: {
    pertanyaan: "Apakah anak menggunakan alat bantu mobilitas?",
    pilihan: [
      { value: "KursiRoda", label: "Kursi Roda" },
      { value: "Kruk",      label: "Kruk / Tongkat Jalan" },
      { value: null,        label: "Tidak menggunakan alat bantu" },
    ],
  },
  Tunarungu: {
    pertanyaan: "Apakah anak menggunakan Alat Bantu Dengar (ABD)?",
    pilihan: [
      { value: "AlatBantuDengar", label: "Ya, menggunakan ABD" },
      { value: null,              label: "Tidak menggunakan ABD" },
    ],
  },
  Tunanetra: {
    pertanyaan: "Apakah anak menggunakan alat bantu orientasi?",
    pilihan: [
      { value: "TongkatPutih", label: "Ya, menggunakan tongkat putih" },
      { value: null,           label: "Tidak menggunakan tongkat" },
    ],
  },
  Autis: {
    pertanyaan: "Apakah anak menggunakan AAC (Augmentative & Alternative Communication)?",
    pilihan: [
      { value: "AplikasiAAC", label: "Ya, menggunakan AAC / PECS / papan komunikasi" },
      { value: null,          label: "Tidak menggunakan AAC" },
    ],
  },
};

// ── Jenjang Pendidikan ────────────────────────────────────────────────────
export const JENJANG = [
  { value: "SMPLB_7",  label: "SMP LB — Kelas 7",  grup: "SMPLB" },
  { value: "SMPLB_8",  label: "SMP LB — Kelas 8",  grup: "SMPLB" },
  { value: "SMPLB_9",  label: "SMP LB — Kelas 9",  grup: "SMPLB" },
  { value: "SMALB_1O", label: "SMA LB — Kelas 10", grup: "SMALB" },
  { value: "SMALB_11", label: "SMA LB — Kelas 11", grup: "SMALB" },
  { value: "SMALB_12", label: "SMA LB — Kelas 12", grup: "SMALB" },
];

// ── Checklist Kemampuan Anak ──────────────────────────────────────────────
// Digunakan sebagai PANDUAN OPSIONAL estimasi usia mental.
// Rentang mencakup seluruh usia mental yang ada di data ontologi.
// Pengguna yang tahu usia mental anaknya dapat langsung input via slider.
export const CHECKLIST_KEMANDIRIAN = {
  // Autis: rentang aktual ontologi 7–18 tahun
  Autis: [
    { id: "a1", label: "Anak bisa mengenali dan menyebutkan warna serta bentuk dasar",                              usiaMental: 6  },
    { id: "a2", label: "Anak bisa mengenali bunyi huruf dan mencocokkannya dengan gambar",                          usiaMental: 7  },
    { id: "a3", label: "Anak mulai mengerti perasaan orang lain (senang/sedih) dari ekspresi wajah",               usiaMental: 8  },
    { id: "a4", label: "Anak bisa mengikuti jadwal kegiatan harian dengan panduan gambar atau tulisan",             usiaMental: 9  },
    { id: "a5", label: "Anak mampu membedakan dan mengelompokkan benda berdasarkan kategori",                       usiaMental: 10 },
    { id: "a6", label: "Anak bisa menyelesaikan tugas rumah tangga sederhana tanpa diingatkan terus-menerus",      usiaMental: 11 },
    { id: "a7", label: "Anak mampu membaca dan menulis kalimat sederhana secara mandiri",                           usiaMental: 12 },
    { id: "a8", label: "Anak bisa menggunakan perangkat digital (HP/tablet) dengan panduan minimal",               usiaMental: 13 },
    { id: "a9", label: "Anak mampu membuat keputusan sederhana dan mengomunikasikan pilihannya",                    usiaMental: 14 },
    { id:"a10", label: "Anak bisa mengatur waktu dan jadwal hariannya sendiri dengan sedikit bantuan",              usiaMental: 15 },
    { id:"a11", label: "Anak mampu mengelola uang saku dan bertransaksi di lingkungan terdekat",                    usiaMental: 16 },
    { id:"a12", label: "Anak bisa bekerja sama dalam kelompok dan menyelesaikan tugas bersama",                     usiaMental: 17 },
    { id:"a13", label: "Anak mampu merencanakan dan melaksanakan kegiatan vokasional sederhana secara mandiri",     usiaMental: 18 },
  ],

  // Tunagrahita: rentang aktual ontologi 4–12 tahun
  Tunagrahita: [
    { id: "g1", label: "Anak mampu mengenal dan menyebutkan anggota keluarganya",                                   usiaMental: 4  },
    { id: "g2", label: "Anak bisa menunjuk benda yang disebutkan dan mengenal warna dasar",                        usiaMental: 5  },
    { id: "g3", label: "Anak mampu makan dan minum sendiri dengan sedikit bantuan",                                 usiaMental: 6  },
    { id: "g4", label: "Anak tahu kapan waktunya makan atau mandi dengan melihat jadwal gambar",                   usiaMental: 7  },
    { id: "g5", label: "Anak bisa mencuci tangan dan gosok gigi sendiri tanpa diingatkan",                         usiaMental: 8  },
    { id: "g6", label: "Anak mampu keramas sendiri dengan sedikit arahan",                                          usiaMental: 9  },
    { id: "g7", label: "Anak mengenal nilai uang dan bisa membedakan nominal yang lebih besar",                    usiaMental: 10 },
    { id: "g8", label: "Anak paham aturan keselamatan dasar di rumah (tidak pegang kabel, kompor)",                usiaMental: 11 },
    { id: "g9", label: "Anak bisa menyiapkan kebutuhan sekolahnya sendiri dan merapikan kamarnya",                 usiaMental: 12 },
  ],

  // Tunarungu: rentang aktual ontologi 10–18 tahun
  Tunarungu: [
    { id: "r1", label: "Anak mampu menatap mata lawan bicara dan mempertahankan kontak mata",                      usiaMental: 9  },
    { id: "r2", label: "Anak bisa memahami instruksi sederhana melalui gerak bibir atau isyarat",                  usiaMental: 10 },
    { id: "r3", label: "Anak mampu menceritakan kejadian melalui tulisan kalimat pendek",                          usiaMental: 11 },
    { id: "r4", label: "Anak dapat mengikuti perintah yang terdiri dari 2–3 langkah sekaligus",                   usiaMental: 12 },
    { id: "r5", label: "Anak berani memulai percakapan atau bertanya kepada orang yang baru dikenal",              usiaMental: 13 },
    { id: "r6", label: "Anak mampu membaca dan memahami teks informasi pendek (berita, pengumuman)",               usiaMental: 14 },
    { id: "r7", label: "Anak bisa menulis surat atau pesan tertulis yang runtut dan mudah dipahami",               usiaMental: 15 },
    { id: "r8", label: "Anak mampu menggunakan aplikasi komunikasi digital (WhatsApp, email) secara mandiri",      usiaMental: 16 },
    { id: "r9", label: "Anak dapat menganalisis informasi dari berbagai sumber dan menyimpulkannya",               usiaMental: 17 },
    { id:"r10", label: "Anak mampu berpartisipasi aktif dalam diskusi kelompok menggunakan bahasa isyarat/tulisan", usiaMental: 18 },
  ],

  // Tunanetra: rentang aktual ontologi 7–19 tahun
  Tunanetra: [
    { id: "n1", label: "Anak mampu mengenal lingkungan sekitar rumah melalui suara dan tekstur",                   usiaMental: 7  },
    { id: "n2", label: "Anak bisa bergerak mandiri di dalam rumah tanpa menabrak furnitur",                        usiaMental: 9  },
    { id: "n3", label: "Anak merasa aman berjalan di tempat baru dengan memegang lengan pendamping",               usiaMental: 11 },
    { id: "n4", label: "Anak bisa berpindah dari satu ruangan ke ruangan lain di rumah secara mandiri",            usiaMental: 13 },
    { id: "n5", label: "Anak mampu mengenali rute jalan yang sering dilewati (dari kamar ke ruang tamu, dll)",    usiaMental: 14 },
    { id: "n6", label: "Anak mahir membaca huruf Braille dasar (alfabet A–Z)",                                      usiaMental: 15 },
    { id: "n7", label: "Anak mampu menggunakan HP atau Laptop dengan bantuan Screen Reader",                        usiaMental: 16 },
    { id: "n8", label: "Anak bisa merapikan dan menyimpan file tugas sekolahnya sendiri di komputer",              usiaMental: 17 },
    { id: "n9", label: "Anak mampu mengoperasikan aplikasi produktivitas (dokumen, spreadsheet) dengan SR",        usiaMental: 18 },
    { id:"n10", label: "Anak mampu merencanakan perjalanan mandiri ke tempat baru menggunakan alat bantu navigasi", usiaMental: 19 },
  ],

  // Tunadaksa: rentang aktual ontologi 12–19 tahun
  Tunadaksa: [
    { id: "d1", label: "Anak paham konsep arah (kanan, kiri, depan, belakang) untuk membantunya bergerak",        usiaMental: 12 },
    { id: "d2", label: "Anak bisa memakai kemeja/baju berkancing sendiri dengan urutan yang benar",               usiaMental: 13 },
    { id: "d3", label: "Anak mampu merapikan alat belajar atau pakaian secara mandiri",                            usiaMental: 13 },
    { id: "d4", label: "Anak mampu menggunakan alat bantu (seperti sendok khusus) untuk makan sendiri",           usiaMental: 14 },
    { id: "d5", label: "Anak bisa berpindah dari kursi roda ke tempat tidur secara mandiri",                      usiaMental: 15 },
    { id: "d6", label: "Anak mampu menggunakan komputer atau tablet dengan alat bantu adaptif",                    usiaMental: 16 },
    { id: "d7", label: "Anak bisa melakukan transaksi keuangan sederhana secara mandiri",                          usiaMental: 17 },
    { id: "d8", label: "Anak mampu menavigasi transportasi umum yang aksesibel dengan mandiri",                    usiaMental: 18 },
    { id: "d9", label: "Anak mampu menjalankan pekerjaan ringan atau vokasional dengan alat bantu yang sesuai",    usiaMental: 19 },
  ],
};

// ── Helper: konversi checklist → usia mental ──────────────────────────────
export function konversiChecklistKeUsiaMental(checklistDicentang, jenisABK) {
  if (!jenisABK) return 5;

  const jenisDasar = Object.keys(CHECKLIST_KEMANDIRIAN).find((key) =>
    jenisABK.toLowerCase().includes(key.toLowerCase())
  );

  const daftarChecklist = CHECKLIST_KEMANDIRIAN[jenisDasar] || [];

  if (!checklistDicentang || checklistDicentang.length === 0) {
    return RENTANG_USIA_MENTAL[jenisDasar]?.default ?? 5;
  }

  const nilaiUsia = checklistDicentang.map((id) => {
    const item = daftarChecklist.find((c) => c.id === id);
    return item ? item.usiaMental : 5;
  });

  return Math.max(...nilaiUsia, RENTANG_USIA_MENTAL[jenisDasar]?.min ?? 5);
}

// ── Helper: label jenjang ─────────────────────────────────────────────────
export function getLabelJenjang(value) {
  return JENJANG.find((j) => j.value === value)?.label ?? value;
}

// ── Helper: label tingkat ABK ─────────────────────────────────────────────
export function getLabelTingkat(value) {
  if (!value) return "";
  for (const tingkats of Object.values(TINGKAT_ABK)) {
    const found = tingkats.find((t) => t.value === value);
    if (found) return found.label;
  }
  return value;
}