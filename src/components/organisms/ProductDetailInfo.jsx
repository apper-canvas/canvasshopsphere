import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import RatingStars from '@/components/atoms/RatingStars';
import Text from '@/components/atoms/Text';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import Button from '@/components/atoms/Button';

const ProductDetailInfo = ({ product, quantity, onQuantityChange, onAddToCart, addingToCart }) => {
  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" className="text-3xl font-heading font-bold text-surface-900 mb-2">
          {product.name}
        </Text>
        <Text as="p" className="text-lg text-surface-600 mb-4">{product.brand}</Text>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <RatingStars rating={product.rating} size={18} />
            <Text as="span" className="text-lg font-medium text-surface-900">
              {product.rating}
            </Text>
          </div>
          <Text as="span" className="text-surface-600">
            ({product.reviewCount} reviews)
          </Text>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <PriceDisplay price={product.price} className="text-4xl font-bold text-primary" />
        {product.originalPrice && (
          <PriceDisplay price={product.originalPrice} className="text-xl text-surface-500 line-through" />
        )}
        {product.discount && (
          <Text as="span" className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.discount}% OFF
          </Text>
        )}
      </div>

      <Text as="p" className="text-surface-700 leading-relaxed">
        {product.description}
      </Text>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center space-x-4">
        <QuantitySelector 
          quantity={quantity} 
          onDecrease={() => onQuantityChange(Math.max(1, quantity - 1))}
          onIncrease={() => onQuantityChange(quantity + 1)}
        />

        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          disabled={addingToCart}
          className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          icon={ApperIcon}
          iconSize={20}
          name={addingToCart ? "Loader2" : "ShoppingCart"}
          classNameOverride={addingToCart ? "animate-spin" : ""}
        >
          <span>Add to Cart</span>
        </Button>
      </div>

      {/* Product Attributes */}
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div className="border-t border-surface-200 pt-6">
          <Text as="h3" className="font-semibold text-surface-900 mb-4">Specifications</Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(product.attributes).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <Text as="span" className="text-surface-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </Text>
                <Text as="span" className="font-medium text-surface-900">{value}</Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailInfo;