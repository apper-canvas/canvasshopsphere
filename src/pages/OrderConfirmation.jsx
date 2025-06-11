import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { orderService } from '../services/api/orderService';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getById(orderId);
      if (!result) {
        setError('Order not found');
        return;
      }
      setOrder(result);
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error || 'Order not found'}
          onRetry={loadOrder}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="CheckCircle" size={40} className="text-success" />
        </motion.div>
        
        <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-lg text-surface-600">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </motion.div>

      <div className="bg-white rounded-xl border border-surface-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-surface-900">
              Order #{order.id}
            </h2>
            <p className="text-surface-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'confirmed' 
                ? 'bg-success/10 text-success'
                : order.status === 'processing'
                ? 'bg-warning/10 text-warning'
                : 'bg-surface-100 text-surface-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                order.status === 'confirmed' 
                  ? 'bg-success'
                  : order.status === 'processing'
                  ? 'bg-warning'
                  : 'bg-surface-400'
              }`} />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-surface-900">Order Items</h3>
          {order.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-surface-50 rounded-lg"
            >
              <div className="w-16 h-16 bg-surface-200 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" size={24} className="text-surface-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-surface-900">Product #{item.productId}</h4>
                <p className="text-surface-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-surface-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <p className="text-sm text-surface-600">
                  {formatPrice(item.price)} each
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t border-surface-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-surface-900">Order Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="border-t border-surface-200 pt-6">
            <h3 className="font-semibold text-surface-900 mb-3">Shipping Address</h3>
            <div className="text-surface-700">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-primary/5 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Info" size={20} className="text-primary mr-2" />
          What happens next?
        </h3>
        <div className="space-y-3 text-surface-700">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">1</span>
            </div>
            <p>We'll send you an order confirmation email with your receipt</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">2</span>
            </div>
            <p>Your order will be processed and prepared for shipment</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">3</span>
            </div>
            <p>You'll receive tracking information once your order ships</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/orders"
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center flex items-center justify-center space-x-2"
        >
          <ApperIcon name="Package" size={18} />
          <span>View All Orders</span>
        </Link>
        <Link
          to="/shop"
          className="bg-surface-100 text-surface-900 px-6 py-3 rounded-lg font-medium hover:bg-surface-200 transition-colors text-center flex items-center justify-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;