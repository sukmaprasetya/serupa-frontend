// abk-frontend/app/lib/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

/**
 * Fungsi dasar fetcher untuk berkomunikasi dengan Backend Flask
 */
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  };

  try {
    const res = await fetch(url, defaultOptions);

    if (!res.ok) {
      let pesanError = "Terjadi kesalahan pada server";
      try {
        const errorData = await res.json();
        pesanError = errorData.message || pesanError;
      } catch (e) {
        pesanError = await res.text() || res.statusText;
      }
      throw new Error(`[${res.status}] ${pesanError}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`[API Error] ${url}:`, err.message);
    throw err;
  }
}

/* ── Health Check ──────────────────────────────────────────────────────── */

export async function cekStatus() {
  return apiFetch('/');
}

/* ── Info Ontologi ─────────────────────────────────────────────────────── */

export async function getInfoOntologi() {
  return apiFetch('/api/info', {
    cache: 'default',
    next: { revalidate: 3600 },
  });
}

/* ── Semua Metode ──────────────────────────────────────────────────────── */

export async function getAllMetode(filter = {}) {
  const params = new URLSearchParams();
  if (filter.jenis)   params.set('jenis',   filter.jenis);
  if (filter.jenjang) params.set('jenjang', filter.jenjang);
  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/api/metode${query}`);
}

/* ── Rekomendasi SAW ───────────────────────────────────────────────────── */

export async function getRekomendasi(payload) {
  return apiFetch('/api/rekomendasi', {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

/* ── Detail, Prasyarat, Lanjutan, Terkait ──────────────────────────────── */

export async function getDetailMetode(idMetode) {
  return apiFetch(`/api/metode/${encodeURIComponent(idMetode)}`);
}

export async function getPrasyaratMetode(idMetode) {
  return apiFetch(`/api/metode/${encodeURIComponent(idMetode)}/prasyarat`);
}

/**
 * Mengambil daftar metode lanjutan setelah metode ini berhasil dikuasai.
 * Endpoint Flask membaca relasi prasyaratUntuk dari ontologi.
 * Response: { status: "success", data: [{ idMetode, namaMetode, durasiPembelajaran }] }
 */
export async function getMetodeLanjutan(idMetode) {
  return apiFetch(`/api/metode/${encodeURIComponent(idMetode)}/lanjutan`);
}

export async function getMetodeTerkait(idMetode) {
  return apiFetch(`/api/metode/${encodeURIComponent(idMetode)}/terkait`);
}

/**
 * Ambil daftar media dari metode kandidat, dikelompokkan per class ontologi.
 * Digunakan di C1 Kriteria SAW agar media yang ditampilkan relevan dengan profil anak.
 * @param {{ jenis: string, jenjang?: string }} filter
 */
export async function getMediaKandidat({ jenis = "", jenjang = "" } = {}) {
  const params = new URLSearchParams();
  if (jenis)   params.set("jenis",   jenis);
  if (jenjang) params.set("jenjang", jenjang);
  const query = params.toString() ? `?${params}` : "";
  return apiFetch(`/api/media-kandidat${query}`);
}