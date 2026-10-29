import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import type { Prisma, Rarity } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";
import { sendSuccess } from "../utils/response";

export const getAllSkins = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
    const heroId = req.query.heroId ? parseInt(req.query.heroId as string, 10) : undefined;
    const rarity = req.query.rarity as Rarity | undefined;

    const where: Prisma.SkinWhereInput = {};

    if (heroId !== undefined && !Number.isNaN(heroId)) {
      where.heroId = heroId;
    }

    if (rarity) {
      where.rarity = rarity;
    }

    const [totalItems, skins] = await Promise.all([
      prisma.skin.count({ where }),
      prisma.skin.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          hero: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { id: "asc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    sendSuccess(res, 200, "Berhasil mengambil data skin", skins, {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getSkinDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const skinId = parseInt(req.params.skin_id as string, 10);
    if (Number.isNaN(skinId)) {
      throw new HttpError(400, "ID skin tidak valid");
    }

    const skin = await prisma.skin.findUnique({
      where: { id: skinId },
      include: {
        hero: true,
      },
    });

    if (!skin) {
      throw new HttpError(404, "Skin tidak ditemukan");
    }

    sendSuccess(res, 200, "Berhasil mengambil detail skin", skin);
  } catch (error) {
    next(error);
  }
};
