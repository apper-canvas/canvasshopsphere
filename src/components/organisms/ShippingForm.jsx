import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const ShippingForm = ({ shippingInfo, onShippingInfoChange, onSubmit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-surface-200 p-6"
    >
      <Text as="h2" className="text-xl font-heading font-semibold text-surface-900 mb-6">
        Shipping Information
      </Text>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            type="text"
            required
            value={shippingInfo.firstName}
            onChange={(e) => onShippingInfoChange('firstName', e.target.value)}
          />
          <FormField
            label="Last Name"
            type="text"
            required
            value={shippingInfo.lastName}
            onChange={(e) => onShippingInfoChange('lastName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            type="email"
            required
            value={shippingInfo.email}
            onChange={(e) => onShippingInfoChange('email', e.target.value)}
          />
          <FormField
            label="Phone"
            type="tel"
            value={shippingInfo.phone}
            onChange={(e) => onShippingInfoChange('phone', e.target.value)}
          />
        </div>

        <FormField
          label="Address"
          type="text"
          required
          value={shippingInfo.address}
          onChange={(e) => onShippingInfoChange('address', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="City"
            type="text"
            required
            value={shippingInfo.city}
            onChange={(e) => onShippingInfoChange('city', e.target.value)}
          />
          <FormField
            label="State"
            type="text"
            required
            value={shippingInfo.state}
            onChange={(e) => onShippingInfoChange('state', e.target.value)}
          />
          <FormField
            label="ZIP Code"
            type="text"
            required
            value={shippingInfo.zipCode}
            onChange={(e) => onShippingInfoChange('zipCode', e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ShippingForm;