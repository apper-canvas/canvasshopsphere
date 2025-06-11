import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  categories = [], 
  sortOptions = [],
  placeholder = "Search products...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (onSearch) {
        setIsLoading(true);
        onSearch(term).finally(() => setIsLoading(false));
      }
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (onFilter) {
      onFilter({
        category: selectedCategory,
        sort: selectedSort
      });
    }
  }, [selectedCategory, selectedSort, onFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 text-gray-400 ${isLoading ? 'animate-pulse' : ''}`} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-primary focus:border-primary
                     placeholder-gray-500 text-gray-900 bg-white
                     transition-all duration-200 ease-in-out
                     hover:border-gray-400"
            aria-label="Search products"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center
                       text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-3 px-4 py-3 border border-gray-300 rounded-lg
                   bg-white hover:bg-gray-50 transition-colors
                   focus:ring-2 focus:ring-primary focus:border-primary"
          aria-label="Toggle filters"
        >
          <Filter className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm
                      animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            {categories?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md
                             focus:ring-2 focus:ring-primary focus:border-primary
                             bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category?.value || category} value={category?.value || category}>
                        {category?.label || category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                       h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Sort Filter */}
            {sortOptions?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md
                             focus:ring-2 focus:ring-primary focus:border-primary
                             bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="">Default</option>
                    {sortOptions.map((option) => (
                      <option key={option?.value || option} value={option?.value || option}>
                        {option?.label || option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                       h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedSort) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs
                                 bg-primary/10 text-primary border border-primary/20">
                    Category: {categories.find(c => (c?.value || c) === selectedCategory)?.label || selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-2 text-primary hover:text-primary/80"
                      aria-label="Remove category filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedSort && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs
                                 bg-secondary/10 text-secondary border border-secondary/20">
                    Sort: {sortOptions.find(s => (s?.value || s) === selectedSort)?.label || selectedSort}
                    <button
                      onClick={() => setSelectedSort('')}
                      className="ml-2 text-secondary hover:text-secondary/80"
                      aria-label="Remove sort filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchBar;