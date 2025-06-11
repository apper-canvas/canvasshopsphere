import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { useCart } from './services/cartService';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navigation = [
    { name: 'Shop', href: '/shop', icon: 'Store' },
    { name: 'Orders', href: '/orders', icon: 'Package' },
  ];

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-surface-200 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/shop" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Store" size={20} className="text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-surface-900">
                ShopSphere
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-surface-700 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <ApperIcon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <NavLink
                to="/cart"
                className="relative p-2 text-surface-700 hover:text-primary transition-colors"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </NavLink>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-surface-700 hover:text-primary transition-colors"
              >
                <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
              </button>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="hidden lg:flex items-center space-x-6 py-3 border-t border-surface-100">
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/shop?category=${category.toLowerCase()}`}
                className="text-sm text-surface-600 hover:text-primary transition-colors"
              >
                {category}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <ApperIcon
              name="Search"
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-50"
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-surface shadow-xl z-50 md:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-heading font-semibold">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-surface-500 hover:text-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-surface-700 hover:bg-surface-100'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-surface-200">
                  <h3 className="text-sm font-medium text-surface-900 mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <NavLink
                        key={category}
                        to={`/shop?category=${category.toLowerCase()}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-surface-600 hover:bg-surface-100 rounded-lg"
                      >
                        {category}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface-800 text-surface-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Store" size={20} className="text-white" />
                </div>
                <span className="text-xl font-heading font-bold text-white">
                  ShopSphere
                </span>
              </div>
              <p className="text-sm">
                Your trusted destination for quality products and exceptional shopping experience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-surface-400 hover:text-white">
                  <ApperIcon name="Facebook" size={20} />
                </a>
                <a href="#" className="text-surface-400 hover:text-white">
                  <ApperIcon name="Twitter" size={20} />
                </a>
                <a href="#" className="text-surface-400 hover:text-white">
                  <ApperIcon name="Instagram" size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-700 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 ShopSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;