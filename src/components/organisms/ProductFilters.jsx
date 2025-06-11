import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import RatingStars from '@/components/atoms/RatingStars';

const ProductFilters = ({ filters, onFilterChange, onClearFilters, productsCount }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty'
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'Canon',
    'Dell',
    'HP'
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category
    });
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    onFilterChange({
      ...filters,
      brands: newBrands
    });
  };

  const handlePriceChange = (value, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    onFilterChange({
      ...filters,
      priceRange: newRange
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-surface-200 last:border-b-0">
      <Button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <Text as="h3" className="font-semibold text-surface-900">{title}</Text>
        <ApperIcon
          name="ChevronDown"
          size={18}
          className={`text-surface-500 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </Button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-surface-200 sticky top-24">
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">
            Filters
          </Text>
          <Button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </Button>
        </div>
        <Text className="text-sm text-surface-600 mt-1">
          {productsCount} products
        </Text>
      </div>

      <div className="p-4 space-y-0">
        {/* Category Filter */}
        <FilterSection
          title="Category"
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <Text as="span" className="text-sm text-surface-700 group-hover:text-surface-900">
                  {category}
                </Text>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Text as="label" className="block text-xs text-surface-600 mb-1">Min</Text>
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(e.target.value, 0)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <Text as="label" className="block text-xs text-surface-600 mb-1">Max</Text>
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(e.target.value, 1)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <Text className="text-sm text-surface-600">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Text>
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection
          title="Brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 text-primary focus:ring-primary rounded"
                />
                <Text as="span" className="text-sm text-surface-700 group-hover:text-surface-900">
                  {brand}
                </Text>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection
          title="Rating"
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div className="flex items-center space-x-2">
                  <RatingStars rating={rating} size={14} />
                  <Text as="span" className="text-sm text-surface-700">& up</Text>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;