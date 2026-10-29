import { Router } from "express";
import {
  createHero,
  getAllHeroes,
  getHeroDetail,
} from "../controllers/hero.controller";

const router = Router();

router.get("/", getAllHeroes);
router.get("/:hero_id", getHeroDetail);
router.post("/", createHero);

export default router;
