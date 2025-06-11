import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const EmptyState = ({ 
  title = "No items found", 
  description = "Try adjusting your search or filters", 
  actionLabel = "Browse Products",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      <p className="text-surface-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;