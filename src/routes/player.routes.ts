import { Router } from "express";

const router = Router();

// =========================================================================
// BAGIAN 2: DIKERJAKAN OLEH ANGGOTA 2 (Teman 1)
// Fitur 4: Player Management (CRUD)
// Fitur 5: Top Up & Match
//
// Endpoint yang dikerjakan:
// 1. POST   /api/players                -> Buat player baru (default 10000 BP, 0 Diamond)
// 2. GET    /api/players/:player_id     -> Detail player beserta daftar hero yang dimiliki
// 3. PATCH  /api/players/:player_id     -> Update nickname player
// 4. DELETE /api/players/:player_id     -> Hapus player (cascade ke PlayerHero)
// 5. POST   /api/players/:player_id/topup   -> Top up diamond player (amount bulat > 0)
// 6. POST   /api/players/:player_id/matches -> Main match (result WIN: +300 BP, LOSE: +100 BP)
// =========================================================================

// --- Fitur 4: Player CRUD ---
router.post("/", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan create player
  res.status(501).json({
    status: false,
    message: "Endpoint create player belum diimplementasikan (Tugas Anggota 2)",
  });
});

router.get("/:player_id", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan get player detail
  res.status(501).json({
    status: false,
    message: "Endpoint get player detail belum diimplementasikan (Tugas Anggota 2)",
  });
});

router.patch("/:player_id", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan update nickname player
  res.status(501).json({
    status: false,
    message: "Endpoint update player belum diimplementasikan (Tugas Anggota 2)",
  });
});

router.delete("/:player_id", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan delete player
  res.status(501).json({
    status: false,
    message: "Endpoint delete player belum diimplementasikan (Tugas Anggota 2)",
  });
});

// --- Fitur 5: Top Up & Match ---
router.post("/:player_id/topup", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan top up diamond
  res.status(501).json({
    status: false,
    message: "Endpoint top up diamond belum diimplementasikan (Tugas Anggota 2)",
  });
});

router.post("/:player_id/matches", (req, res, next) => {
  // TODO (Anggota 2): Implementasikan match result (WIN / LOSE)
  res.status(501).json({
    status: false,
    message: "Endpoint match result belum diimplementasikan (Tugas Anggota 2)",
  });
});

export default router;
