import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { useCart } from '../services/cartService';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getTotalItems } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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
        <h1 className="text-3xl font-heading font-bold text-surface-900">
          Shopping Cart
        </h1>
        <p className="text-surface-600 mt-2">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl border border-surface-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="block font-semibold text-surface-900 hover:text-primary transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-surface-600 text-sm mt-1">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-surface-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.product.id) || item.quantity <= 1}
                        className="p-2 hover:bg-surface-100 transition-colors disabled:opacity-50"
                      >
                        <ApperIcon name="Minus" size={16} />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {updatingItems.has(item.product.id) ? (
                          <ApperIcon name="Loader2" size={16} className="animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.product.id)}
                        className="p-2 hover:bg-surface-100 transition-colors disabled:opacity-50"
                      >
                        <ApperIcon name="Plus" size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                      className="p-2 text-surface-500 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-200">
                  <span className="text-surface-600">Subtotal</span>
                  <span className="text-lg font-semibold text-surface-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-surface-200 p-6 sticky top-24">
            <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-surface-600">Subtotal</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Shipping</span>
                <span className="font-medium text-success">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600">Tax</span>
                <span className="font-medium">{formatPrice(getCartTotal() * 0.08)}</span>
              </div>
              <div className="border-t border-surface-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-surface-900">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(getCartTotal() * 1.08)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <ApperIcon name="CreditCard" size={20} />
              <span>Proceed to Checkout</span>
            </motion.button>

            <Link
              to="/shop"
              className="block text-center text-primary hover:text-primary/80 font-medium mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;