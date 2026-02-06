import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products, getAllProducts } from "../data/products";
import { useToast } from "../components/ToastContainer";
import Rating from "../components/Rating";
import "./ProductDetail.css";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const allProducts = await getAllProducts();
      const foundProduct = allProducts.find((p) => p.id.toString() === id);

      if (foundProduct) {
        setProduct(foundProduct);

        // Знаходимо схожі товари
        const related = allProducts
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id,
          )
          .slice(0, 3);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      // Fallback до локальних даних
      const foundProduct = products.find((p) => p.id.toString() === id);
      setProduct(foundProduct || null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження...</p>
        </div>
      </div>
    );
  }

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
    addToast(`${product.name} додано до кошика!`, "success");
  };

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

          <Rating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="large"
          />

          <p className="detail-description">{product.description}</p>

          {product.publishedDate && (
            <p className="detail-extra">
              Дата публікації: {product.publishedDate}
            </p>
          )}

          {product.pageCount && product.pageCount > 0 && (
            <p className="detail-extra">Сторінок: {product.pageCount}</p>
          )}

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
                <Rating
                  rating={relatedProduct.rating}
                  reviewCount={relatedProduct.reviewCount}
                  size="small"
                />
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
