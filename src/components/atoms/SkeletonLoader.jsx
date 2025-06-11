import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'products', count = 1 }) => {
  if (type === 'filters') {
    return (
      <div className="bg-white rounded-xl border border-surface-200 p-4">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-surface-200 rounded"></div>
                  <div className="h-3 bg-surface-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="h-4 bg-surface-200 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-surface-200 rounded flex-1"></div>
              <div className="h-8 bg-surface-200 rounded flex-1"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 bg-surface-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-surface-200 rounded"></div>
                  <div className="h-3 bg-surface-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'product-detail') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-surface-200 rounded-xl"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-surface-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-surface-200 rounded w-20"></div>
                  <div className="h-4 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
              
              <div className="h-10 bg-surface-200 rounded w-1/3"></div>
              
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-4 bg-surface-200 rounded"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              </div>
              
              <div className="flex space-x-4">
                <div className="h-12 bg-surface-200 rounded flex-1"></div>
                <div className="h-12 bg-surface-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl border border-surface-200 overflow-hidden"
        >
          <div className="animate-pulse">
            <div className="h-48 bg-surface-200"></div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              <div className="flex items-center justify-between">
                <div className="h-6 bg-surface-200 rounded w-1/3"></div>
                <div className="h-8 w-8 bg-surface-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;