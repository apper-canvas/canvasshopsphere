// Mock data for development - replace with actual API calls
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    category: "electronics",
    brand: "TechSound",
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.5,
    inStock: true,
    tags: ["wireless", "bluetooth", "noise-cancelling"]
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    category: "clothing",
    brand: "EcoWear",
    description: "Comfortable organic cotton t-shirt in various colors",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    rating: 4.2,
    inStock: true,
    tags: ["organic", "cotton", "sustainable"]
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 199.99,
    category: "electronics",
    brand: "FitTech",
    description: "Advanced fitness tracking with heart rate monitor",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.7,
    inStock: false,
    tags: ["fitness", "smartwatch", "health"]
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug",
    price: 12.99,
    category: "home",
    brand: "HomeEssentials",
    description: "Handcrafted ceramic mug perfect for your morning coffee",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
    rating: 4.0,
    inStock: true,
    tags: ["ceramic", "handmade", "coffee"]
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 89.99,
    category: "sports",
    brand: "RunFast",
    description: "Lightweight running shoes with excellent cushioning",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    rating: 4.3,
    inStock: true,
    tags: ["running", "lightweight", "cushioned"]
  }
];

// Cache for storing search results
let searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ProductService {
  constructor() {
    this.products = mockProducts;
    this.searchHistory = [];
  }

  // Main search function with comprehensive filtering
  async searchProducts(query = '', options = {}) {
    try {
      const {
        category = '',
        sortBy = '',
        minPrice = 0,
        maxPrice = Infinity,
        inStockOnly = false,
        page = 1,
        limit = 20
      } = options;

      // Create cache key
      const cacheKey = JSON.stringify({ query, ...options });
      const cached = searchCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      // Add artificial delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      let filteredProducts = [...this.products];

      // Text search
      if (query?.trim()) {
        const searchTerm = query.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product =>
          product?.name?.toLowerCase().includes(searchTerm) ||
          product?.description?.toLowerCase().includes(searchTerm) ||
          product?.brand?.toLowerCase().includes(searchTerm) ||
          product?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm))
        );

        // Add to search history
        this.addToSearchHistory(query);
      }

      // Category filter
      if (category) {
        filteredProducts = filteredProducts.filter(product => 
          product?.category?.toLowerCase() === category.toLowerCase()
        );
      }

      // Price range filter
      filteredProducts = filteredProducts.filter(product => {
        const price = product?.price || 0;
        return price >= minPrice && price <= maxPrice;
      });

      // Stock filter
      if (inStockOnly) {
        filteredProducts = filteredProducts.filter(product => product?.inStock);
      }

      // Sorting
      if (sortBy) {
        filteredProducts = this.sortProducts(filteredProducts, sortBy);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      const result = {
        products: paginatedProducts,
        total: filteredProducts.length,
        page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1
      };

      // Cache the result
      searchCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search products. Please try again.');
    }
  }

  // Sort products by various criteria
  sortProducts(products, sortBy) {
    const sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => (a?.price || 0) - (b?.price || 0));
      case 'price-high':
        return sortedProducts.sort((a, b) => (b?.price || 0) - (a?.price || 0));
      case 'name-asc':
        return sortedProducts.sort((a, b) => 
          (a?.name || '').localeCompare(b?.name || '')
        );
      case 'name-desc':
        return sortedProducts.sort((a, b) => 
          (b?.name || '').localeCompare(a?.name || '')
        );
      case 'rating':
        return sortedProducts.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
      case 'newest':
        return sortedProducts.sort((a, b) => (b?.id || 0) - (a?.id || 0));
      default:
        return sortedProducts;
    }
  }

  // Get all available categories
  async getCategories() {
    try {
      const categories = [...new Set(this.products.map(p => p?.category).filter(Boolean))];
      return categories.map(category => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1)
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get all available brands
  async getBrands() {
    try {
      const brands = [...new Set(this.products.map(p => p?.brand).filter(Boolean))];
      return brands.map(brand => ({
        value: brand,
        label: brand
      }));
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  // Get price range
  async getPriceRange() {
    try {
      const prices = this.products.map(p => p?.price || 0).filter(Boolean);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    } catch (error) {
      console.error('Error fetching price range:', error);
      return { min: 0, max: 1000 };
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query) {
    try {
      if (!query?.trim()) return [];

      const searchTerm = query.toLowerCase().trim();
      const suggestions = [];

      // Product name suggestions
      this.products.forEach(product => {
        if (product?.name?.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            type: 'product',
            text: product.name,
            category: product.category
          });
        }
      });

      // Brand suggestions
      const brands = [...new Set(this.products.map(p => p?.brand))];
      brands.forEach(brand => {
        if (brand?.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            type: 'brand',
            text: brand,
            category: 'brand'
          });
        }
      });

      // Category suggestions
      const categories = [...new Set(this.products.map(p => p?.category))];
      categories.forEach(category => {
        if (category?.toLowerCase().includes(searchTerm)) {
          suggestions.push({
            type: 'category',
            text: category,
            category: 'category'
          });
        }
      });

      return suggestions.slice(0, 8); // Limit suggestions
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  // Add to search history
  addToSearchHistory(query) {
    if (!query?.trim()) return;

    const normalizedQuery = query.trim();
    
    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== normalizedQuery);
    
    // Add to beginning
    this.searchHistory.unshift(normalizedQuery);
    
    // Keep only last 10 searches
    this.searchHistory = this.searchHistory.slice(0, 10);
  }

  // Get search history
  getSearchHistory() {
    return [...this.searchHistory];
  }

  // Clear search history
  clearSearchHistory() {
    this.searchHistory = [];
  }

  // Clear search cache
  clearCache() {
    searchCache.clear();
  }

  // Get product by ID
  async getProduct(id) {
    try {
      const product = this.products.find(p => p?.id === parseInt(id));
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get popular searches (mock implementation)
  async getPopularSearches() {
    try {
      return [
        'wireless headphones',
        'organic cotton',
        'fitness watch',
        'running shoes',
        'coffee mug'
      ];
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      return [];
    }
  }
}

// Create singleton instance
const productService = new ProductService();

// Export default service and named exports for specific functions
export default productService;

export const {
  searchProducts,
  getCategories,
  getBrands,
  getPriceRange,
  getSearchSuggestions,
  getSearchHistory,
  clearSearchHistory,
  clearCache,
  getProduct,
  getPopularSearches
} = productService;