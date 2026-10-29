import type { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import type { Prisma, Role } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";
import { sendSuccess } from "../utils/response";

export const getAllHeroes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
    const search = req.query.search as string | undefined;
    const role = req.query.role as Role | undefined;

    const where: Prisma.HeroWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (role) {
      where.role = role;
    }

    const [totalItems, heroes] = await Promise.all([
      prisma.hero.count({ where }),
      prisma.hero.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: "asc" },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    sendSuccess(res, 200, "Berhasil mengambil data hero", heroes, {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getHeroDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const heroId = parseInt(req.params.hero_id as string, 10);
    if (Number.isNaN(heroId)) {
      throw new HttpError(400, "ID hero tidak valid");
    }

    const hero = await prisma.hero.findUnique({
      where: { id: heroId },
      include: {
        skins: true,
      },
    });

    if (!hero) {
      throw new HttpError(404, "Hero tidak ditemukan");
    }

    sendSuccess(res, 200, "Berhasil mengambil detail hero", hero);
  } catch (error) {
    next(error);
  }
};

export const createHero = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, role, lane, releaseYear, priceBP, priceDiamond } = req.body;

    // 1. name, role, lane, atau releaseYear tidak diisi -> 400
    if (!name || !role || !lane || releaseYear === undefined || releaseYear === null) {
      throw new HttpError(400, "Field name, role, lane, dan releaseYear wajib diisi");
    }

    // 2. Nama hero sudah ada -> 409
    const existingHero = await prisma.hero.findUnique({
      where: { name: String(name).trim() },
    });
    if (existingHero) {
      throw new HttpError(409, "Hero dengan nama tersebut sudah ada");
    }

    // 3. Berhasil -> 201 berisi hero baru
    const newHero = await prisma.hero.create({
      data: {
        name: String(name).trim(),
        role,
        lane,
        releaseYear: Number(releaseYear),
        priceBP: priceBP !== undefined && priceBP !== null ? Number(priceBP) : null,
        priceDiamond:
          priceDiamond !== undefined && priceDiamond !== null ? Number(priceDiamond) : null,
      },
    });

    sendSuccess(res, 201, "Hero berhasil dibuat", newHero);
  } catch (error) {
    next(error);
  }
};
