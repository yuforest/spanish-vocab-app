import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DATABASE_URL = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "挨拶",
    words: [
      { spanish: "hola", japanese: "こんにちは", difficulty: 1 },
      { spanish: "adiós", japanese: "さようなら", difficulty: 1 },
      { spanish: "buenos días", japanese: "おはようございます", difficulty: 1 },
      { spanish: "buenas tardes", japanese: "こんにちは（午後）", difficulty: 1 },
      { spanish: "buenas noches", japanese: "こんばんは", difficulty: 1 },
      { spanish: "por favor", japanese: "お願いします", difficulty: 1 },
      { spanish: "gracias", japanese: "ありがとう", difficulty: 1 },
      { spanish: "de nada", japanese: "どういたしまして", difficulty: 1 },
      { spanish: "perdón", japanese: "すみません", difficulty: 1 },
      { spanish: "lo siento", japanese: "ごめんなさい", difficulty: 1 },
      { spanish: "¿cómo estás?", japanese: "お元気ですか？", difficulty: 2 },
      { spanish: "estoy bien", japanese: "元気です", difficulty: 1 },
      { spanish: "mucho gusto", japanese: "はじめまして", difficulty: 2 },
      { spanish: "¿cómo te llamas?", japanese: "お名前は何ですか？", difficulty: 2 },
      { spanish: "me llamo", japanese: "私の名前は〜です", difficulty: 2 },
      { spanish: "hasta luego", japanese: "またね", difficulty: 1 },
      { spanish: "hasta mañana", japanese: "また明日", difficulty: 2 },
      { spanish: "bienvenido", japanese: "ようこそ", difficulty: 2 },
      { spanish: "salud", japanese: "乾杯 / お大事に", difficulty: 2 },
      { spanish: "con permiso", japanese: "失礼します", difficulty: 2 },
    ],
  },
  {
    name: "食べ物",
    words: [
      { spanish: "pan", japanese: "パン", difficulty: 1 },
      { spanish: "agua", japanese: "水", difficulty: 1 },
      { spanish: "leche", japanese: "牛乳", difficulty: 1 },
      { spanish: "carne", japanese: "肉", difficulty: 1 },
      { spanish: "pollo", japanese: "鶏肉", difficulty: 1 },
      { spanish: "pescado", japanese: "魚", difficulty: 1 },
      { spanish: "arroz", japanese: "米", difficulty: 1 },
      { spanish: "fruta", japanese: "果物", difficulty: 1 },
      { spanish: "manzana", japanese: "りんご", difficulty: 1 },
      { spanish: "naranja", japanese: "オレンジ", difficulty: 1 },
      { spanish: "verdura", japanese: "野菜", difficulty: 1 },
      { spanish: "tomate", japanese: "トマト", difficulty: 1 },
      { spanish: "queso", japanese: "チーズ", difficulty: 2 },
      { spanish: "huevo", japanese: "卵", difficulty: 1 },
      { spanish: "aceite", japanese: "油", difficulty: 2 },
      { spanish: "sal", japanese: "塩", difficulty: 1 },
      { spanish: "azúcar", japanese: "砂糖", difficulty: 2 },
      { spanish: "café", japanese: "コーヒー", difficulty: 1 },
      { spanish: "vino", japanese: "ワイン", difficulty: 1 },
      { spanish: "cerveza", japanese: "ビール", difficulty: 1 },
    ],
  },
  {
    name: "数字",
    words: [
      { spanish: "uno", japanese: "1", difficulty: 1 },
      { spanish: "dos", japanese: "2", difficulty: 1 },
      { spanish: "tres", japanese: "3", difficulty: 1 },
      { spanish: "cuatro", japanese: "4", difficulty: 1 },
      { spanish: "cinco", japanese: "5", difficulty: 1 },
      { spanish: "seis", japanese: "6", difficulty: 1 },
      { spanish: "siete", japanese: "7", difficulty: 1 },
      { spanish: "ocho", japanese: "8", difficulty: 1 },
      { spanish: "nueve", japanese: "9", difficulty: 1 },
      { spanish: "diez", japanese: "10", difficulty: 1 },
      { spanish: "once", japanese: "11", difficulty: 2 },
      { spanish: "doce", japanese: "12", difficulty: 2 },
      { spanish: "veinte", japanese: "20", difficulty: 2 },
      { spanish: "treinta", japanese: "30", difficulty: 2 },
      { spanish: "cuarenta", japanese: "40", difficulty: 2 },
      { spanish: "cincuenta", japanese: "50", difficulty: 2 },
      { spanish: "cien", japanese: "100", difficulty: 2 },
      { spanish: "mil", japanese: "1000", difficulty: 2 },
      { spanish: "primero", japanese: "1番目", difficulty: 2 },
      { spanish: "segundo", japanese: "2番目", difficulty: 2 },
    ],
  },
  {
    name: "動詞",
    words: [
      { spanish: "ser", japanese: "〜である（本質）", difficulty: 2 },
      { spanish: "estar", japanese: "〜である（状態）", difficulty: 2 },
      { spanish: "tener", japanese: "持っている", difficulty: 2 },
      { spanish: "hacer", japanese: "する・作る", difficulty: 2 },
      { spanish: "ir", japanese: "行く", difficulty: 1 },
      { spanish: "venir", japanese: "来る", difficulty: 2 },
      { spanish: "hablar", japanese: "話す", difficulty: 1 },
      { spanish: "comer", japanese: "食べる", difficulty: 1 },
      { spanish: "beber", japanese: "飲む", difficulty: 1 },
      { spanish: "vivir", japanese: "住む・生きる", difficulty: 2 },
      { spanish: "querer", japanese: "欲しい・愛する", difficulty: 2 },
      { spanish: "poder", japanese: "〜できる", difficulty: 2 },
      { spanish: "saber", japanese: "知っている", difficulty: 2 },
      { spanish: "ver", japanese: "見る", difficulty: 1 },
      { spanish: "dar", japanese: "与える", difficulty: 2 },
      { spanish: "leer", japanese: "読む", difficulty: 1 },
      { spanish: "escribir", japanese: "書く", difficulty: 2 },
      { spanish: "escuchar", japanese: "聞く", difficulty: 2 },
      { spanish: "trabajar", japanese: "働く", difficulty: 2 },
      { spanish: "dormir", japanese: "眠る", difficulty: 2 },
    ],
  },
  {
    name: "形容詞",
    words: [
      { spanish: "grande", japanese: "大きい", difficulty: 1 },
      { spanish: "pequeño", japanese: "小さい", difficulty: 1 },
      { spanish: "bueno", japanese: "良い", difficulty: 1 },
      { spanish: "malo", japanese: "悪い", difficulty: 1 },
      { spanish: "nuevo", japanese: "新しい", difficulty: 1 },
      { spanish: "viejo", japanese: "古い・老いた", difficulty: 1 },
      { spanish: "joven", japanese: "若い", difficulty: 2 },
      { spanish: "bonito", japanese: "きれいな・素敵な", difficulty: 2 },
      { spanish: "feo", japanese: "醜い", difficulty: 2 },
      { spanish: "rápido", japanese: "速い", difficulty: 2 },
      { spanish: "lento", japanese: "遅い", difficulty: 2 },
      { spanish: "fácil", japanese: "簡単な", difficulty: 2 },
      { spanish: "difícil", japanese: "難しい", difficulty: 2 },
      { spanish: "feliz", japanese: "幸せな", difficulty: 2 },
      { spanish: "triste", japanese: "悲しい", difficulty: 2 },
      { spanish: "caliente", japanese: "熱い・暖かい", difficulty: 2 },
      { spanish: "frío", japanese: "冷たい・寒い", difficulty: 2 },
      { spanish: "alto", japanese: "高い・背が高い", difficulty: 1 },
      { spanish: "bajo", japanese: "低い・背が低い", difficulty: 1 },
      { spanish: "fuerte", japanese: "強い", difficulty: 2 },
    ],
  },
];

async function main(): Promise<void> {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.word.deleteMany();
  await prisma.category.deleteMany();

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        words: {
          create: categoryData.words,
        },
      },
    });
    console.log(`Created category: ${category.name} (${categoryData.words.length} words)`);
  }

  const totalWords = await prisma.word.count();
  const totalCategories = await prisma.category.count();
  console.log(`\nSeeding complete: ${totalCategories} categories, ${totalWords} words`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
