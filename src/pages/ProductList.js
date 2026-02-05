import React, { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { useToast } from "../components/ToastContainer";
import "./ProductList.css";

function ProductList({ category, addToCart }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { addToast } = useToast();

  const filteredProducts = products
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
      return 0;
    });

  const categoryTitle = category === "books" ? "Книги" : "Настільні ігри";

  const handleAddToCart = (product) => {
    addToCart(product);
    addToast(`${product.name} додано до кошика!`, "success");
  };

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h1>{categoryTitle}</h1>

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
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
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
    </div>
  );
}

export default ProductList;
