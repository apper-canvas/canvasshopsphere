import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { productService } from '../services/api/productService';
import { reviewService } from '../services/api/reviewService';
import { useCart } from '../services/cartService';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getById(id);
      if (!result) {
        setError('Product not found');
        return;
      }
      setProduct(result);
    } catch (err) {
      setError(err.message || 'Failed to load product');
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const result = await reviewService.getByProductId(id);
      setReviews(result);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center space-x-1">
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
      </div>
    );
  };

  if (loading) {
    return <SkeletonLoader type="product-detail" />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error || 'Product not found'}
          onRetry={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-surface-600 mb-8">
        <button onClick={() => navigate('/shop')} className="hover:text-primary">
          Shop
        </button>
        <ApperIcon name="ChevronRight" size={16} />
        <span className="text-surface-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-surface-100 rounded-xl overflow-hidden"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-primary'
                    : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-surface-600 mb-4">{product.brand}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                {renderStars(product.rating, 18)}
                <span className="text-lg font-medium text-surface-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-surface-600">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-surface-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && (
              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <p className="text-surface-700 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-surface-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Minus" size={16} />
              </button>
              <span className="px-4 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {addingToCart ? (
                <ApperIcon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <ApperIcon name="ShoppingCart" size={20} />
              )}
              <span>Add to Cart</span>
            </motion.button>
          </div>

          {/* Product Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="border-t border-surface-200 pt-6">
              <h3 className="font-semibold text-surface-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-surface-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="font-medium text-surface-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-16 border-t border-surface-200 pt-16">
          <h2 className="text-2xl font-heading font-bold text-surface-900 mb-8">
            Customer Reviews
          </h2>
          
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
                      <span className="font-semibold text-surface-900">
                        {review.author}
                      </span>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-surface-600">{review.date}</span>
                  </div>
                </div>
                
                {review.title && (
                  <h4 className="font-semibold text-surface-900 mb-2">
                    {review.title}
                  </h4>
                )}
                
                <p className="text-surface-700 leading-relaxed">
                  {review.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;