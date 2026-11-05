
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { sendSuccess } from "../utils/response";

const router = Router();

// ==========================================
// FITUR 4: CRUD PLAYER
// ==========================================

// POST /api/players
// Membuat player baru
router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nickname } = req.body ?? {};

      if (typeof nickname !== "string" || !nickname.trim()) {
        throw new HttpError(400, "Nickname wajib diisi");
      }

      const cleanNickname = nickname.trim();

      const existingPlayer = await prisma.player.findUnique({
        where: { nickname: cleanNickname },
      });

      if (existingPlayer) {
        throw new HttpError(409, "Nickname sudah digunakan");
      }

      const player = await prisma.player.create({
        data: {
          nickname: cleanNickname,
        },
      });

      sendSuccess(res, 201, "Player berhasil dibuat", player);
    } catch (error) {
      next(error);
    }
  },
);

// GET /api/players/:player_id
// Mengambil detail player beserta hero yang dimiliki
router.get(
  "/:player_id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);

      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(400, "ID player tidak valid");
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          playerHeroes: {
            include: {
              hero: true,
            },
          },
        },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      sendSuccess(res, 200, "Berhasil mengambil detail player", player);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /api/players/:player_id
// Mengubah nickname player
router.patch(
  "/:player_id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);
      const { nickname } = req.body ?? {};

      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(400, "ID player tidak valid");
      }

      if (typeof nickname !== "string" || !nickname.trim()) {
        throw new HttpError(400, "Nickname wajib diisi");
      }

      const cleanNickname = nickname.trim();

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      const existingPlayer = await prisma.player.findUnique({
        where: { nickname: cleanNickname },
      });

      if (existingPlayer && existingPlayer.id !== playerId) {
        throw new HttpError(409, "Nickname sudah digunakan");
      }

      const updatedPlayer = await prisma.player.update({
        where: { id: playerId },
        data: { nickname: cleanNickname },
      });

      sendSuccess(res, 200, "Nickname player berhasil diperbarui", updatedPlayer);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /api/players/:player_id
// Menghapus player beserta hero yang dimiliki
router.delete(
  "/:player_id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);

      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(400, "ID player tidak valid");
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      await prisma.player.delete({
        where: { id: playerId },
      });

      sendSuccess(res, 200, "Player berhasil dihapus", player);
    } catch (error) {
      next(error);
    }
  },
);

// ==========================================
// FITUR 5: TOP UP DAN MATCH
// ==========================================

// POST /api/players/:player_id/topup
// Menambahkan Diamond ke balance player
router.post(
  "/:player_id/topup",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);
      const { amount } = req.body ?? {};

      if (!Number.isInteger(amount) || amount <= 0) {
        throw new HttpError(400, "Amount harus berupa bilangan bulat lebih dari 0");
      }

      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(400, "ID player tidak valid");
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      const updatedPlayer = await prisma.player.update({
        where: { id: playerId },
        data: {
          diamond: {
            increment: amount,
          },
        },
      });

      sendSuccess(res, 200, "Top up Diamond berhasil", {
        playerId: updatedPlayer.id,
        nickname: updatedPlayer.nickname,
        amountAdded: amount,
        diamond: updatedPlayer.diamond,
      });
    } catch (error) {
      next(error);
    }
  },
);

// POST /api/players/:player_id/matches
// Menambahkan BP berdasarkan hasil pertandingan
router.post(
  "/:player_id/matches",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = Number(req.params.player_id);
      const { result } = req.body ?? {};

      if (result !== "WIN" && result !== "LOSE") {
        throw new HttpError(400, 'Result harus bernilai "WIN" atau "LOSE"');
      }

      if (!Number.isInteger(playerId) || playerId <= 0) {
        throw new HttpError(400, "ID player tidak valid");
      }

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (!player) {
        throw new HttpError(404, "Player tidak ditemukan");
      }

      const earnedBP = result === "WIN" ? 300 : 100;

      const updatedPlayer = await prisma.player.update({
        where: { id: playerId },
        data: {
          bp: {
            increment: earnedBP,
          },
        },
      });

      sendSuccess(res, 200, "Hasil pertandingan berhasil dicatat", {
        playerId: updatedPlayer.id,
        nickname: updatedPlayer.nickname,
        result,
        earnedBP,
        bp: updatedPlayer.bp,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
