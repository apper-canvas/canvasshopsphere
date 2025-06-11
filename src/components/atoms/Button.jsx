import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, disabled, type = 'button', whileHover, whileTap, icon: IconComponent, iconSize }) => {
  // Filter out custom props before passing to the DOM element
  const buttonProps = { onClick, disabled, type, className };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      {...buttonProps}
    >
      {IconComponent && <IconComponent size={iconSize} className="mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;