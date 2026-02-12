import React, { createContext, useContext, useState, useEffect } from "react";
import { allGames } from "../data/gamesData";

const GamesContext = createContext();

export function GamesProvider({ children }) {
  const [apiGames, setApiGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Завантаження початкових ігор
  useEffect(() => {
    loadInitialGames();
  }, []);

  const loadInitialGames = () => {
    console.log("🚀 loadInitialGames - ПОЧАТОК");
    setLoading(true);

    try {
      // Беремо перші 20 ігор з локального масиву
      const initialGames = allGames.slice(0, ITEMS_PER_PAGE);
      console.log("🎮 Завантажено початкових ігор:", initialGames.length);
      console.log("🎲 Перша гра:", initialGames[0]?.name);

      setApiGames(initialGames);
      setPage(1);

      // Якщо є ще ігри - можна завантажувати
      const shouldHaveMore = allGames.length > ITEMS_PER_PAGE;
      console.log("✅ Встановлюємо hasMore =", shouldHaveMore);
      setHasMore(shouldHaveMore);
    } catch (error) {
      console.error("❌ Error loading initial games:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      console.log("🏁 loadInitialGames - КІНЕЦЬ");
    }
  };

  const loadMoreGames = () => {
    console.log("🔄 loadMoreGames викликано");

    if (!hasMore) {
      console.log("⚠️ hasMore = false, виходимо");
      return 0;
    }

    try {
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;

      console.log(`📡 Завантажуємо з індексу ${startIndex} до ${endIndex}`);

      // Беремо наступну порцію ігор
      const moreGames = allGames.slice(startIndex, endIndex);
      console.log(`🎮 Отримано ще ${moreGames.length} ігор`);

      if (moreGames.length > 0) {
        setApiGames((prev) => {
          const updated = [...prev, ...moreGames];
          console.log(`📊 Всього ігор тепер: ${updated.length}`);
          return updated;
        });
        setPage((prev) => prev + 1);

        // Перевіряємо чи є ще ігри
        const shouldHaveMore = endIndex < allGames.length;
        console.log("✅ Оновлюємо hasMore =", shouldHaveMore);
        setHasMore(shouldHaveMore);

        return moreGames.length;
      } else {
        console.log("⚠️ Ігор більше немає");
        setHasMore(false);
        return 0;
      }
    } catch (error) {
      console.error("❌ Error loading more games:", error);
      return 0;
    }
  };

  const getGameById = (id) => {
    return apiGames.find((game) => game.id.toString() === id);
  };

  const searchGames = (query) => {
    const searchLower = query.toLowerCase();
    return apiGames.filter((game) => {
      const nameMatch = game.name.toLowerCase().includes(searchLower);
      const descMatch = game.description?.toLowerCase().includes(searchLower);
      return nameMatch || descMatch;
    });
  };

  useEffect(() => {
    console.log("🔵 GamesContext STATE UPDATE:", {
      loading,
      hasMore,
      apiGamesLength: apiGames.length,
      page,
      totalGamesAvailable: allGames.length,
    });
  }, [loading, hasMore, apiGames.length, page]);

  return (
    <GamesContext.Provider
      value={{
        apiGames,
        loading,
        hasMore,
        loadMoreGames,
        getGameById,
        searchGames,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error("useGames must be used within GamesProvider");
  }
  return context;
}
