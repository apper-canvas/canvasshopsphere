import reviews from '../mockData/reviews.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getAll() {
    await delay(300);
    return [...reviews];
  },

  async getById(id) {
    await delay(200);
    const review = reviews.find(r => r.id === id);
    return review ? { ...review } : null;
  },

  async getByProductId(productId) {
    await delay(300);
    return reviews.filter(r => r.productId === productId).map(r => ({ ...r }));
  },

  async create(reviewData) {
    await delay(500);
    const newReview = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    return { ...newReview };
  },

  async update(id, reviewData) {
    await delay(400);
    const review = reviews.find(r => r.id === id);
    if (!review) {
      throw new Error('Review not found');
    }
    
    const updatedReview = {
      ...review,
      ...reviewData,
      updatedAt: new Date().toISOString()
    };
    return { ...updatedReview };
  },

  async delete(id) {
    await delay(300);
    const reviewIndex = reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }
    return { success: true };
  }
};