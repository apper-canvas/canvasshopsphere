import React from 'react';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import Text from '@/components/atoms/Text';
import { useCart } from '@/services/cartService';

const OrderSummaryCard = () => {
  const { cart, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-xl border border-surface-200 p-6 sticky top-24">
      <Text as="h2" className="text-xl font-heading font-semibold text-surface-900 mb-6">
        Order Summary
      </Text>

      {cart.length > 0 && (
        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <Text className="text-surface-700">
                {item.product.name} × {item.quantity}
              </Text>
              <PriceDisplay price={item.product.price * item.quantity} className="font-medium" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 border-t border-surface-200 pt-4">
        <div className="flex justify-between">
          <Text className="text-surface-600">Subtotal</Text>
          <PriceDisplay price={subtotal} className="font-medium" />
        </div>
        <div className="flex justify-between">
          <Text className="text-surface-600">Shipping</Text>
          <Text className="font-medium text-success">Free</Text>
        </div>
        <div className="flex justify-between">
          <Text className="text-surface-600">Tax</Text>
          <PriceDisplay price={tax} className="font-medium" />
        </div>
        <div className="border-t border-surface-200 pt-2">
          <div className="flex justify-between">
            <Text as="span" className="text-lg font-semibold text-surface-900">Total</Text>
            <PriceDisplay price={total} className="text-lg font-bold text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;