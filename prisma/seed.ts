import fs from "node:fs";
import path from "node:path";
import prisma from "../src/config/prisma";

async function main() {
  console.log("Memulai proses seeding database...");

  // 1. Kosongkan semua tabel dengan raw query RESTART IDENTITY CASCADE
  console.log("Mengosongkan tabel...");
  await prisma.$executeRawUnsafe(
    `TRUNCATE "PlayerHero", "Player", "Skin", "Hero" RESTART IDENTITY CASCADE;`
  );

  // 2. Baca data/heroes.json dan insert dengan createMany
  const heroesPath = path.resolve(process.cwd(), "data/heroes.json");
  const heroesData = JSON.parse(fs.readFileSync(heroesPath, "utf-8"));
  console.log(`Memasukkan ${heroesData.length} hero...`);
  await prisma.hero.createMany({
    data: heroesData,
  });

  // 3. Baca data/skins.json dan insert dengan createMany
  const skinsPath = path.resolve(process.cwd(), "data/skins.json");
  const skinsData = JSON.parse(fs.readFileSync(skinsPath, "utf-8"));
  console.log(`Memasukkan ${skinsData.length} skin...`);
  await prisma.skin.createMany({
    data: skinsData,
  });

  // 4. Masukkan 3 player
  console.log("Memasukkan 3 player...");
  await prisma.player.createMany({
    data: [
      { nickname: "ArekITS", bp: 1500, diamond: 75 },
      { nickname: "SangPushRank", bp: 13000, diamond: 2892 },
      { nickname: "MageSurabaya", bp: 10000, diamond: 0 },
    ],
  });

  // 5. Masukkan data PlayerHero
  console.log("Memasukkan data PlayerHero...");
  await prisma.playerHero.createMany({
    data: [
      { playerId: 1, heroId: 18, currency: "BP", pricePaid: 2000 },
      { playerId: 1, heroId: 1, currency: "BP", pricePaid: 10800 },
      { playerId: 2, heroId: 84, currency: "DIAMOND", pricePaid: 599 },
      { playerId: 2, heroId: 56, currency: "BP", pricePaid: 32000 },
    ],
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("Gagal melakukan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
