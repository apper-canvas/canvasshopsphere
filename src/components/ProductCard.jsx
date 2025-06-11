import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { useCart } from '../services/cartService';

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <ApperIcon
            key={i}
            name="Star"
            size={14}
            className={
              i < Math.floor(rating)
                ? 'text-accent fill-current'
                : 'text-surface-300'
            }
          />
        ))}
        <span className="text-sm text-surface-600 ml-1">
          ({product.reviewCount})
        </span>
      </div>
    );
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
                <h3 className="text-lg font-semibold text-surface-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-surface-600 mt-1">
                  {product.brand}
                </p>
                <div className="mt-2">
                  {renderStars(product.rating)}
                </div>
                <p className="text-surface-700 mt-2 line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end ml-4">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="mt-3 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  ) : (
                    <ApperIcon name="ShoppingCart" size={16} />
                  )}
                  <span>Add to Cart</span>
                </motion.button>
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
            <h3 className="text-lg font-semibold text-surface-900 truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-surface-600">
              {product.brand}
            </p>
          </div>
          
          <div className="mb-3">
            {renderStars(product.rating)}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-surface-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isLoading}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <ApperIcon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <ApperIcon name="ShoppingCart" size={20} />
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;