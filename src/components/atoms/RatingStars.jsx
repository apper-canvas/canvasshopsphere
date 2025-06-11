import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const RatingStars = ({ rating, size = 16, reviewCount, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <ApperIcon
          key={i}
          name="Star"
          size={size}
          className={
            i < Math.floor(rating)
              ? 'text-accent fill-current'
              : 'text-surface-300'
          }
        />
      ))}
      {reviewCount !== undefined && (
        <span className="text-sm text-surface-600 ml-1">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;