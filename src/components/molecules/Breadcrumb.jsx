import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-surface-600 mb-8">
      {items.map((item, index) => (
        <React.Fragment key={item.path || item.label}>
          {item.path ? (
            <Link to={item.path} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <Text as="span" className="text-surface-900">{item.label}</Text>
          )}
          {index < items.length - 1 && <ApperIcon name="ChevronRight" size={16} />}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;