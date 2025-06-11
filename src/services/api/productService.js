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

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return products.filter(p =>
p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm)
    ).map(p => ({ ...p }));
  },

  async searchSuggestions(query, limit = 8) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    
    // Score products based on relevance
    const scoredProducts = products
      .map(product => {
        let score = 0;
        const name = product.name.toLowerCase();
        const brand = product.brand.toLowerCase();
        const description = product.description.toLowerCase();
        
        // Higher score for exact name matches
        if (name.startsWith(searchTerm)) score += 10;
        else if (name.includes(searchTerm)) score += 5;
        
        // Brand matches
        if (brand.startsWith(searchTerm)) score += 8;
        else if (brand.includes(searchTerm)) score += 3;
        
        // Description matches
        if (description.includes(searchTerm)) score += 1;
        
        return score > 0 ? { ...product, relevanceScore: score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
    
    return scoredProducts;
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