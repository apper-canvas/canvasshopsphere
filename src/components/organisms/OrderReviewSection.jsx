import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import Button from '@/components/atoms/Button';

const OrderReviewSection = ({
  cart,
  shippingInfo,
  paymentInfo,
  onBackToPayment,
  onPlaceOrder,
  processing,
  formatPrice
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Text as="h2" className="text-xl font-heading font-semibold text-surface-900">
            Review Order
          </Text>
          <Button
            onClick={onBackToPayment}
            className="text-primary hover:text-primary/80 font-medium"
          >
            ← Back to Payment
          </Button>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <Text as="h3" className="font-semibold text-surface-900 mb-3">Shipping Address</Text>
          <div className="text-surface-700">
            <Text>{shippingInfo.firstName} {shippingInfo.lastName}</Text>
            <Text>{shippingInfo.address}</Text>
            <Text>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</Text>
            <Text>{shippingInfo.email}</Text>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <Text as="h3" className="font-semibold text-surface-900 mb-3">Payment Method</Text>
          <div className="text-surface-700">
            <Text>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</Text>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200 p-6">
        <Text as="h3" className="font-semibold text-surface-900 mb-4">Order Items</Text>
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Text as="h4" className="font-medium text-surface-900">{item.product.name}</Text>
                <Text className="text-surface-600">Qty: {item.quantity}</Text>
              </div>
              <div className="text-right">
                <PriceDisplay price={item.product.price * item.quantity} className="font-medium text-surface-900" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPlaceOrder}
        disabled={processing}
        className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        icon={ApperIcon}
        iconSize={20}
        name={processing ? "Loader2" : "CreditCard"}
        classNameOverride={processing ? "animate-spin" : ""}
      >
        {processing ? (
          <span>Processing Order...</span>
        ) : (
          <span>Place Order</span>
        )}
      </Button>
    </motion.div>
  );
};

export default OrderReviewSection;