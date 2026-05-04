import React from "react";

interface ProductRatingProps {
  productId: string;
}

export default function ProductRating({ productId }: ProductRatingProps) {
  // Deterministic fake review based on ID string
  const num = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Rating between 3.0 and 4.5
  // (num % 16) / 10 gives values from 0.0 to 1.5. Adding 3.0 gives 3.0 to 4.5.
  const ratingValue = 3.0 + ((num % 16) / 10); 
  const count = 10 + (num % 490); // 10 to 500 reviews

  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        ))}
        {hasHalfStar && (
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
        ))}
      </div>
      <span className="text-sm font-bold text-zinc-500">
        {ratingValue.toFixed(1)} ({count} REVIEWS)
      </span>
    </div>
  );
}
