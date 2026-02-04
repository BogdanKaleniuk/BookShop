import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import "./ProductDetail.css";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail">
        <div className="not-found">
          <h2>Товар не знайдено</h2>
          <Link to="/" className="back-btn">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} додано до кошика!`);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Назад
      </button>

      <div className="detail-container">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>

          {product.category === "books" ? (
            <p className="detail-meta">Автор: {product.author}</p>
          ) : (
            <p className="detail-meta">Кількість гравців: {product.players}</p>
          )}

          <p className="detail-description">{product.description}</p>

          <div className="detail-price">
            <span className="price-label">Ціна:</span>
            <span className="price-value">{product.price} ₴</span>
          </div>

          <div className="detail-stock">
            {product.inStock ? (
              <span className="in-stock">✓ В наявності</span>
            ) : (
              <span className="out-of-stock">✗ Немає в наявності</span>
            )}
          </div>

          {product.inStock && (
            <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
              Додати до кошика
            </button>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Схожі товари</h2>
          <div className="related-grid">
            {relatedProducts.map((relatedProduct) => (
              <Link
                to={`/product/${relatedProduct.id}`}
                key={relatedProduct.id}
                className="related-card"
              >
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <h3>{relatedProduct.name}</h3>
                <p className="related-price">{relatedProduct.price} ₴</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
