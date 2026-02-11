const BOARD_GAME_API = "https://api.boardgameatlas.com/api";
const CLIENT_ID = "JM0HHBQwDi"; // ← ЗАМІНИ на свій ключ коли отримаєш

// Функція для отримання популярних ігор
export async function fetchPopularGames(limit = 20, skip = 0) {
  console.log("🎮 fetchPopularGames викликано, limit:", limit, "skip:", skip);

  try {
    const url = `${BOARD_GAME_API}/search?order_by=popularity&ascending=false&limit=${limit}&skip=${skip}&client_id=${CLIENT_ID}`;
    console.log("📡 URL:", url);

    const response = await fetch(url);
    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const data = await response.json();
    console.log("📦 Raw data games:", data.games?.length || 0);

    const transformed = transformGamesData(data.games || []);
    console.log("✨ Transformed games:", transformed.length);

    return transformed;
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    return [];
  }
}

// Функція для пошуку ігор
export async function searchGames(query, limit = 20, skip = 0) {
  console.log("🔍 searchGames викликано, query:", query);

  try {
    const url = `${BOARD_GAME_API}/search?name=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&client_id=${CLIENT_ID}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to search games");
    }

    const data = await response.json();
    return transformGamesData(data.games || []);
  } catch (error) {
    console.error("❌ Error searching games:", error);
    return [];
  }
}

// Трансформуємо дані Board Game Atlas у наш формат
function transformGamesData(games) {
  return games.map((game) => {
    // Генеруємо ціну на основі складності та популярності
    const basePrice = 400;
    const priceVariation = Math.floor(Math.random() * 600) + 200; // 200-800
    const price = basePrice + priceVariation;

    return {
      id: `bga-${game.id}`, // Унікальний ID
      name: game.name || "Без назви",
      category: "games",
      price: Math.round(price),
      players:
        game.min_players && game.max_players
          ? `${game.min_players}-${game.max_players} гравців`
          : "Невідомо",
      image:
        game.images?.medium ||
        game.images?.small ||
        game.thumb_url ||
        "https://via.placeholder.com/400x400/43e97b/ffffff?text=No+Image",
      description: game.description_preview
        ? game.description_preview.substring(0, 200) + "..."
        : game.description
          ? game.description.substring(0, 200) + "..."
          : "Опис недоступний",
      inStock: Math.random() > 0.15, // 85% ігор в наявності
      rating:
        parseFloat(game.average_user_rating?.toFixed(1)) ||
        generateRandomRating(),
      reviewCount: game.num_user_ratings || generateRandomReviewCount(),

      // Додаткові дані про гру
      yearPublished: game.year_published || null,
      minPlayers: game.min_players || 0,
      maxPlayers: game.max_players || 0,
      playtime:
        game.min_playtime && game.max_playtime
          ? `${game.min_playtime}-${game.max_playtime} хв`
          : null,
      minAge: game.min_age || null,
      difficulty: game.average_learning_complexity || null,
    };
  });
}

// Допоміжні функції
function generateRandomRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // 3.5-5.0
}

function generateRandomReviewCount() {
  return Math.floor(Math.random() * 3000) + 100; // 100-3100
}
