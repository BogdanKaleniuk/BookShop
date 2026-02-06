import React from "react";
import "./ProductSkeleton.css";

function ProductSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-author"></div>
            <div className="skeleton-rating"></div>
            <div className="skeleton-footer">
              <div className="skeleton-price"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductSkeleton;
