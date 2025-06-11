import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry,
  title = "Oops!"
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={40} className="text-error" />
      </div>
      
      <Text as="h3" className="text-xl font-heading font-semibold text-surface-900 mb-2">
        {title}
      </Text>
      <Text className="text-surface-600 mb-6 max-w-md">
        {message}
      </Text>
      
      {onRetry && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          icon={ApperIcon}
          iconSize={18}
          name="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;