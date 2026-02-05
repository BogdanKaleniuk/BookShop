import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import SearchResults from "./pages/SearchResults";
import { ToastProvider } from "./components/ToastContainer";

function App() {
  // Завантажуємо кошик з localStorage при старті

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("bookgame-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }); // Масив з товарами у кошику та оновлення

  // Зберігаємо кошик в localStorage при кожній зміні

  useEffect(() => {
    localStorage.setItem("bookgame-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      // Товар вже є - збільшуємо кількість

      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      // Товару немає - додаємо новий

      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  // Видаляє товар з кошика

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };
  // Оновлює кількість товару. Якщо кількість 0 або менше - видаляє товар.

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };
  // Функція для очищення кошика

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <ToastProvider>
        <div className="App">
          <Header
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/books"
              element={<ProductList category="books" addToCart={addToCart} />}
            />
            <Route
              path="/games"
              element={<ProductList category="games" addToCart={addToCart} />}
            />
            <Route
              path="/product/:id"
              element={<ProductDetail addToCart={addToCart} />}
            />
            <Route
              path="/search"
              element={<SearchResults addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              }
            />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
