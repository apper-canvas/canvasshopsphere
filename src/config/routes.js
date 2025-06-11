import Home from '../pages/Home';
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderConfirmation from '../pages/OrderConfirmation';
import Orders from '../pages/Orders';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  shop: {
    id: 'shop',
    label: 'Shop',
    path: '/shop',
    icon: 'Store',
    component: Shop
  },
  product: {
    id: 'product',
    label: 'Product',
    path: '/product/:id',
    icon: 'Package',
    component: ProductDetail
  },
  cart: {
    id: 'cart',
    label: 'Cart',
    path: '/cart',
    icon: 'ShoppingCart',
    component: Cart
  },
  checkout: {
    id: 'checkout',
    label: 'Checkout',
    path: '/checkout',
    icon: 'CreditCard',
    component: Checkout
  },
  orderConfirmation: {
    id: 'orderConfirmation',
    label: 'Order Confirmation',
    path: '/order-confirmation/:orderId',
    icon: 'CheckCircle',
    component: OrderConfirmation
  },
  orders: {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    icon: 'Package',
    component: Orders
  }
};

export const routeArray = Object.values(routes);