import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import { useGames } from "../context/GamesContext";
import { useToast } from "../components/ToastContainer";
import Rating from "../components/Rating";
import ProductSkeleton from "../components/ProductSkeleton";
import "./ProductList.css";

function ProductList({ category, addToCart }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loadingMore, setLoadingMore] = useState(false);
  const { addToast } = useToast();

  // Отримуємо дані з відповідного Context
  const booksContext = useBooks();
  const gamesContext = useGames();

  // Визначаємо який контекст використовувати
  const {
    apiBooks,
    loading: booksLoading,
    hasMore: booksHasMore,
    loadMoreBooks,
  } = booksContext;

  const {
    apiGames,
    loading: gamesLoading,
    hasMore: gamesHasMore,
    loadMoreGames,
  } = gamesContext;

  // Вибираємо дані залежно від категорії
  const allProducts = category === "books" ? apiBooks : apiGames;
  const loading = category === "books" ? booksLoading : gamesLoading;
  const hasMore = category === "books" ? booksHasMore : gamesHasMore;
  const loadMore = category === "books" ? loadMoreBooks : loadMoreGames;

  const filteredProducts = allProducts
    .filter((product) => {
      if (filter === "inStock") return product.inStock;
      if (filter === "outOfStock") return !product.inStock;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const categoryTitle = category === "books" ? "Книги" : "Настільні ігри";
  const categoryEmoji = category === "books" ? "📚" : "🎮";

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} додано до кошика!`, "success");
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const count = await loadMore();
    if (count > 0) {
      const itemType = category === "books" ? "книг" : "ігор";
      addToast(`Завантажено ще ${count} ${itemType}`, "success");
    } else {
      addToast("Більше товарів немає", "info");
    }
    setLoadingMore(false);
  };

  return (
    <div className="product-list">
      <div className="product-list-header">
        <div className="header-title">
          <h1>{categoryTitle}</h1>
          <span className="product-count">
            {loading ? "..." : `${filteredProducts.length} товарів`}
          </span>
        </div>

        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Всі товари</option>
            <option value="inStock">В наявності</option>
            <option value="outOfStock">Немає в наявності</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">За назвою</option>
            <option value="priceLow">Спочатку дешевші</option>
            <option value="priceHigh">Спочатку дорожчі</option>
            <option value="rating">За рейтингом</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <ProductSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>😔 Товарів не знайдено</h2>
            <p>Спробуйте змінити фільтри</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="product-info">
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <p className="product-meta">
                  {category === "books" ? product.author : product.players}
                </p>

                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="small"
                />

                <div className="product-footer">
                  <span className="price">{product.price} ₴</span>

                  {product.inStock ? (
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      До кошика
                    </button>
                  ) : (
                    <span className="out-of-stock">Немає в наявності</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Кнопка "Завантажити ще" */}
      {!loading && hasMore && (
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <span className="spinner"></span>
                Завантаження...
              </>
            ) : (
              <>
                {categoryEmoji} Завантажити ще{" "}
                {category === "books" ? "книги" : "ігри"}
              </>
            )}
          </button>
          <p className="load-more-hint">
            Завантажено: {allProducts.length}{" "}
            {category === "books" ? "книг" : "ігор"}
          </p>
        </div>
      )}

      {/* Повідомлення коли товари закінчились */}
      {!loading && !hasMore && allProducts.length > 0 && (
        <div className="no-more-items">
          <p>
            🎉 Ви переглянули всі доступні{" "}
            {category === "books" ? "книги" : "ігри"}!
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
