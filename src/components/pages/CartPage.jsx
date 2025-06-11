import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/services/cartService';
import EmptyState from '@/components/atoms/EmptyState';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/molecules/CartItem';
import OrderSummaryCard from '@/components/organisms/OrderSummaryCard';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalItems } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    try {
      await removeFromCart(productId);
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart to get started with your order"
          actionLabel="Continue Shopping"
          onAction={() => navigate('/shop')}
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-surface-900">
          Shopping Cart
        </Text>
        <Text className="text-surface-600 mt-2">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                isUpdating={updatingItems.has(item.product.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummaryCard />
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 mt-4"
            icon={ApperIcon}
            iconSize={20}
            name="CreditCard"
          >
            <span>Proceed to Checkout</span>
          </Button>

          <Link
            to="/shop"
            className="block text-center text-primary hover:text-primary/80 font-medium mt-4"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;