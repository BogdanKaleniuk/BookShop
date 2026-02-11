import { fetchPopularBooks } from "../services/googleBooksAPI";

// Функція для завантаження книг з API (з пагінацією)
export async function fetchBooksFromAPI(limit = 20, startIndex = 0) {
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

// Експорт порожнього масиву (локальних товарів більше немає!)
export const products = [];
