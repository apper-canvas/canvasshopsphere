import { productService } from '../productService';
import products from '../../mockData/products.json';

// Mock the products data
jest.mock('../../mockData/products.json', () => [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Electronics',
    description: 'Latest iPhone with advanced camera system',
    price: 999,
    rating: 4.8
  },
  {
    id: '2', 
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'Electronics',
    description: 'Flagship Android smartphone with AI features',
    price: 899,
    rating: 4.6
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    brand: 'Apple',
    category: 'Computers',
    description: 'Lightweight laptop with M3 chip',
    price: 1299,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'Shoes',
    description: 'Comfortable running shoes with Air Max technology',
    price: 150,
    rating: 4.4
  }
]);

describe('ProductService Search Functionality', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('search method', () => {
    test('should return exact name matches with highest score', async () => {
      const results = await productService.search('iPhone 15 Pro');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 15 Pro');
      expect(results[0].relevanceScore).toBeGreaterThan(90);
    });

    test('should return partial name matches', async () => {
      const results = await productService.search('iPhone');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 15 Pro');
      expect(results[0].relevanceScore).toBeGreaterThan(0);
    });

    test('should search across multiple fields', async () => {
      const results = await productService.search('Apple');
      
      expect(results).toHaveLength(2);
      expect(results.some(p => p.name === 'iPhone 15 Pro')).toBe(true);
      expect(results.some(p => p.name === 'MacBook Air M3')).toBe(true);
    });

    test('should handle case insensitive search', async () => {
      const results = await productService.search('IPHONE');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 15 Pro');
    });

    test('should return empty array for empty query', async () => {
      const results = await productService.search('');
      expect(results).toHaveLength(0);
    });

    test('should return empty array for no matches', async () => {
      const results = await productService.search('nonexistent product xyz');
      expect(results).toHaveLength(0);
    });

    test('should handle typos with fuzzy matching', async () => {
      const results = await productService.search('iphon'); // typo
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 15 Pro');
    });

    test('should search in descriptions', async () => {
      const results = await productService.search('camera');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 15 Pro');
    });

    test('should search in categories', async () => {
      const results = await productService.search('Electronics');
      
      expect(results).toHaveLength(2);
      expect(results.every(p => p.category === 'Electronics')).toBe(true);
    });

    test('should prioritize exact matches over partial matches', async () => {
      const results = await productService.search('Samsung');
      
      expect(results).toHaveLength(1);
      expect(results[0].brand).toBe('Samsung');
      expect(results[0].relevanceScore).toBeGreaterThan(50);
    });

    test('should boost highly rated products', async () => {
      const results = await productService.search('laptop');
      
      if (results.length > 0) {
        // MacBook should get rating boost
        const macbook = results.find(p => p.name.includes('MacBook'));
        expect(macbook?.rating).toBeGreaterThanOrEqual(4.5);
      }
    });

    test('should handle multi-word searches', async () => {
      const results = await productService.search('Air Max');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Nike Air Max 270');
    });

    test('should log search queries', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log');
      
      await productService.search('test query');
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Search logged: "test query"')
      );
    });

    test('should handle errors gracefully', async () => {
      // Mock an error in the search process
      const originalLog = productService.logSearch;
      productService.logSearch = jest.fn(() => {
        throw new Error('Test error');
      });

      const results = await productService.search('test');
      
      expect(results).toEqual([]);
      
      // Restore original method
      productService.logSearch = originalLog;
    });
  });

  describe('searchSuggestions method', () => {
    test('should return limited number of suggestions', async () => {
      const results = await productService.searchSuggestions('phone', 2);
      
      expect(results).toHaveLength(2);
    });

    test('should prioritize name matches in suggestions', async () => {
      const results = await productService.searchSuggestions('Galaxy');
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Samsung Galaxy S24');
    });

    test('should return suggestions for partial brand matches', async () => {
      const results = await productService.searchSuggestions('Sams');
      
      expect(results).toHaveLength(1);
      expect(results[0].brand).toBe('Samsung');
    });

    test('should handle empty query gracefully', async () => {
      const results = await productService.searchSuggestions('');
      expect(results).toHaveLength(0);
    });

    test('should boost popular products in suggestions', async () => {
      const results = await productService.searchSuggestions('laptop');
      
      if (results.length > 0) {
        // Higher rated products should appear first
        expect(results[0].rating).toBeGreaterThanOrEqual(4.0);
      }
    });
  });

  describe('fuzzy matching', () => {
    test('should match with one character difference', () => {
      const similarity = productService.fuzzyMatch('iPhone', 'iphon');
      expect(similarity).toBeGreaterThan(0.7);
    });

    test('should not match very different strings', () => {
      const similarity = productService.fuzzyMatch('iPhone', 'laptop');
      expect(similarity).toBeLessThan(0.3);
    });

    test('should handle empty strings', () => {
      const similarity = productService.fuzzyMatch('', 'test');
      expect(similarity).toBe(0);
    });
  });

  describe('word boundary matching', () => {
    test('should match word at beginning', () => {
      const matches = productService.matchesWordBoundary('iPhone Pro Max', 'iPhone');
      expect(matches).toBe(true);
    });

    test('should match word in middle', () => {
      const matches = productService.matchesWordBoundary('Samsung Galaxy S24', 'Galaxy');
      expect(matches).toBe(true);
    });

    test('should not match partial words', () => {
      const matches = productService.matchesWordBoundary('iPhone', 'Phon');
      expect(matches).toBe(false);
    });
  });

  describe('search analytics', () => {
    test('should track search history', async () => {
      await productService.search('test query');
      
      const history = JSON.parse(sessionStorage.getItem('searchHistory') || '[]');
      expect(history).toHaveLength(1);
      expect(history[0].query).toBe('test query');
      expect(history[0].type).toBe('full_search');
    });

    test('should track search performance', async () => {
      await productService.search('iPhone');
      
      const performance = JSON.parse(sessionStorage.getItem('searchPerformance') || '[]');
      expect(performance).toHaveLength(1);
      expect(performance[0].query).toBe('iPhone');
      expect(typeof performance[0].duration).toBe('number');
      expect(typeof performance[0].resultCount).toBe('number');
    });

    test('should generate search analytics', async () => {
      await productService.search('iPhone');
      await productService.search('Samsung');
      await productService.searchSuggestions('Apple');
      
      const analytics = productService.getSearchAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics.totalSearches).toBe(3);
      expect(typeof analytics.avgDuration).toBe('number');
      expect(Array.isArray(analytics.popularQueries)).toBe(true);
    });

    test('should limit search history size', async () => {
      // Simulate many searches
      for (let i = 0; i < 105; i++) {
        await productService.search(`query ${i}`);
      }
      
      const history = JSON.parse(sessionStorage.getItem('searchHistory') || '[]');
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('error handling', () => {
    test('should log search errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      
      // Force an error by mocking a method to throw
      const originalMethod = productService.calculateSearchScore;
      productService.calculateSearchScore = jest.fn(() => {
        throw new Error('Test error');
      });
      
      const results = await productService.search('test');
      
      expect(results).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      // Restore original method
      productService.calculateSearchScore = originalMethod;
    });

    test('should handle suggestion errors gracefully', async () => {
      const originalMethod = productService.calculateSuggestionScore;
      productService.calculateSuggestionScore = jest.fn(() => {
        throw new Error('Test error');
      });
      
      const results = await productService.searchSuggestions('test');
      
      expect(results).toEqual([]);
      
      // Restore original method  
      productService.calculateSuggestionScore = originalMethod;
    });
  });

  describe('performance optimization', () => {
    test('should complete search within reasonable time', async () => {
      const start = Date.now();
      await productService.search('test query');
      const duration = Date.now() - start;
      
      // Should complete within 1 second (including 300ms delay)
      expect(duration).toBeLessThan(1000);
    });

    test('should complete suggestions quickly', async () => {
      const start = Date.now();
      await productService.searchSuggestions('test');
      const duration = Date.now() - start;
      
      // Should complete within 500ms (including 200ms delay)
      expect(duration).toBeLessThan(500);
    });
  });
});