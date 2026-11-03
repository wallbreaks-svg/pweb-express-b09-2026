import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { sendSuccess } from "../utils/response";

export const getStatistics = async (_req: Request, res: Response) => {
  const [totalPlayers, totalHeroesOwned, diamondAggregate] = await Promise.all([
    prisma.player.count(),
    prisma.playerHero.count(),
    prisma.player.aggregate({
      _sum: { diamond: true },
    }),
  ]);

  const mostOwnedAgg = await prisma.playerHero.groupBy({
    by: ["heroId"],
    _count: { playerId: true },
    orderBy: { _count: { playerId: "desc" } },
    take: 1,
  });

  let mostOwnedHero = null;
  if (mostOwnedAgg.length > 0) {
    const hero = await prisma.hero.findUnique({
      where: { id: mostOwnedAgg[0].heroId },
    });
    mostOwnedHero = {
      hero,
      count: mostOwnedAgg[0]._count.playerId,
    };
  }

  const heroesPerRole = await prisma.hero.groupBy({
    by: ["role"],
    _count: { id: true },
  });

  sendSuccess(res, 200, "Berhasil mengambil statistik", {
    totalPlayers,
    totalHeroesOwned,
    totalDiamond: diamondAggregate._sum.diamond || 0,
    mostOwnedHero,
    heroesPerRole,
  });
};