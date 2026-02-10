import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchBooksFromAPI } from "../data/products";

const BooksContext = createContext();

export function BooksProvider({ children }) {
  const [apiBooks, setApiBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Завантаження початкових книг
  useEffect(() => {
    loadInitialBooks();
  }, []);

  const loadInitialBooks = async () => {
    console.log("🚀 loadInitialBooks - ПОЧАТОК");
    setLoading(true);
    try {
      const books = await fetchBooksFromAPI(ITEMS_PER_PAGE, 0);
      console.log("📚 Отримано книг:", books.length);
      console.log("📖 Перша книга:", books[0]?.name);

      setApiBooks(books);
      setPage(1);

      // ВИПРАВЛЕННЯ: Завжди true якщо є хоч одна книга
      const shouldHaveMore = books.length >= 10; // Якщо >= 10 книг, можна завантажувати ще
      console.log("✅ Встановлюємо hasMore =", shouldHaveMore);
      setHasMore(shouldHaveMore);
    } catch (error) {
      console.error("❌ Error loading initial books:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      console.log("🏁 loadInitialBooks - КІНЕЦЬ");
    }
  };

  const loadMoreBooks = async () => {
    console.log("🔄 loadMoreBooks викликано");
    if (!hasMore) {
      console.log("⚠️ hasMore = false, виходимо");
      return 0;
    }

    try {
      const startIndex = page * ITEMS_PER_PAGE;
      console.log(`📡 Завантажуємо з startIndex=${startIndex}`);

      const moreBooks = await fetchBooksFromAPI(ITEMS_PER_PAGE, startIndex);
      console.log(`📚 Отримано ще ${moreBooks.length} книг`);

      if (moreBooks.length > 0) {
        setApiBooks((prev) => {
          const updated = [...prev, ...moreBooks];
          console.log(`📊 Всього книг тепер: ${updated.length}`);
          return updated;
        });
        setPage((prev) => prev + 1);

        // Якщо отримали хоч щось - можна завантажувати ще
        const shouldHaveMore = moreBooks.length >= 10;
        console.log("✅ Оновлюємо hasMore =", shouldHaveMore);
        setHasMore(shouldHaveMore);

        return moreBooks.length;
      } else {
        console.log("⚠️ Книг більше немає");
        setHasMore(false);
        return 0;
      }
    } catch (error) {
      console.error("❌ Error loading more books:", error);
      return 0;
    }
  };

  const getBookById = (id) => {
    return apiBooks.find((book) => book.id.toString() === id);
  };

  const searchBooks = (query) => {
    const searchLower = query.toLowerCase();
    return apiBooks.filter((book) => {
      const nameMatch = book.name.toLowerCase().includes(searchLower);
      const authorMatch = book.author?.toLowerCase().includes(searchLower);
      const descMatch = book.description?.toLowerCase().includes(searchLower);
      return nameMatch || authorMatch || descMatch;
    });
  };

  // DEBUG: Логуємо стан при кожній зміні
  useEffect(() => {
    console.log("🔵 BooksContext STATE UPDATE:", {
      loading,
      hasMore,
      apiBooksLength: apiBooks.length,
      page,
    });
  }, [loading, hasMore, apiBooks.length, page]);

  return (
    <BooksContext.Provider
      value={{
        apiBooks,
        loading,
        hasMore,
        loadMoreBooks,
        getBookById,
        searchBooks,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within BooksProvider");
  }
  return context;
}
