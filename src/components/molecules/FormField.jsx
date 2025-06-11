import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = ({ label, type, value, onChange, placeholder, required = false, className, labelClassName = '' }) => {
  return (
    <div className={className}>
      <Text as="label" className={`block text-sm font-medium text-surface-700 mb-2 ${labelClassName}`}>
        {label} {required && '*'}
      </Text>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormField;