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
          try {
            const product = await productService.getById(item.productId);
            return product ? {
              product,
              quantity: item.quantity
            } : null;
          } catch (error) {
            console.warn(`Failed to load product ${item.productId}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null products and log if any products were removed
      const validCartItems = cartWithProducts.filter(item => item !== null);
      const removedItemsCount = cartWithProducts.length - validCartItems.length;
      
      if (removedItemsCount > 0) {
        console.info(`Removed ${removedItemsCount} unavailable product(s) from cart`);
      }
      
      setCart(validCartItems);
    } catch (error) {
      console.error('Error loading cart products:', error);
      // Set empty cart on complete failure to prevent app crash
      setCart([]);
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
        throw new Error('This product is no longer available');
      }

      // Check stock availability - only if stock property exists and is a number
      // If no stock property exists, assume product is available
      const hasStockInfo = typeof product.stock === 'number';
      const isOutOfStock = hasStockInfo && product.stock <= 0;
      
      if (isOutOfStock) {
        throw new Error('This product is currently out of stock');
      }

      return new Promise((resolve, reject) => {
        setCart(prevCart => {
          try {
            const existingItem = prevCart.find(item => item.product.id === productId);
            
            let newQuantity = quantity;
            if (existingItem) {
              newQuantity = existingItem.quantity + quantity;
            }

            // Check if new quantity exceeds available stock
            if (hasStockInfo && newQuantity > product.stock) {
              reject(new Error(`Only ${product.stock} items available in stock`));
              return prevCart;
            }
            
            let newCart;
            if (existingItem) {
              // Update quantity if item already exists
              newCart = prevCart.map(item =>
                item.product.id === productId
                  ? { ...item, quantity: newQuantity }
                  : item
              );
            } else {
              // Add new item
              newCart = [...prevCart, { product, quantity: newQuantity }];
            }
            
            saveCart(newCart);
            resolve(newCart);
            return newCart;
          } catch (error) {
            reject(error);
            return prevCart;
          }
        });
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

// Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }

    try {
      // Verify product still exists and check stock if applicable
      const product = await productService.getById(productId);
      if (!product) {
        throw new Error('This product is no longer available');
      }

      const hasStockInfo = typeof product.stock === 'number';
      if (hasStockInfo && newQuantity > product.stock) {
        throw new Error(`Only ${product.stock} items available in stock`);
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
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
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