import React from 'react';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const ProductThumbnail = ({ imageUrl, name, quantity, price, productId }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-surface-50 rounded-lg">
      <div className="w-16 h-16 bg-surface-200 rounded-lg flex items-center justify-center">
        {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
        ) : (
            <ApperIcon name="Package" size={24} className="text-surface-500" />
        )}
      </div>
      <div className="flex-1">
        <Text as="h4" className="font-medium text-surface-900">Product #{productId || 'Unknown'}</Text>
        <Text className="text-surface-600">Quantity: {quantity}</Text>
      </div>
      <div className="text-right">
        <Text className="font-medium text-surface-900">
          ${(price * quantity).toFixed(2)}
        </Text>
        <Text className="text-sm text-surface-600">
          ${price.toFixed(2)} each
        </Text>
      </div>
    </div>
  );
};

export default ProductThumbnail;