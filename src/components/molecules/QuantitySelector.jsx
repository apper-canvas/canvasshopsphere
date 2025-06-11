import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, isLoading }) => {
  return (
    <div className="flex items-center border border-surface-300 rounded-lg">
      <Button
        onClick={onDecrease}
        disabled={isLoading || quantity <= 1}
        className="p-2 hover:bg-surface-100 transition-colors disabled:opacity-50"
        icon={ApperIcon}
        iconSize={16}
        name="Minus"
      />
      <Text as="span" className="px-4 py-2 font-medium min-w-[3rem] text-center">
        {isLoading ? (
          <ApperIcon name="Loader2" size={16} className="animate-spin mx-auto" />
        ) : (
          quantity
        )}
      </Text>
      <Button
        onClick={onIncrease}
        disabled={isLoading}
        className="p-2 hover:bg-surface-100 transition-colors disabled:opacity-50"
        icon={ApperIcon}
        iconSize={16}
        name="Plus"
      />
    </div>
  );
};

export default QuantitySelector;