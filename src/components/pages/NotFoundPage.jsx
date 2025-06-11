import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-surface-100 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" size={64} className="text-surface-400" />
          </div>
        </motion.div>
        
        <Text as="h1" className="text-6xl font-heading font-bold text-surface-900 mb-4">
          404
        </Text>
        <Text as="h2" className="text-2xl font-heading font-semibold text-surface-700 mb-4">
          Page Not Found
        </Text>
        <Text className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <div className="space-y-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors space-x-2"
          >
            <ApperIcon name="Home" size={18} />
            <span>Go to Shop</span>
          </Link>
          
          <Button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-surface-100 text-surface-900 font-medium rounded-lg hover:bg-surface-200 transition-colors space-x-2"
            icon={ApperIcon}
            iconSize={18}
            name="ArrowLeft"
          >
            <span>Go Back</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;