import { useState, useEffect } from 'react';
import { productService } from './api/productService';

// Custom hook for cart management
export const useCart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopsphere_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        loadCartProducts(cartData);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Load full product details for cart items
  const loadCartProducts = async (cartData) => {
    try {
      const cartWithProducts = await Promise.all(
        cartData.map(async (item) => {
          const product = await productService.getById(item.productId);
          return {
            product,
            quantity: item.quantity
          };
        })
      );
      setCart(cartWithProducts.filter(item => item.product)); // Filter out null products
    } catch (error) {
      console.error('Error loading cart products:', error);
    }
  };

  // Save cart to localStorage
  const saveCart = (cartData) => {
    const cartToSave = cartData.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    localStorage.setItem('shopsphere_cart', JSON.stringify(cartToSave));
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const product = await productService.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === productId);
        
        let newCart;
        if (existingItem) {
          // Update quantity if item already exists
          newCart = prevCart.map(item =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          newCart = [...prevCart, { product, quantity }];
        }
        
        saveCart(newCart);
        return newCart;
      });
    } catch (error) {
      throw error;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCart(newCart);
      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.product.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  };

  // Clear entire cart
  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem('shopsphere_cart');
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems
  };
};