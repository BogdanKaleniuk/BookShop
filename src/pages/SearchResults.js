import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBooks } from "../context/BooksContext";
import { useGames } from "../context/GamesContext";
import { useToast } from "../components/ToastContainer";
import Rating from "../components/Rating";
import "./SearchResults.css";

function SearchResults({ addToCart }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { addToast } = useToast();

  const { apiBooks } = useBooks();
  const { apiGames } = useGames();

  // Шукаємо і в книгах, і в іграх
  const allProducts = [...apiBooks, ...apiGames];

  const searchResults = allProducts.filter((product) => {
    const searchLower = query.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const authorMatch = product.author?.toLowerCase().includes(searchLower);
    const playersMatch = product.players?.toLowerCase().includes(searchLower);
    const descMatch = product.description?.toLowerCase().includes(searchLower);

    return nameMatch || authorMatch || playersMatch || descMatch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} додано до кошика!`, "success");
  };

  return (
    <div className="search-results">
      <div className="search-header">
        <h1>Результати пошуку: "{query}"</h1>
        <p className="results-count">
          Знайдено {searchResults.length}{" "}
          {searchResults.length === 1 ? "товар" : "товарів"}
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="no-results">
          <h2>😔 Нічого не знайдено</h2>
          <p>Спробуйте змінити пошуковий запит</p>
          <div className="suggestions">
            <h3>Можливо, вас зацікавить:</h3>
            <div className="suggestion-links">
              <Link to="/books">Всі книги</Link>
              <Link to="/games">Всі настільні ігри</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {searchResults.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="product-info">
                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <p className="product-meta">
                  {product.category === "books"
                    ? product.author
                    : product.players}
                </p>

                <Rating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="small"
                />

                <p className="product-category">
                  {product.category === "books"
                    ? "📚 Книга"
                    : "🎮 Настільна гра"}
                </p>

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
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
