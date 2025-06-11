import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/services/cartService';
import { orderService } from '@/services/api/orderService';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/atoms/EmptyState';
import ShippingForm from '@/components/organisms/ShippingForm';
import PaymentForm from '@/components/organisms/PaymentForm';
import OrderReviewSection from '@/components/organisms/OrderReviewSection';
import OrderSummaryCard from '@/components/organisms/OrderSummaryCard';
import CheckoutProgress from '@/components/organisms/CheckoutProgress';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleShippingInfoChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    const missingFields = requiredFields.filter(field => !paymentInfo[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all payment information');
      return;
    }
    
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: getCartTotal() * 1.08, // Including tax
        shippingAddress: shippingInfo,
        paymentMethod: {
          type: 'credit_card',
          last4: paymentInfo.cardNumber.slice(-4)
        }
      };

      const order = await orderService.create(orderData);
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart before proceeding to checkout"
          actionLabel="Continue Shopping"
          onAction={() => navigate('/shop')}
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Text as="h1" className="text-3xl font-heading font-bold text-surface-900 mb-4">
          Checkout
        </Text>
        
        {/* Progress Steps */}
        <CheckoutProgress currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <ShippingForm
              shippingInfo={shippingInfo}
              onShippingInfoChange={handleShippingInfoChange}
              onSubmit={handleShippingSubmit}
            />
          )}

          {currentStep === 2 && (
            <PaymentForm
              paymentInfo={paymentInfo}
              onPaymentInfoChange={handlePaymentInfoChange}
              onSubmit={handlePaymentSubmit}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <OrderReviewSection
              cart={cart}
              shippingInfo={shippingInfo}
              paymentInfo={paymentInfo}
              onBackToPayment={() => setCurrentStep(2)}
              onPlaceOrder={handlePlaceOrder}
              processing={processing}
            />
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;