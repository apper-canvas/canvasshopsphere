import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import OrderStatusBadge from '@/components/molecules/OrderStatusBadge';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ProductThumbnail from '@/components/molecules/ProductThumbnail';

const OrderDetailsSection = ({ order, formatPrice, formatDate }) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-surface-200 hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-1">
              Order #{order.id}
            </Text>
            <Text className="text-surface-600">
              Placed on {formatDate(order.createdAt)}
            </Text>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <OrderStatusBadge status={order.status} />
            <PriceDisplay price={order.total} className="text-lg font-bold text-primary" />
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
                  <Text as="span" className="text-xs font-medium text-surface-600">
                    +{order.items.length - 3}
                  </Text>
                </div>
              )}
            </div>
            <div>
              <Text className="font-medium text-surface-900">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </Text>
              <Text className="text-sm text-surface-600">
                Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} products
              </Text>
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
            <Button className="flex-1 bg-surface-100 text-surface-900 py-2 px-4 rounded-lg font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2"
              icon={ApperIcon} iconSize={16} name="Truck"
            >
              <span>Track Package</span>
            </Button>
          )}
          
          {(order.status === 'delivered' || order.status === 'confirmed') && (
            <Button className="flex-1 bg-surface-100 text-surface-900 py-2 px-4 rounded-lg font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2"
              icon={ApperIcon} iconSize={16} name="RotateCcw"
            >
              <span>Reorder</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Order Details */}
      <div className="border-t border-surface-200 bg-surface-50/50 rounded-b-xl">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <Text as="span" className="font-medium text-surface-900">Order Total</Text>
              <PriceDisplay price={order.total} className="text-surface-600" />
            </div>
            <div>
              <Text as="span" className="font-medium text-surface-900">Payment Method</Text>
              <Text className="text-surface-600">
                {order.paymentMethod?.type === 'credit_card' 
                  ? `Card ending in ${order.paymentMethod.last4}`
                  : 'Payment method'
                }
              </Text>
            </div>
            <div>
              <Text as="span" className="font-medium text-surface-900">Delivery</Text>
              <Text className="text-surface-600">
                {order.shippingAddress ? 
                  `${order.shippingAddress.city}, ${order.shippingAddress.state}` :
                  'Standard shipping'
                }
              </Text>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailsSection;