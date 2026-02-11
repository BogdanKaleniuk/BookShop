// BGG (BoardGameGeek) XML API 2
const BGG_API = "https://boardgamegeek.com/xmlapi2";

// Функція для отримання популярних ігор
export async function fetchPopularGames(limit = 20, skip = 0) {
  console.log("🎮 fetchPopularGames викликано, limit:", limit, "skip:", skip);

  try {
    // BGG API не підтримує skip, тому використовуємо "hot items"
    // Для пагінації будемо використовувати різні категорії
    const categories = ["boardgame", "boardgameexpansion"];
    const categoryIndex = Math.floor(skip / 50); // Змінюємо категорію кожні 50 ігор
    const type = categories[categoryIndex % categories.length];

    const url = `${BGG_API}/hot?type=${type}`;
    console.log("📡 URL:", url);

    const response = await fetch(url);
    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Парсимо XML
    const items = xmlDoc.getElementsByTagName("item");
    console.log("📦 XML items:", items.length);

    const games = [];
    const itemsToProcess = Math.min(items.length, limit);

    for (let i = 0; i < itemsToProcess; i++) {
      const item = items[i];
      const id = item.getAttribute("id");
      const rank = item.getAttribute("rank");

      const nameElement = item.getElementsByTagName("name")[0];
      const name = nameElement
        ? nameElement.getAttribute("value")
        : "Без назви";

      const yearElement = item.getElementsByTagName("yearpublished")[0];
      const year = yearElement ? yearElement.getAttribute("value") : null;

      const thumbnailElement = item.getElementsByTagName("thumbnail")[0];
      const thumbnail = thumbnailElement
        ? thumbnailElement.getAttribute("value")
        : null;

      games.push({
        id: `bgg-${id}`,
        name: name,
        year: year,
        thumbnail: thumbnail,
        rank: rank,
      });
    }

    // Для кожної гри робимо додатковий запит за деталями (в батчах)
    const detailedGames = await fetchGameDetails(games.slice(0, limit));

    console.log("✨ Transformed games:", detailedGames.length);
    return detailedGames;
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    return [];
  }
}

// Функція для отримання деталей ігор
async function fetchGameDetails(games) {
  if (games.length === 0) return [];

  try {
    // BGG дозволяє запитувати кілька ігор одночасно
    const ids = games.map((g) => g.id.replace("bgg-", "")).join(",");
    const url = `${BGG_API}/thing?id=${ids}&stats=1`;

    console.log("📡 Завантаження деталей для:", games.length, "ігор");

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        "⚠️ Не вдалося завантажити деталі, використовуємо базову інфо",
      );
      return transformBasicGames(games);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.getElementsByTagName("item");
    const detailedGames = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const gameData = parseGameXML(item);
      if (gameData) {
        detailedGames.push(gameData);
      }
    }

    return detailedGames;
  } catch (error) {
    console.error("❌ Error fetching game details:", error);
    return transformBasicGames(games);
  }
}

// Парсимо XML гри
function parseGameXML(item) {
  try {
    const id = item.getAttribute("id");

    // Назва (primary name)
    const names = item.getElementsByTagName("name");
    let primaryName = "Без назви";
    for (let name of names) {
      if (name.getAttribute("type") === "primary") {
        primaryName = name.getAttribute("value");
        break;
      }
    }

    // Опис
    const descElement = item.getElementsByTagName("description")[0];
    const description = descElement ? descElement.textContent : "";

    // Зображення
    const imageElement = item.getElementsByTagName("image")[0];
    const thumbnailElement = item.getElementsByTagName("thumbnail")[0];
    const image = imageElement
      ? imageElement.textContent
      : thumbnailElement
        ? thumbnailElement.textContent
        : "https://via.placeholder.com/400x400/43e97b/ffffff?text=No+Image";

    // Рік
    const yearElement = item.getElementsByTagName("yearpublished")[0];
    const year = yearElement ? yearElement.getAttribute("value") : null;

    // Гравці
    const minPlayersElement = item.getElementsByTagName("minplayers")[0];
    const maxPlayersElement = item.getElementsByTagName("maxplayers")[0];
    const minPlayers = minPlayersElement
      ? minPlayersElement.getAttribute("value")
      : "1";
    const maxPlayers = maxPlayersElement
      ? maxPlayersElement.getAttribute("value")
      : "4";

    // Час гри
    const minPlaytimeElement = item.getElementsByTagName("minplaytime")[0];
    const maxPlaytimeElement = item.getElementsByTagName("maxplaytime")[0];
    const minPlaytime = minPlaytimeElement
      ? minPlaytimeElement.getAttribute("value")
      : null;
    const maxPlaytime = maxPlaytimeElement
      ? maxPlaytimeElement.getAttribute("value")
      : null;

    // Вік
    const minAgeElement = item.getElementsByTagName("minage")[0];
    const minAge = minAgeElement ? minAgeElement.getAttribute("value") : null;

    // Рейтинг і статистика
    const ratingsElement = item.getElementsByTagName("ratings")[0];
    let rating = 0;
    let numRatings = 0;

    if (ratingsElement) {
      const averageElement = ratingsElement.getElementsByTagName("average")[0];
      const usersRatedElement =
        ratingsElement.getElementsByTagName("usersrated")[0];

      rating = averageElement
        ? parseFloat(averageElement.getAttribute("value"))
        : 0;
      numRatings = usersRatedElement
        ? parseInt(usersRatedElement.getAttribute("value"))
        : 0;
    }

    // Складність
    const statisticsElement = item.getElementsByTagName("statistics")[0];
    let complexity = null;
    if (statisticsElement) {
      const ratingsElement =
        statisticsElement.getElementsByTagName("ratings")[0];
      if (ratingsElement) {
        const averageWeightElement =
          ratingsElement.getElementsByTagName("averageweight")[0];
        complexity = averageWeightElement
          ? parseFloat(averageWeightElement.getAttribute("value"))
          : null;
      }
    }

    return transformGameData({
      id: `bgg-${id}`,
      name: primaryName,
      description: description,
      image: image,
      year: year,
      minPlayers: minPlayers,
      maxPlayers: maxPlayers,
      minPlaytime: minPlaytime,
      maxPlaytime: maxPlaytime,
      minAge: minAge,
      rating: rating,
      numRatings: numRatings,
      complexity: complexity,
    });
  } catch (error) {
    console.error("❌ Error parsing game XML:", error);
    return null;
  }
}

// Трансформація базових ігор (якщо деталі не завантажились)
function transformBasicGames(games) {
  return games.map((game) => ({
    id: game.id,
    name: game.name,
    category: "games",
    price: generateRandomPrice(),
    players: "2-4 гравці",
    image:
      game.thumbnail ||
      "https://via.placeholder.com/400x400/43e97b/ffffff?text=No+Image",
    description: "Захоплююча настільна гра для всієї родини",
    inStock: Math.random() > 0.15,
    rating: generateRandomRating(),
    reviewCount: generateRandomReviewCount(),
    yearPublished: game.year,
    minPlayers: 2,
    maxPlayers: 4,
    playtime: "30-60 хв",
    minAge: 10,
    difficulty: null,
  }));
}

// Трансформуємо дані BGG у наш формат
function transformGameData(game) {
  // Генеруємо ціну
  const basePrice = 400;
  const priceVariation = Math.floor(Math.random() * 600) + 200;
  const price = basePrice + priceVariation;

  // Очищаємо опис від HTML тегів
  const cleanDescription = game.description
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#10;/g, " ")
    .trim();

  const shortDescription =
    cleanDescription.length > 200
      ? cleanDescription.substring(0, 200) + "..."
      : cleanDescription || "Опис недоступний";

  return {
    id: game.id,
    name: game.name,
    category: "games",
    price: Math.round(price),
    players:
      game.minPlayers && game.maxPlayers
        ? `${game.minPlayers}-${game.maxPlayers} гравців`
        : "Невідомо",
    image: game.image,
    description: shortDescription,
    inStock: Math.random() > 0.15,
    rating:
      game.rating > 0
        ? parseFloat(game.rating.toFixed(1))
        : generateRandomRating(),
    reviewCount:
      game.numRatings > 0 ? game.numRatings : generateRandomReviewCount(),

    // Додаткові дані
    yearPublished: game.year,
    minPlayers: parseInt(game.minPlayers) || 0,
    maxPlayers: parseInt(game.maxPlayers) || 0,
    playtime:
      game.minPlaytime && game.maxPlaytime
        ? `${game.minPlaytime}-${game.maxPlaytime} хв`
        : null,
    minAge: game.minAge ? parseInt(game.minAge) : null,
    difficulty: game.complexity,
  };
}

// Допоміжні функції
function generateRandomPrice() {
  return Math.floor(Math.random() * 600) + 400; // 400-1000 грн
}

function generateRandomRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5.0
}

function generateRandomReviewCount() {
  return Math.floor(Math.random() * 3000) + 100; // 100-3100
}

// Функція для пошуку (поки не реалізована, використовуємо hot items)
export async function searchGames(query, limit = 20) {
  console.log("🔍 searchGames:", query);
  // BGG search API складніший, поки повертаємо популярні
  return fetchPopularGames(limit, 0);
}
