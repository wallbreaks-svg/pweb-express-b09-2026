import { Router } from "express";

const router = Router({ mergeParams: true });

// =========================================================================
// BAGIAN 3: DIKERJAKAN OLEH ANGGOTA 3 (Teman 2)
// Fitur 6: Beli Hero (Core Transaction)
// Endpoint: POST /api/players/:player_id/heroes
// Body: { "heroId": number, "currency": "BP" | "DIAMOND" }
//
// 6 Tahap validasi berurutan:
// 1. heroId kosong / currency bukan BP atau DIAMOND -> 400
// 2. Player tidak ditemukan -> 404
// 3. Hero tidak ditemukan -> 404
// 4. Harga hero untuk currency kosong/null -> 400 (misal: Freya BP null)
// 5. Player sudah memiliki hero tersebut -> 409
// 6. Saldo player (BP / diamond) kurang dari harga hero -> 400
//
// Transaksi prisma.$transaction:
// - Kurangi saldo player (decrement)
// - Buat data PlayerHero
// - Response 201 dengan format data sesuai modul
// =========================================================================

router.post("/:player_id/heroes", (req, res, next) => {
  // TODO (Anggota 3): Implementasikan logika beli hero di sini atau di purchase.controller.ts
  res.status(501).json({
    status: false,
    message: "Fitur beli hero belum diimplementasikan (Tugas Anggota 3)",
  });
});

// Fallback jika di-mount di /api
router.post("/players/:player_id/heroes", (req, res, next) => {
  res.status(501).json({
    status: false,
    message: "Fitur beli hero belum diimplementasikan (Tugas Anggota 3)",
  });
});

export default router;
