/**
 * store/rekomendasiStore.js — Global State (Zustand + persist)
 *
 * Menggunakan middleware `persist` dengan sessionStorage agar:
 * - State BERTAHAN saat refresh halaman (dalam satu tab)
 * - State HILANG saat tab/browser ditutup (tidak menumpuk antar sesi)
 * - Aman untuk Next.js App Router (SSR-safe via skipHydration + onRehydrateStorage)
 *
 * Strategi partialState:
 * - Yang di-persist : inputForm, hasil, riwayat
 * - Yang TIDAK di-persist : isLoading, error (selalu reset ke false/null saat mulai)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const INPUT_AWAL = {
  jenisABK:      "",
  tingkatABK:    "",
  jenjang:       "",
  mediaDimiliki: [],
  checklist:     [],
  usiaMental:    null,   // null = belum diisi, diisi saat slider/checklist disentuh
  waktuTersedia: "",     // kosong = belum diisi, user wajib mengisi
  kesibukanOrtu: "",     // kosong = belum dipilih, tampilkan placeholder
  bobot: {
    // Bobot tetap ada default karena selalu terisi
    c1_media:        8,
    c2_durasi:       6,
    c3_kemandirian:  4,
    c4_pendampingan: 2,
  },
};

export const useRekomendasiStore = create(
  persist(
    (set, get) => ({

      // ── State ────────────────────────────────────────────────────────────
      inputForm: { ...INPUT_AWAL },
      /**
       * `hasil` disimpan sebagai array hasil_ranking (list of metode).
       * Diakses di page.jsx langsung sebagai array, bukan hasil.data
       */
      hasil:     [],
      isLoading: false, // TIDAK di-persist — selalu mulai false
      error:     null,  // TIDAK di-persist — selalu mulai null
      riwayat:   [],

      // ── Setter input form ────────────────────────────────────────────────

      setInput: (fields) =>
        set((state) => ({
          inputForm: { ...state.inputForm, ...fields },
        })),

      toggleMedia: (mediaId) =>
        set((state) => {
          const ada = state.inputForm.mediaDimiliki.includes(mediaId);
          return {
            inputForm: {
              ...state.inputForm,
              mediaDimiliki: ada
                ? state.inputForm.mediaDimiliki.filter((m) => m !== mediaId)
                : [...state.inputForm.mediaDimiliki, mediaId],
            },
          };
        }),

      toggleChecklist: (id) =>
        set((state) => {
          const ada = state.inputForm.checklist.includes(id);
          return {
            inputForm: {
              ...state.inputForm,
              checklist: ada
                ? state.inputForm.checklist.filter((c) => c !== id)
                : [...state.inputForm.checklist, id],
            },
          };
        }),

      setBobot: (key, nilai) =>
        set((state) => ({
          inputForm: {
            ...state.inputForm,
            bobot: { ...state.inputForm.bobot, [key]: nilai },
          },
        })),

      // ── Setter hasil ──────────────────────────────────────────────────────

      /**
       * Menerima respons mentah dari backend (objek dengan hasil_ranking)
       * ATAU array langsung. Selalu simpan sebagai array flat.
       */
      setHasil: (data) => {
        const listRanking = Array.isArray(data)
          ? data
          : (data?.hasil_ranking ?? []);
        set({ hasil: listRanking, error: null });
      },

      setLoading: (v)   => set({ isLoading: v }),
      setError:   (msg) => set({ error: msg, isLoading: false }),

      // ── Riwayat ───────────────────────────────────────────────────────────

      simpanKeRiwayat: () => {
        const { inputForm, hasil } = get();
        if (!hasil || hasil.length === 0) return;

        const sesi = {
          id:            Date.now(),
          tanggal:       new Date().toLocaleString("id-ID"),
          inputForm:     { ...inputForm },
          topMetode:     hasil[0],
          skorTertinggi: hasil[0]?.skor,
          totalHasil:    hasil.length,
        };

        set((state) => ({
          riwayat: [sesi, ...state.riwayat].slice(0, 10),
        }));
      },

      // ── Reset ─────────────────────────────────────────────────────────────

      resetForm: () =>
        set({ inputForm: { ...INPUT_AWAL }, hasil: [], error: null }),

      resetSemua: () =>
        set({
          inputForm: { ...INPUT_AWAL },
          hasil:     [],
          error:     null,
          riwayat:   [],
          isLoading: false,
        }),
    }),

    // ── Konfigurasi persist ─────────────────────────────────────────────────
    {
      name: "serupa-rekomendasi", // key di sessionStorage

      // sessionStorage: bertahan saat refresh, hilang saat tab ditutup
      storage: createJSONStorage(() => sessionStorage),

      // Hanya persist state yang relevan — isLoading & error dikecualikan
      partialize: (state) => ({
        inputForm: state.inputForm,
        hasil:     state.hasil,
        riwayat:   state.riwayat,
      }),

      // Pastikan isLoading & error selalu bersih setelah rehydrate
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          state.error     = null;
        }
      },
    }
  )
);