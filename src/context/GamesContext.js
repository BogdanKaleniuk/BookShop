import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchPopularGames } from "../services/boardGameAPI";

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

  const loadInitialGames = async () => {
    console.log("🚀 loadInitialGames - ПОЧАТОК");
    setLoading(true);
    try {
      const games = await fetchPopularGames(ITEMS_PER_PAGE, 0);
      console.log("🎮 Отримано ігор:", games.length);
      console.log("🎲 Перша гра:", games[0]?.name);

      setApiGames(games);
      setPage(1);

      const shouldHaveMore = games.length >= 10;
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

  const loadMoreGames = async () => {
    console.log("🔄 loadMoreGames викликано");
    if (!hasMore) {
      console.log("⚠️ hasMore = false, виходимо");
      return 0;
    }

    try {
      const skip = page * ITEMS_PER_PAGE;
      console.log(`📡 Завантажуємо з skip=${skip}`);

      const moreGames = await fetchPopularGames(ITEMS_PER_PAGE, skip);
      console.log(`🎮 Отримано ще ${moreGames.length} ігор`);

      if (moreGames.length > 0) {
        setApiGames((prev) => {
          const updated = [...prev, ...moreGames];
          console.log(`📊 Всього ігор тепер: ${updated.length}`);
          return updated;
        });
        setPage((prev) => prev + 1);

        const shouldHaveMore = moreGames.length >= 10;
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
