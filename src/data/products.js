import {
  fetchBooksByCategory,
  fetchPopularBooks,
} from "../services/googleBooksAPI";
// Кеш для API даних
let cachedApiBooks = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 хвилин

// Функція для отримання всіх товарів (локальні + API)
export async function getAllProducts(forceRefresh = false) {
  console.log("🔵 getAllProducts викликано"); // ← ДОДАЙ

  const now = Date.now();

  // Перевіряємо кеш
  if (
    !forceRefresh &&
    cachedApiBooks &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return [...localProducts, ...cachedApiBooks];
  }

  try {
    // Завантажуємо книги з API
    const apiBooks = await fetchPopularBooks(40);
    console.log("📚 Перші 3 книги:", apiBooks.slice(0, 3)); // ← ДОДАЙ

    // Зберігаємо в кеш
    cachedApiBooks = apiBooks;
    cacheTimestamp = now;

    // Повертаємо комбіновані дані
    return [...localProducts, ...apiBooks];
  } catch (error) {
    console.error("Error loading API books:", error);
    // Якщо помилка - повертаємо тільки локальні
    return localProducts;
  }
}

// Локальні товари (наші 35 товарів залишаються як fallback)
const localProducts = [
  // ============ КНИГИ ============
  {
    id: 1,
    name: "Гаррі Поттер і Філософський Камінь",
    category: "books",
    price: 350,
    author: "Дж. К. Роулінг",
    image:
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    description:
      "Перша книга культової серії про юного чарівника, який дізнається про свої магічні здібності",
    inStock: true,
    rating: 4.9,
    reviewCount: 1250,
  },
  {
    id: 2,
    name: "Кобзар",
    category: "books",
    price: 250,
    author: "Тарас Шевченко",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "Збірка поезій класика української літератури",
    inStock: true,
    rating: 4.8,
    reviewCount: 890,
  },
  {
    id: 3,
    name: "1984",
    category: "books",
    price: 300,
    author: "Джордж Орвелл",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description: "Антиутопія про тоталітарне суспільство майбутнього",
    inStock: true,
    rating: 4.7,
    reviewCount: 2100,
  },
  {
    id: 4,
    name: "Майстер і Маргарита",
    category: "books",
    price: 320,
    author: "Михайло Булгаков",
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description: "Містичний роман про любов і боротьбу добра зі злом",
    inStock: true,
    rating: 4.9,
    reviewCount: 1680,
  },
  {
    id: 5,
    name: "Тіні забутих предків",
    category: "books",
    price: 280,
    author: "Михайло Коцюбинський",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    description: "Класика української прози про кохання в Карпатах",
    inStock: false,
    rating: 4.6,
    reviewCount: 450,
  },
  {
    id: 11,
    name: "Маленький принц",
    category: "books",
    price: 220,
    author: "Антуан де Сент-Екзюпері",
    image:
      "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=400&h=600&fit=crop",
    description: "Філософська казка про дружбу, любов і сенс життя",
    inStock: true,
    rating: 4.9,
    reviewCount: 3400,
  },
  {
    id: 12,
    name: "Володар перснів",
    category: "books",
    price: 450,
    author: "Дж. Р. Р. Толкін",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    description: "Епічна фентезі-сага про боротьбу добра зі злом",
    inStock: true,
    rating: 4.9,
    reviewCount: 5200,
  },
  {
    id: 13,
    name: "Злочин і кара",
    category: "books",
    price: 310,
    author: "Федір Достоєвський",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    description: "Психологічний роман про моральний вибір",
    inStock: true,
    rating: 4.7,
    reviewCount: 1890,
  },
  {
    id: 14,
    name: "Над прірвою в житі",
    category: "books",
    price: 270,
    author: "Джером Селінджер",
    image:
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop",
    description: "Культовий роман про підліткові проблеми",
    inStock: true,
    rating: 4.5,
    reviewCount: 2300,
  },
  {
    id: 15,
    name: "Сто років самотності",
    category: "books",
    price: 340,
    author: "Габріель Гарсія Маркес",
    image:
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=600&fit=crop",
    description: "Магічний реалізм про історію сім'ї Буендіа",
    inStock: true,
    rating: 4.8,
    reviewCount: 1560,
  },
  {
    id: 16,
    name: "Великий Гетсбі",
    category: "books",
    price: 260,
    author: "Френсіс Скотт Фіцджеральд",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    description: "Класика американської літератури про американську мрію",
    inStock: true,
    rating: 4.6,
    reviewCount: 2780,
  },
  {
    id: 17,
    name: "Убити пересмішника",
    category: "books",
    price: 290,
    author: "Харпер Лі",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    description: "Роман про расову нерівність у Америці 1930-х",
    inStock: false,
    rating: 4.8,
    reviewCount: 3100,
  },
  {
    id: 18,
    name: "Атлант розправив плечі",
    category: "books",
    price: 480,
    author: "Айн Ренд",
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    description: "Філософський роман про індивідуалізм і капіталізм",
    inStock: true,
    rating: 4.4,
    reviewCount: 1200,
  },
  {
    id: 19,
    name: "Гордість і упередження",
    category: "books",
    price: 275,
    author: "Джейн Остін",
    image:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=600&fit=crop",
    description: "Романтична історія про класові різниці в Англії",
    inStock: true,
    rating: 4.7,
    reviewCount: 2900,
  },
  {
    id: 20,
    name: "Данте Аліг'єрі: Божественна комедія",
    category: "books",
    price: 380,
    author: "Данте Аліг'єрі",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    description: "Епічна поема про подорож через пекло, чистилище та рай",
    inStock: true,
    rating: 4.6,
    reviewCount: 890,
  },

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

// Синхронний експорт локальних товарів (для сумісності)
export const products = localProducts;
