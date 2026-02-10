import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://fakestoreapi.com/products/${id}`);

      if (!response.ok) {
        throw new Error("Помилка завантаження товару");
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error}</p>;
  if (!product) return null;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} width={200} />
      <p>{product.description}</p>
      <p>Ціна: {product.price} $</p>
    </div>
  );
};

export default ProductDetail;
