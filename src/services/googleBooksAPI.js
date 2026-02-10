const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Категорії для різних жанрів
export const BOOK_CATEGORIES = {
  fantasy: "subject:fantasy",
  detective: "subject:detective",
  classic: "subject:classics",
  scifi: "subject:science+fiction",
  romance: "subject:romance",
  history: "subject:history",
  biography: "subject:biography",
  poetry: "subject:poetry",
};

// Функція для отримання книг за категорією
export async function fetchBooksByCategory(
  category,
  maxResults = 20,
  startIndex = 0,
) {
  try {
    const query = BOOK_CATEGORIES[category] || "subject:fiction";
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}&langRestrict=en&orderBy=relevance`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();
    return transformBooksData(data.items || []);
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Функція для пошуку книг
export async function searchBooks(query, maxResults = 20, startIndex = 0) {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}&langRestrict=en`,
    );

    if (!response.ok) {
      throw new Error("Failed to search books");
    }

    const data = await response.json();
    return transformBooksData(data.items || []);
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
}

// Функція для отримання популярних книг з підтримкою пагінації
export async function fetchPopularBooks(maxResults = 40, startIndex = 0) {
  console.log(
    "🔍 fetchPopularBooks викликано, maxResults:",
    maxResults,
    "startIndex:",
    startIndex,
  );

  try {
    // ← ЗМІНИ URL (додаємо printType і projection):
    const url = `${GOOGLE_BOOKS_API}?q=bestseller&maxResults=${maxResults}&startIndex=${startIndex}&orderBy=relevance&printType=books&projection=full`;
    console.log("📡 URL:", url);

    const response = await fetch(url);
    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch popular books");
    }

    const data = await response.json();
    console.log("📦 Raw data items:", data.items?.length || 0);
    console.log("📊 Total items available:", data.totalItems);

    const transformed = transformBooksData(data.items || []);
    console.log("✨ Transformed books:", transformed.length);

    return transformed;
  } catch (error) {
    console.error("❌ Error fetching popular books:", error);
    return [];
  }
}

// Трансформуємо дані Google Books у наш формат
function transformBooksData(items) {
  return items.map((item, index) => {
    const volumeInfo = item.volumeInfo;
    const saleInfo = item.saleInfo;

    // Генеруємо ціну (Google Books API не завжди має ціни)
    const price = saleInfo?.listPrice?.amount || generateRandomPrice();

    // Рейтинг з Google або випадковий (обов'язково число!)
    const rating =
      parseFloat(volumeInfo.averageRating) || generateRandomRating();
    const reviewCount = volumeInfo.ratingsCount || generateRandomReviewCount();

    return {
      id: `google-${item.id}`, // Унікальний ID без index (щоб не дублювались)
      name: volumeInfo.title || "Без назви",
      category: "books",
      price: Math.round(price),
      author: volumeInfo.authors
        ? volumeInfo.authors.join(", ")
        : "Невідомий автор",
      image:
        volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
        volumeInfo.imageLinks?.smallThumbnail?.replace("http:", "https:") ||
        "https://via.placeholder.com/128x192/667eea/ffffff?text=No+Cover",
      description: volumeInfo.description
        ? volumeInfo.description.substring(0, 200) + "..."
        : "Опис недоступний",
      inStock: Math.random() > 0.2, // 80% книг в наявності
      rating: rating,
      reviewCount: reviewCount,
      language: volumeInfo.language || "en",
      publishedDate: volumeInfo.publishedDate || "Невідомо",
      pageCount: volumeInfo.pageCount || 0,
    };
  });
}

// Допоміжні функції для генерації випадкових значень
function generateRandomPrice() {
  return Math.floor(Math.random() * 400) + 200; // Від 200 до 600 грн
}

function generateRandomRating() {
  return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // Від 3.5 до 5.0, число
}

function generateRandomReviewCount() {
  return Math.floor(Math.random() * 5000) + 100; // Від 100 до 5100
}
