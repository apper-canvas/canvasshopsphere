import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/services/cartService';
import Button from '@/components/atoms/Button';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import RatingStars from '@/components/atoms/RatingStars';
import Text from '@/components/atoms/Text';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200"
      >
        <Link to={`/product/${product.id}`} className="flex p-4 space-x-4">
          <div className="flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Text as="h3" className="text-lg font-semibold text-surface-900 truncate">
                  {product.name}
                </Text>
                <Text className="text-sm text-surface-600 mt-1">
                  {product.brand}
                </Text>
                <div className="mt-2">
                  <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={14} />
                </div>
                <Text className="text-surface-700 mt-2 line-clamp-2">
                  {product.description}
                </Text>
              </div>
              
              <div className="flex flex-col items-end ml-4">
                <PriceDisplay price={product.price} className="text-2xl font-bold text-primary" />
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="mt-3 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  icon={ApperIcon}
                  iconSize={16}
                  name={isLoading ? "Loader2" : "ShoppingCart"}
                  classNameOverride={isLoading ? "animate-spin" : ""}
                >
                  <span>Add to Cart</span>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 hover:shadow-lg transition-all duration-200 group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          {product.discount && (
            <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <Text as="h3" className="text-lg font-semibold text-surface-900 truncate group-hover:text-primary transition-colors">
              {product.name}
            </Text>
            <Text className="text-sm text-surface-600">
              {product.brand}
            </Text>
          </div>
          
          <div className="mb-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={14} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PriceDisplay price={product.price} className="text-xl font-bold text-primary" />
              {product.originalPrice && (
                <PriceDisplay price={product.originalPrice} className="text-sm text-surface-500 line-through" />
              )}
            </div>
            
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isLoading}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              icon={ApperIcon}
              iconSize={20}
              name={isLoading ? "Loader2" : "ShoppingCart"}
              classNameOverride={isLoading ? "animate-spin" : ""}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;