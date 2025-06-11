import { motion } from 'framer-motion';
import ProductCatalog from '@/components/organisms/ProductCatalog';

const ShopPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto">
        <header className="text-center py-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shop Our Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing products with our powerful search and filtering system. 
            Find exactly what you're looking for with ease.
          </p>
        </header>
        
        <ProductCatalog />
      </div>
    </motion.div>
  );
};

export default ShopPage;