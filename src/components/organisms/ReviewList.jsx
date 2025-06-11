import React from 'react';
import { motion } from 'framer-motion';
import RatingStars from '@/components/atoms/RatingStars';
import Text from '@/components/atoms/Text';

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <div className="mt-16 border-t border-surface-200 pt-16">
      <Text as="h2" className="text-2xl font-heading font-bold text-surface-900 mb-8">
        Customer Reviews
      </Text>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-surface-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Text as="span" className="font-semibold text-surface-900">
                    {review.author}
                  </Text>
                  <RatingStars rating={review.rating} size={16} />
                </div>
                <Text as="span" className="text-sm text-surface-600">{review.date}</Text>
              </div>
            </div>
            
            {review.title && (
              <Text as="h4" className="font-semibold text-surface-900 mb-2">
                {review.title}
              </Text>
            )}
            
            <Text as="p" className="text-surface-700 leading-relaxed">
              {review.text}
            </Text>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;