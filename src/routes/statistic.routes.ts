import { Router } from "express";

const router = Router();

// =========================================================================
// BAGIAN 3: DIKERJAKAN OLEH ANGGOTA 3 (Teman 2)
// Fitur 7: Statistik Toko
// Endpoint: GET /api/statistics
//
// Field yang dihitung:
// - totalPlayers: jumlah player (count)
// - totalHeroesOwned: jumlah data di tabel PlayerHero (count)
// - totalDiamond: total saldo diamond semua player (aggregate _sum)
// - mostOwnedHero: hero yang paling banyak dimiliki player (groupBy heroId di PlayerHero)
// - heroesPerRole: jumlah hero untuk setiap role (groupBy role di Hero)
// =========================================================================

router.get("/", (req, res, next) => {
  // TODO (Anggota 3): Implementasikan statistik toko
  res.status(501).json({
    status: false,
    message: "Endpoint statistik toko belum diimplementasikan (Tugas Anggota 3)",
  });
});

// Fallback jika di-mount di /api
router.get("/statistics", (req, res, next) => {
  res.status(501).json({
    status: false,
    message: "Endpoint statistik toko belum diimplementasikan (Tugas Anggota 3)",
  });
});

export default router;
