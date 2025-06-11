import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Shipping', icon: 'Truck' },
    { id: 2, name: 'Payment', icon: 'CreditCard' },
    { id: 3, name: 'Review', icon: 'CheckCircle' }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.id <= currentStep
                  ? 'bg-primary text-white'
                  : 'bg-surface-200 text-surface-600'
              }`}
            >
              <ApperIcon name={step.icon} size={18} />
            </div>
            <Text as="span"
              className={`font-medium ${
                step.id <= currentStep ? 'text-primary' : 'text-surface-600'
              }`}
            >
              {step.name}
            </Text>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-4 ${
                step.id < currentStep ? 'bg-primary' : 'bg-surface-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProgress;