import HomePage from '@/components/pages/HomePage';
import ShopPage from '@/components/pages/ShopPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import CartPage from '@/components/pages/CartPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrderConfirmationPage from '@/components/pages/OrderConfirmationPage';
import OrdersPage from '@/components/pages/OrdersPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  },
  shop: {
    id: 'shop',
    label: 'Shop',
    path: '/shop',
    icon: 'Store',
component: ShopPage
  },
  product: {
    id: 'product',
    label: 'Product',
    path: '/product/:id',
    icon: 'Package',
component: ProductDetailPage
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
component: CartPage
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
component: CheckoutPage
  },
  orderConfirmation: {
    id: 'orderConfirmation',
    label: 'Order Confirmation',
    path: '/order-confirmation/:orderId',
    icon: 'CheckCircle',
component: OrderConfirmationPage
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package',
component: OrdersPage
  }
};

export const routeArray = Object.values(routes);