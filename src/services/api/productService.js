import products from '../mockData/products.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...products];
  },

  async getById(id) {
    await delay(200);
    const product = products.find(p => p.id === id);
    return product ? { ...product } : null;
  },

  async getByCategory(category) {
    await delay(300);
    return products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    ).map(p => ({ ...p }));
  },

// Enhanced search with fuzzy matching, stemming, and analytics
  async search(query, options = {}) {
    const startTime = Date.now();
    await delay(300);
    
    try {
      const searchTerm = query.toLowerCase().trim();
      if (!searchTerm) return [];
      
      // Log search query
      this.logSearch(query, 'full_search');
      
      // Enhanced search with fuzzy matching and intelligent scoring
      const scoredProducts = products
        .map(product => {
          const score = this.calculateSearchScore(product, searchTerm, options);
          return score > 0 ? { ...product, relevanceScore: score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      // Log search results and performance
      const duration = Date.now() - startTime;
      this.logSearchResults(query, scoredProducts.length, duration);
      
      return scoredProducts;
    } catch (error) {
      this.logSearchError(query, error);
      console.error('Search error:', error);
      return [];
    }
  },

  async searchSuggestions(query, limit = 8) {
    const startTime = Date.now();
    await delay(200);
    
    try {
      const searchTerm = query.toLowerCase().trim();
      if (!searchTerm) return [];
      
      // Log suggestion request
      this.logSearch(query, 'suggestions');
      
      // Enhanced suggestions with better relevance scoring
      const scoredProducts = products
        .map(product => {
          const score = this.calculateSuggestionScore(product, searchTerm);
          return score > 0 ? { ...product, relevanceScore: score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
      
      // Log suggestion performance
      const duration = Date.now() - startTime;
      this.logSearchResults(query, scoredProducts.length, duration, 'suggestions');
      
      return scoredProducts;
    } catch (error) {
      this.logSearchError(query, error, 'suggestions');
      console.error('Search suggestions error:', error);
      return [];
    }
  },

  // Advanced search scoring algorithm
  calculateSearchScore(product, searchTerm, options = {}) {
    let score = 0;
    const name = product.name.toLowerCase();
    const brand = product.brand.toLowerCase();  
    const description = product.description.toLowerCase();
    const category = product.category.toLowerCase();
    
    // Exact matches (highest priority)
    if (name === searchTerm) score += 100;
    if (brand === searchTerm) score += 90;
    if (category === searchTerm) score += 80;
    
    // Starts with matches
    if (name.startsWith(searchTerm)) score += 50;
    if (brand.startsWith(searchTerm)) score += 40;
    if (category.startsWith(searchTerm)) score += 35;
    
    // Word boundary matches
    const words = searchTerm.split(' ').filter(w => w.length > 0);
    words.forEach(word => {
      if (this.matchesWordBoundary(name, word)) score += 30;
      if (this.matchesWordBoundary(brand, word)) score += 25;
      if (this.matchesWordBoundary(category, word)) score += 20;
      if (this.matchesWordBoundary(description, word)) score += 5;
    });
    
    // Contains matches
    if (name.includes(searchTerm)) score += 20;
    if (brand.includes(searchTerm)) score += 15;
    if (category.includes(searchTerm)) score += 12;
    if (description.includes(searchTerm)) score += 3;
    
    // Fuzzy matching for typos
    words.forEach(word => {
      if (word.length >= 3) {
        score += this.fuzzyMatch(name, word) * 15;
        score += this.fuzzyMatch(brand, word) * 12;
        score += this.fuzzyMatch(category, word) * 10;
        score += this.fuzzyMatch(description, word) * 2;
      }
    });
    
    // Boost popular/highly rated products
    if (product.rating >= 4.5) score += 5;
    if (product.rating >= 4.0) score += 2;
    
    // Apply category preference if specified
    if (options.categoryBoost && product.category.toLowerCase() === options.categoryBoost.toLowerCase()) {
      score += 25;
    }
    
    return Math.round(score);
  },

  // Optimized scoring for suggestions
  calculateSuggestionScore(product, searchTerm) {
    let score = 0;
    const name = product.name.toLowerCase();
    const brand = product.brand.toLowerCase();
    
    // Prioritize name matches for suggestions
    if (name.startsWith(searchTerm)) score += 100;
    else if (name.includes(searchTerm)) score += 50;
    
    // Brand matches
    if (brand.startsWith(searchTerm)) score += 80;
    else if (brand.includes(searchTerm)) score += 30;
    
    // Word boundary matching
    const words = searchTerm.split(' ').filter(w => w.length > 1);
    words.forEach(word => {
      if (this.matchesWordBoundary(name, word)) score += 40;
      if (this.matchesWordBoundary(brand, word)) score += 25;
    });
    
    // Light fuzzy matching for suggestions
    if (searchTerm.length >= 3) {
      score += this.fuzzyMatch(name, searchTerm) * 20;
      score += this.fuzzyMatch(brand, searchTerm) * 15;
    }
    
    // Boost for popular products in suggestions
    if (product.rating >= 4.5) score += 10;
    if (product.rating >= 4.0) score += 5;
    
    return Math.round(score);
  },

  // Word boundary matching
  matchesWordBoundary(text, word) {
    const regex = new RegExp(`\\b${this.escapeRegex(word)}`, 'i');
    return regex.test(text);
  },

  // Simple fuzzy matching using Levenshtein distance
  fuzzyMatch(text, word) {
    if (!text || !word) return 0;
    
    const words = text.split(/\s+/);
    let bestMatch = 0;
    
    words.forEach(textWord => {
      if (textWord.length === 0) return;
      
      const distance = this.levenshteinDistance(textWord, word);
      const maxLength = Math.max(textWord.length, word.length);
      const similarity = 1 - (distance / maxLength);
      
      // Only consider matches with >70% similarity for fuzzy matching
      if (similarity > 0.7) {
        bestMatch = Math.max(bestMatch, similarity);
      }
    });
    
    return bestMatch;
  },

  // Levenshtein distance calculation
  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion  
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  },

  // Escape special regex characters
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  // Search analytics and logging
  logSearch(query, type = 'search') {
    if (typeof window !== 'undefined') {
      const searchLog = {
        query: query.trim(),
        type,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      };
      
      // Store in sessionStorage for analytics
      const searches = JSON.parse(sessionStorage.getItem('searchHistory') || '[]');
      searches.push(searchLog);
      
      // Keep only last 100 searches to prevent storage bloat
      if (searches.length > 100) {
        searches.splice(0, searches.length - 100);
      }
      
      sessionStorage.setItem('searchHistory', JSON.stringify(searches));
      
      // Console logging for development
      console.log(`Search logged: "${query}" (${type})`);
    }
  },

  logSearchResults(query, resultCount, duration, type = 'search') {
    if (typeof window !== 'undefined') {
      const resultsLog = {
        query: query.trim(),
        type,
        resultCount,
        duration,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      };
      
      // Store performance data
      const performance = JSON.parse(sessionStorage.getItem('searchPerformance') || '[]');
      performance.push(resultsLog);
      
      // Keep only last 50 performance logs
      if (performance.length > 50) {
        performance.splice(0, performance.length - 50);
      }
      
      sessionStorage.setItem('searchPerformance', JSON.stringify(performance));
      
      // Log poor performing searches
      if (resultCount === 0) {
        console.warn(`No results for search: "${query}" (${type})`);
      } else if (duration > 1000) {
        console.warn(`Slow search detected: "${query}" took ${duration}ms`);
      }
    }
  },

  logSearchError(query, error, type = 'search') {
    const errorLog = {
      query: query.trim(),
      type,
      error: error.message,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };
    
    console.error('Search error logged:', errorLog);
    
    if (typeof window !== 'undefined') {
      const errors = JSON.parse(sessionStorage.getItem('searchErrors') || '[]');
      errors.push(errorLog);
      
      // Keep only last 20 errors
      if (errors.length > 20) {
        errors.splice(0, errors.length - 20);
      }
      
      sessionStorage.setItem('searchErrors', JSON.stringify(errors));
    }
  },

  getSessionId() {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('searchSessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('searchSessionId', sessionId);
      }
      return sessionId;
    }
    return 'server_session';
  },

  // Get search analytics
  getSearchAnalytics() {
    if (typeof window === 'undefined') return null;
    
    const history = JSON.parse(sessionStorage.getItem('searchHistory') || '[]');
    const performance = JSON.parse(sessionStorage.getItem('searchPerformance') || '[]');
    const errors = JSON.parse(sessionStorage.getItem('searchErrors') || '[]');
    
    // Calculate analytics
    const totalSearches = history.length;
    const uniqueQueries = new Set(history.map(h => h.query.toLowerCase())).size;
    const avgDuration = performance.length > 0 
      ? performance.reduce((sum, p) => sum + p.duration, 0) / performance.length 
      : 0;
    const zeroResultQueries = performance.filter(p => p.resultCount === 0);
    const popularQueries = this.getPopularQueries(history);
    
    return {
      totalSearches,
      uniqueQueries,
      avgDuration: Math.round(avgDuration),
      zeroResultRate: totalSearches > 0 ? (zeroResultQueries.length / totalSearches * 100).toFixed(1) : 0,
      errorRate: totalSearches > 0 ? (errors.length / totalSearches * 100).toFixed(1) : 0,
      popularQueries,
      recentErrors: errors.slice(-5)
    };
  },

  getPopularQueries(history, limit = 10) {
    const queryCount = {};
    history.forEach(h => {
      const query = h.query.toLowerCase().trim();
      if (query.length > 0) {
        queryCount[query] = (queryCount[query] || 0) + 1;
      }
    });
    
    return Object.entries(queryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  },
  async create(productData) {
    await delay(500);
    const newProduct = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...productData
    };
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(400);
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = {
      ...product,
      ...productData,
      updatedAt: new Date().toISOString()
    };
    return { ...updatedProduct };
  },

  async delete(id) {
    await delay(300);
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    return { success: true };
  }
};