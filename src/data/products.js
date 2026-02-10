import { fetchPopularBooks } from "../services/googleBooksAPI";

// Локальні товари - ТІЛЬКИ НАСТІЛЬНІ ІГРИ
const localProducts = [
  // ============ НАСТІЛЬНІ ІГРИ ============
  {
    id: 6,
    name: "Катан",
    category: "games",
    price: 850,
    players: "3-4 гравці",
    image:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=600&fit=crop",
    description:
      "Стратегічна гра про колонізацію острова та торгівлю ресурсами",
    inStock: true,
    rating: 4.8,
    reviewCount: 3200,
  },
  {
    id: 7,
    name: "Монополія",
    category: "games",
    price: 650,
    players: "2-6 гравців",
    image:
      "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400&h=600&fit=crop",
    description: "Класична економічна настільна гра про нерухомість",
    inStock: true,
    rating: 4.5,
    reviewCount: 5600,
  },
  {
    id: 8,
    name: "Uno",
    category: "games",
    price: 250,
    players: "2-10 гравців",
    image:
      "https://images.unsplash.com/photo-1611891487974-cf3aa89c574c?w=400&h=600&fit=crop",
    description: "Популярна карткова гра для всієї родини",
    inStock: true,
    rating: 4.4,
    reviewCount: 4800,
  },
  {
    id: 9,
    name: "Діксіт",
    category: "games",
    price: 750,
    players: "3-6 гравців",
    image:
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=600&fit=crop",
    description: "Креативна гра з красивими ілюстраціями для асоціацій",
    inStock: true,
    rating: 4.9,
    reviewCount: 2100,
  },
  {
    id: 10,
    name: "Мафія",
    category: "games",
    price: 450,
    players: "6-20 гравців",
    image:
      "https://images.unsplash.com/photo-1541531386433-2f1b90e98c89?w=400&h=600&fit=crop",
    description: "Психологічна гра для великої компанії з детективним сюжетом",
    inStock: false,
    rating: 4.6,
    reviewCount: 1900,
  },
  {
    id: 21,
    name: "Каркассон",
    category: "games",
    price: 720,
    players: "2-5 гравців",
    image:
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=600&fit=crop",
    description: "Стратегічна гра про будівництво середньовічного міста",
    inStock: true,
    rating: 4.7,
    reviewCount: 2800,
  },
  {
    id: 22,
    name: "Ticket to Ride",
    category: "games",
    price: 890,
    players: "2-5 гравців",
    image:
      "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&h=600&fit=crop",
    description: "Захоплююча гра про будівництво залізниць",
    inStock: true,
    rating: 4.8,
    reviewCount: 3500,
  },
  {
    id: 23,
    name: "Codenames",
    category: "games",
    price: 550,
    players: "4-8 гравців",
    image:
      "https://images.unsplash.com/photo-1631193086562-09f327a3c0be?w=400&h=600&fit=crop",
    description: "Командна гра на асоціації та логіку",
    inStock: true,
    rating: 4.9,
    reviewCount: 4200,
  },
  {
    id: 24,
    name: "Pandemic",
    category: "games",
    price: 980,
    players: "2-4 гравці",
    image:
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=600&fit=crop",
    description: "Кооперативна гра про боротьбу з епідеміями",
    inStock: true,
    rating: 4.7,
    reviewCount: 2600,
  },
  {
    id: 25,
    name: "Азул",
    category: "games",
    price: 820,
    players: "2-4 гравці",
    image:
      "https://images.unsplash.com/photo-1628707280926-1bf98f419e87?w=400&h=600&fit=crop",
    description: "Абстрактна гра про створення візерунків з плиток",
    inStock: true,
    rating: 4.8,
    reviewCount: 1900,
  },
  {
    id: 26,
    name: "7 Чудес",
    category: "games",
    price: 950,
    players: "3-7 гравців",
    image:
      "https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=400&h=600&fit=crop",
    description: "Стратегічна гра про розвиток цивілізацій",
    inStock: false,
    rating: 4.6,
    reviewCount: 2200,
  },
  {
    id: 27,
    name: "Splendor",
    category: "games",
    price: 680,
    players: "2-4 гравці",
    image:
      "https://images.unsplash.com/photo-1611891487974-cf3aa89c574c?w=400&h=600&fit=crop",
    description: "Гра про торгівлю коштовностями в епоху Ренесансу",
    inStock: true,
    rating: 4.7,
    reviewCount: 3100,
  },
  {
    id: 28,
    name: "Доббль",
    category: "games",
    price: 380,
    players: "2-8 гравців",
    image:
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=600&fit=crop",
    description: "Швидка гра на уважність та реакцію",
    inStock: true,
    rating: 4.5,
    reviewCount: 5300,
  },
  {
    id: 29,
    name: "Kingdomino",
    category: "games",
    price: 590,
    players: "2-4 гравці",
    image:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=600&fit=crop",
    description: "Проста стратегічна гра про створення королівства",
    inStock: true,
    rating: 4.6,
    reviewCount: 1800,
  },
  {
    id: 30,
    name: "Scrabble (Ерудит)",
    category: "games",
    price: 520,
    players: "2-4 гравці",
    image:
      "https://images.unsplash.com/photo-1541531386433-2f1b90e98c89?w=400&h=600&fit=crop",
    description: "Класична словесна гра для ерудитів",
    inStock: true,
    rating: 4.4,
    reviewCount: 4100,
  },
];

// Функція для завантаження книг з API (з пагінацією)
export async function fetchBooksFromAPI(limit = 40, startIndex = 0) {
  try {
    console.log(
      `🌐 Завантаження книг: limit=${limit}, startIndex=${startIndex}`,
    );
    const apiBooks = await fetchPopularBooks(limit, startIndex);
    console.log(`✅ Завантажено ${apiBooks.length} книг з API`);
    return apiBooks;
  } catch (error) {
    console.error("❌ Помилка завантаження книг з API:", error);
    return [];
  }
}

// Експорт тільки ігор (книг немає!)
export const products = localProducts;
