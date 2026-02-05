import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ cartCount }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>BookGame Store</h1>
        </Link>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Шукати книги та ігри..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
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
