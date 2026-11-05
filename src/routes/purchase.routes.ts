
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { Currency } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";
import { sendSuccess } from "../utils/response";

const router = Router();

// ==========================================
// FITUR 6: BUY HERO
// ==========================================

// POST /api/players/:player_id/heroes
router.post(
  "/:player_id/heroes",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);
      const { heroId, currency } = req.body ?? {};

      // 1. Validasi heroId dan currency
      if (
        !Number.isInteger(heroId) ||
        heroId <= 0 ||
        (currency !== "BP" && currency !== "DIAMOND")
      ) {
        throw new HttpError(400, "heroId harus berupa bilangan bulat positif dan currency harus BP atau DIAMOND");
      }

      // 2. Cek player
      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      // 3. Cek hero
      const hero = await prisma.hero.findUnique({
        where: { id: heroId },
      });

      if (!hero) {
        throw new HttpError(404, "Hero tidak ditemukan");
      }

      // 4. Cek harga berdasarkan currency
      const price =
        currency === "BP" ? hero.priceBP : hero.priceDiamond;

      if (price === null) {
        throw new HttpError(
          400,
          `Hero ini tidak dapat dibeli menggunakan ${currency}`,
        );
      }

      // 5. Cek apakah player sudah memiliki hero
      const existingOwnership = await prisma.playerHero.findUnique({
        where: {
          playerId_heroId: {
            playerId,
            heroId,
          },
        },
      });

      if (existingOwnership) {
        throw new HttpError(409, "Player sudah memiliki hero ini");
      }

      // 6. Cek saldo mencukupi
      const currentBalance = currency === "BP" ? player.bp : player.diamond;

      if (currentBalance < price) {
        throw new HttpError(400, `Saldo ${currency} tidak mencukupi`);
      }

      // Transaksi: kurangi saldo dan catat pembelian
      const [updatedPlayer, purchasedHero] = await prisma.$transaction([
        prisma.player.update({
          where: { id: playerId },
          data:
            currency === "BP"
              ? {
                  bp: {
                    decrement: price,
                  },
                }
              : {
                  diamond: {
                    decrement: price,
                  },
                },
        }),

        prisma.playerHero.create({
          data: {
            playerId,
            heroId,
            currency: currency as Currency,
            pricePaid: price,
          },
          include: {
            hero: true,
          },
        }),
      ]);

      sendSuccess(res, 201, "Hero berhasil dibeli", {
        purchase: purchasedHero,
        currency,
        pricePaid: price,
        balance: {
          bp: updatedPlayer.bp,
          diamond: updatedPlayer.diamond,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
