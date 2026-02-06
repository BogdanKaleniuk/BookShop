import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { products, getAllProducts } from "../data/products";
import { useToast } from "../components/ToastContainer";
import Rating from "../components/Rating";
import ProductSkeleton from "../components/ProductSkeleton";
import "./ProductList.css";

function ProductList({ category, addToCart }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [allProducts, setAllProducts] = useState(products);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Завантажуємо товари при першому рендері
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getAllProducts();
      setAllProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      addToast("Помилка завантаження товарів", "error");
      setAllProducts(products); // Fallback до локальних
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = allProducts
    .filter((product) => product.category === category)
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

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} додано до кошика!`, "success");
  };

  const handleRefresh = () => {
    loadProducts();
    addToast("Оновлення товарів...", "info");
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

          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "⏳" : "🔄"} Оновити
          </button>
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
    </div>
  );
}

export default ProductList;
