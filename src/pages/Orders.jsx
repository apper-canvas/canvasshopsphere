import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { orderService } from '../services/api/orderService';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getAll();
      setOrders(result);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
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
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success';
      case 'processing':
        return 'bg-warning/10 text-warning';
      case 'shipped':
        return 'bg-info/10 text-info';
      case 'delivered':
        return 'bg-primary/10 text-primary';
      case 'cancelled':
        return 'bg-error/10 text-error';
      default:
        return 'bg-surface-100 text-surface-600';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-1/4"></div>
        </div>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState 
          message={error}
          onRetry={loadOrders}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-surface-900">
          Your Orders
        </h1>
        <p className="text-surface-600 mt-2">
          Track and manage your order history
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your orders here."
          actionLabel="Start Shopping"
          onAction={() => window.location.href = '/shop'}
          icon="Package"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-surface-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-surface-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        order.status === 'confirmed' 
                          ? 'bg-success'
                          : order.status === 'processing'
                          ? 'bg-warning'
                          : order.status === 'shipped'
                          ? 'bg-info'
                          : order.status === 'delivered'
                          ? 'bg-primary'
                          : order.status === 'cancelled'
                          ? 'bg-error'
                          : 'bg-surface-400'
                      }`} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Order Items Summary */}
                <div className="mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="w-12 h-12 bg-surface-100 rounded-lg border-2 border-white flex items-center justify-center"
                        >
                          <ApperIcon name="Package" size={16} className="text-surface-500" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 bg-surface-200 rounded-lg border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium text-surface-600">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-surface-900">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-sm text-surface-600">
                        Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} products
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Eye" size={16} />
                    <span>View Details</span>
                  </Link>
                  
                  {order.status === 'shipped' && (
                    <button className="flex-1 bg-surface-100 text-surface-900 py-2 px-4 rounded-lg font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2">
                      <ApperIcon name="Truck" size={16} />
                      <span>Track Package</span>
                    </button>
                  )}
                  
                  {(order.status === 'delivered' || order.status === 'confirmed') && (
                    <button className="flex-1 bg-surface-100 text-surface-900 py-2 px-4 rounded-lg font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2">
                      <ApperIcon name="RotateCcw" size={16} />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable Order Details */}
              <div className="border-t border-surface-200 bg-surface-50/50 rounded-b-xl">
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-surface-900">Order Total</span>
                      <p className="text-surface-600">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-surface-900">Payment Method</span>
                      <p className="text-surface-600">
                        {order.paymentMethod?.type === 'credit_card' 
                          ? `Card ending in ${order.paymentMethod.last4}`
                          : 'Payment method'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-surface-900">Delivery</span>
                      <p className="text-surface-600">
                        {order.shippingAddress ? 
                          `${order.shippingAddress.city}, ${order.shippingAddress.state}` :
                          'Standard shipping'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;