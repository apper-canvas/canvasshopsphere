import React from 'react';
import Text from '@/components/atoms/Text';

const PriceDisplay = ({ price, className }) => {
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Text as="span" className={className}>
      {formatPrice(price)}
    </Text>
  );
};

export default PriceDisplay;