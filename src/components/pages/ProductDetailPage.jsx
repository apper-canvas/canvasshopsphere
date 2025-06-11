import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '@/services/api/productService';
import { reviewService } from '@/services/api/reviewService';
import { useCart } from '@/services/cartService';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import ProductImageGallery from '@/components/organisms/ProductImageGallery';
import ProductDetailInfo from '@/components/organisms/ProductDetailInfo';
import ReviewList from '@/components/organisms/ReviewList';


const ProductDetailPage = () => {
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
    // Check stock availability
    if (product.stock !== undefined && product.stock < quantity) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    if (product.stock !== undefined && product.stock <= 0) {
      toast.error('This item is currently out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
    } catch (error) {
      if (error.message === 'Product not found') {
        toast.error('This product is no longer available');
      } else if (error.message === 'Insufficient stock') {
        toast.error('Sorry, insufficient stock available');
      } else {
        toast.error('Failed to add item to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
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
      <Breadcrumb items={[
        { label: 'Shop', path: '/shop' },
        { label: product.name }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <ProductImageGallery 
          images={product.images} 
          selectedImageIndex={selectedImage} 
          onSelectImage={setSelectedImage} 
        />

        {/* Product Info */}
        <ProductDetailInfo
          product={product}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
        />
      </div>

      {/* Reviews Section */}
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ProductDetailPage;