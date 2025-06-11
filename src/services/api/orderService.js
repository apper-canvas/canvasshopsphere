let orders = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.id === id);
    return order ? { ...order } : null;
  },

  async create(orderData) {
    await delay(500);
    const newOrder = {
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    
    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay(400);
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      ...orderData,
      updatedAt: new Date().toISOString()
    };
    
    orders[orderIndex] = updatedOrder;
    return { ...updatedOrder };
  },

  async delete(id) {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders.splice(orderIndex, 1);
    return { success: true };
  }
};