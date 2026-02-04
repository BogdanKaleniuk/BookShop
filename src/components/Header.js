import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>BookGame Store</h1>
        </Link>

        <nav className="nav">
          <Link to="/">Головна</Link>
          <Link to="/books">Книги</Link>
          <Link to="/games">Настільні ігри</Link>
        </nav>

        <Link to="/cart" className="cart-icon">
          🛒 Кошик{" "}
          {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
        </Link>
      </div>
    </header>
  );
}

export default Header;
