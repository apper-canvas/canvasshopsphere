import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const CartItem = ({ item, onQuantityChange, onRemove, isUpdating }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${item.product.id}`}
            className="block font-semibold text-surface-900 hover:text-primary transition-colors truncate"
          >
            {item.product.name}
          </Link>
          <Text className="text-surface-600 text-sm mt-1">
            {item.product.brand}
          </Text>
          <div className="flex items-center mt-2">
            <PriceDisplay price={item.product.price} className="text-lg font-bold text-primary" />
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => onQuantityChange(item.product.id, item.quantity - 1)}
            onIncrease={() => onQuantityChange(item.product.id, item.quantity + 1)}
            isLoading={isUpdating}
          />

          {/* Remove Button */}
          <Button
            onClick={() => onRemove(item.product.id, item.product.name)}
            className="p-2 text-surface-500 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
            icon={ApperIcon}
            iconSize={18}
            name="Trash2"
          />
        </div>
      </div>

      {/* Item Subtotal */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-200">
        <Text className="text-surface-600">Subtotal</Text>
        <PriceDisplay price={item.product.price * item.quantity} className="text-lg font-semibold text-surface-900" />
      </div>
    </motion.div>
  );
};

export default CartItem;