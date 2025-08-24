// components/childcare/ProductCard.tsx
"use client";

import React from "react";
import { Star, ShoppingCart, Heart, Tag } from "lucide-react";

// Define ToyProduct and ClothingItem types
interface ToyProduct {
  title: string;
  image: string;
  brand: string;
  category: string;
  ageGroup: string;
  rating: {
    rate: number;
    count: number;
  };
  description: string;
  price: number;
}

interface ClothingItem {
  title: string;
  image: string;
  brand: string;
  category: string;
  sizes: string[];
  colors: string[];
  rating: {
    rate: number;
    count: number;
  };
  description: string;
  price: number;
}

interface ProductCardProps {
  product: ToyProduct | ClothingItem;
  type: "toy" | "clothing";
  onAddToWishlist?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToWishlist,
}) => {
  const isToyProduct = (
    prod: ToyProduct | ClothingItem
  ): prod is ToyProduct => {
    return "ageGroup" in prod;
  };

  const isClothingItem = (
    prod: ToyProduct | ClothingItem
  ): prod is ClothingItem => {
    return "sizes" in prod;
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist();
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would integrate with your e-commerce system
    alert(`Added ${product.title} to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(
              product.title
            )}`;
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-pink-50 hover:text-pink-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Brand Badge */}
        {isToyProduct(product) && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
            {product.brand}
          </div>
        )}

        {isClothingItem(product) && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
            {product.brand}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Category and Age/Size Info */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            {product.category}
          </span>
          {isToyProduct(product) && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {product.ageGroup}
            </span>
          )}
          {isClothingItem(product) && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {product.sizes.length} sizes
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">
              {product.rating.rate}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            ({product.rating.count} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Additional Details */}
        {isClothingItem(product) && product.colors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Available Colors:</p>
            <div className="flex gap-1 flex-wrap">
              {product.colors
                .slice(0, 3)
                .map((color: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                  >
                    {color}
                  </span>
                ))}
              {product.colors.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                  +{product.colors.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <span className="text-xl font-bold text-green-600">
              ${product.price}
            </span>
          </div>

          <button
            onClick={handleBuyNow}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
