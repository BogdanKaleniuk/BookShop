import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import "./Cart.css";

function Cart({ cart, updateQuantity, removeFromCart, clearCart }) {
  const { addToast } = useToast();
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleRemove = (item) => {
    removeFromCart(item.id);
    addToast(`${item.name} видалено з кошика`, "error");
  };

  const handleClearCart = () => {
    clearCart();
    addToast("Кошик очищено", "info");
  };

  if (cart.length === 0) {
    return (
      <div className="cart">
        <div className="empty-cart">
          <h2>Ваш кошик порожній</h2>
          <p>Додайте товари, щоб продовжити покупки</p>
          <Link to="/" className="continue-shopping-btn">
            Продовжити покупки
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>Кошик</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>
                  <h3>{item.name}</h3>
                </Link>
                <p className="cart-item-meta">
                  {item.category === "books" ? item.author : item.players}
                </p>
                <p className="cart-item-price">{item.price} ₴</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <p className="item-total">{item.price * item.quantity} ₴</p>

                <button
                  onClick={() => handleRemove(item)}
                  className="remove-btn"
                >
                  🗑️ Видалити
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Підсумок замовлення</h2>

          <div className="summary-row">
            <span>Товарів:</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} шт</span>
          </div>

          <div className="summary-row">
            <span>Сума:</span>
            <span>{totalPrice} ₴</span>
          </div>

          <div className="summary-row total">
            <span>До сплати:</span>
            <span>{totalPrice} ₴</span>
          </div>

          <button className="checkout-btn">Оформити замовлення</button>

          <button className="clear-cart-btn" onClick={handleClearCart}>
            Очистити кошик
          </button>

          <Link to="/" className="continue-link">
            Продовжити покупки
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
