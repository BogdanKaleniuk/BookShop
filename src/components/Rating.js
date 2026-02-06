import React from "react";
import "./Rating.css";

function Rating({ rating, reviewCount, showReviews = true, size = "medium" }) {
  // Перетворюємо rating в число (якщо прийшов string)
  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;

  // Перевірка на валідність
  if (isNaN(numRating) || numRating < 0 || numRating > 5) {
    console.warn("Invalid rating:", rating);
    return null; // Не показуємо рейтинг якщо він невалідний
  }

  // Створюємо масив з 5 зірок
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(numRating)) {
      // Повна зірка
      stars.push(
        <span key={i} className="star star-full">
          ★
        </span>,
      );
    } else if (i === Math.ceil(numRating) && numRating % 1 !== 0) {
      // Напівзірка (якщо рейтинг 4.5, наприклад)
      stars.push(
        <span key={i} className="star star-half">
          ★
        </span>,
      );
    } else {
      // Порожня зірка
      stars.push(
        <span key={i} className="star star-empty">
          ★
        </span>,
      );
    }
  }

  return (
    <div className={`rating rating-${size}`}>
      <div className="stars">{stars}</div>
      <div className="rating-info">
        <span className="rating-value">{numRating.toFixed(1)}</span>
        {showReviews && reviewCount && (
          <span className="review-count">({reviewCount})</span>
        )}
      </div>
    </div>
  );
}

export default Rating;
