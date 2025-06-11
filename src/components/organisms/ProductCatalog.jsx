import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import productService from '@/services/productService';
import { Loader2, AlertCircle, ShoppingCart } from 'lucide-react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sort: ''
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

// Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Search and filter products when dependencies change (skip during initial load)
  useEffect(() => {
    if (categories.length > 0) { // Only search after initial data is loaded
      searchProducts();
    }
  }, [searchQuery, filters, categories.length]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories first
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData || []);
      
      // Load initial products directly without calling searchProducts()
      const initialResult = await productService.searchProducts('', {
        category: '',
        sortBy: '',
        page: 1,
        limit: 12
      });
      
      setProducts(initialResult?.products || []);
      setPagination({
        page: initialResult?.page || 1,
        total: initialResult?.total || 0,
        totalPages: initialResult?.totalPages || 0,
        hasNextPage: initialResult?.hasNextPage || false,
        hasPrevPage: initialResult?.hasPrevPage || false
      });
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load product data. Please refresh the page.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const searchOptions = {
        category: filters.category,
        sortBy: filters.sort,
        page,
        limit: 12
      };

      const result = await productService.searchProducts(searchQuery, searchOptions);
      
      setProducts(result?.products || []);
      setPagination({
        page: result?.page || 1,
        total: result?.total || 0,
        totalPages: result?.totalPages || 0,
        hasNextPage: result?.hasNextPage || false,
        hasPrevPage: result?.hasPrevPage || false
      });

    } catch (err) {
      console.error('Search error:', err);
      setError(err?.message || 'Failed to search products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters || {});
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      searchProducts(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ProductCard = ({ product }) => {
    if (!product) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300
                 border border-gray-200 overflow-hidden group"
      >
        <div className="relative overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={product.name || 'Product'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 
                          rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.name || 'Unnamed Product'}
            </h3>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                ${product.price?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {product.brand || 'Unknown Brand'}
          </p>
          
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {product.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-500 capitalize">
                {product.category || 'Uncategorized'}
              </span>
            </div>
            
            <button
              className="bg-primary text-white px-4 py-2 rounded-md text-sm
                       hover:bg-primary/90 transition-colors duration-200
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       flex items-center space-x-1"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{product.inStock ? 'Add to Cart' : 'Unavailable'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm border rounded-md ${
              page === pagination.page
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          categories={categories}
          sortOptions={sortOptions}
          placeholder="Search for products..."
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {searchQuery ? (
              <>Showing {pagination.total} results for "<strong>{searchQuery}</strong>"</>
            ) : (
              <>Showing {pagination.total} products</>
            )}
            {filters.category && (
              <> in <strong>{categories.find(c => c.value === filters.category)?.label || filters.category}</strong></>
            )}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => searchProducts()}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product?.id || Math.random()} product={product} />
            ))}
          </div>
          <Pagination />
        </>
      )}

      {/* No Results */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found</p>
          {searchQuery && (
            <p className="text-gray-400 text-sm">
              Try adjusting your search terms or filters
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;