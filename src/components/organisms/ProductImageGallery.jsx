import React from 'react';
import { motion } from 'framer-motion';

const ProductImageGallery = ({ images, selectedImageIndex, onSelectImage }) => {
  return (
    <div className="space-y-4">
      <motion.div
        key={selectedImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="aspect-square bg-surface-100 rounded-xl overflow-hidden"
      >
        <img
          src={images[selectedImageIndex]}
          alt={`Product image ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onSelectImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImageIndex === index
                ? 'border-primary'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;