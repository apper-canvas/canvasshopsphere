import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { orderService } from '@/services/api/orderService';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import EmptyState from '@/components/atoms/EmptyState';
import ErrorState from '@/components/atoms/ErrorState';
import OrderDetailsSection from '@/components/organisms/OrderDetailsSection';
import Text from '@/components/atoms/Text';

const OrdersPage = () => {
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
        <Text as="h1" className="text-3xl font-heading font-bold text-surface-900">
          Your Orders
        </Text>
        <Text className="text-surface-600 mt-2">
          Track and manage your order history
        </Text>
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
            <OrderDetailsSection key={order.id} order={order} formatPrice={formatPrice} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;