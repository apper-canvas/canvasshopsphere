import React from 'react';
import Text from '@/components/atoms/Text';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'confirmed':
        return 'bg-success/10 text-success bg-success';
      case 'processing':
        return 'bg-warning/10 text-warning bg-warning';
      case 'shipped':
        return 'bg-info/10 text-info bg-info';
      case 'delivered':
        return 'bg-primary/10 text-primary bg-primary';
      case 'cancelled':
        return 'bg-error/10 text-error bg-error';
      default:
        return 'bg-surface-100 text-surface-600 bg-surface-400';
    }
  };

  const [bgColor, textColor, dotColor] = getStatusColor(status).split(' ');
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Text as="span" className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${dotColor}`} />
      {displayStatus}
    </Text>
  );
};

export default OrderStatusBadge;