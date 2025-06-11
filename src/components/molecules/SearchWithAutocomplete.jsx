import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { productService } from '@/services/api/productService';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';

const SearchWithAutocomplete = ({ 
  placeholder = "Search products...", 
  className = "",
  onSearch,
  isMobile = false 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      // Debounce search suggestions
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async (searchQuery) => {
    setIsLoading(true);
    try {
      const results = await productService.searchSuggestions(searchQuery);
      setSuggestions(results);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    handleSearch(suggestion.name);
  };

  const handleSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/shop?search=${encodeURIComponent(trimmedQuery)}`);
      if (onSearch) {
        onSearch(trimmedQuery);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      selectSuggestion(suggestions[selectedIndex]);
    } else {
      handleSearch(query);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click on suggestions
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleFocus = () => {
    if (query.trim() && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <ApperIcon
          name="Search"
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 z-10"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-50"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns={isOpen ? 'search-suggestions' : undefined}
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
          }
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon 
              name="Loader2" 
              size={16} 
              className="text-surface-400 animate-spin" 
            />
          </div>
        )}
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden ${
              isMobile ? 'mx-0' : ''
            }`}
          >
            {isLoading ? (
              <div className="p-3">
                <SkeletonLoader type="text" count={3} />
              </div>
            ) : suggestions.length > 0 ? (
              <ul
                ref={listRef}
                id="search-suggestions"
                role="listbox"
                aria-label="Search suggestions"
                className="py-2 max-h-80 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`px-4 py-3 cursor-pointer transition-colors flex items-center space-x-3 ${
                      selectedIndex === index
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-surface-50 text-surface-900'
                    }`}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <div className="w-10 h-10 bg-surface-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={suggestion.imageUrl}
                        alt={suggestion.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{suggestion.name}</p>
                      <p className="text-sm text-surface-600 truncate">
                        {suggestion.brand} • ${suggestion.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : query.trim().length > 0 ? (
              <div className="p-4 text-center text-surface-600">
                <ApperIcon name="Search" size={24} className="mx-auto mb-2 text-surface-400" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs text-surface-500 mt-1">
                  Press Enter to search for "{query}"
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchWithAutocomplete;