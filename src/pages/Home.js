import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Ласкаво просимо до BookGame Store!</h1>
        <p>Твоє місце для книг та настільних ігор</p>
      </section>

      <section className="categories">
        <Link to="/books" className="category-card">
          <div className="category-icon">📚</div>
          <h2>Книги</h2>
          <p>Величезний вибір книг різних жанрів</p>
        </Link>

        <Link to="/games" className="category-card">
          <div className="category-icon">🎲</div>
          <h2>Настільні ігри</h2>
          <p>Ігри для всієї родини та друзів</p>
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🚚 Швидка доставка</h3>
          <p>Доставка по всій Україні</p>
        </div>
        <div className="feature">
          <h3>💳 Зручна оплата</h3>
          <p>Готівка або онлайн</p>
        </div>
        <div className="feature">
          <h3>✅ Якість гарантована</h3>
          <p>Оригінальні товари</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
