import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const PaymentForm = ({ paymentInfo, onPaymentInfoChange, onSubmit, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-surface-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-xl font-heading font-semibold text-surface-900">
          Payment Information
        </Text>
        <Button
          onClick={onBack}
          className="text-primary hover:text-primary/80 font-medium"
        >
          ← Back to Shipping
        </Button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Card Number"
          type="text"
          required
          placeholder="1234 5678 9012 3456"
          value={paymentInfo.cardNumber}
          onChange={(e) => onPaymentInfoChange('cardNumber', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Expiry Date"
            type="text"
            required
            placeholder="MM/YY"
            value={paymentInfo.expiryDate}
            onChange={(e) => onPaymentInfoChange('expiryDate', e.target.value)}
          />
          <FormField
            label="CVV"
            type="text"
            required
            placeholder="123"
            value={paymentInfo.cvv}
            onChange={(e) => onPaymentInfoChange('cvv', e.target.value)}
          />
        </div>

        <FormField
          label="Cardholder Name"
          type="text"
          required
          value={paymentInfo.cardName}
          onChange={(e) => onPaymentInfoChange('cardName', e.target.value)}
        />

        <div className="flex justify-end pt-4">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Review Order
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PaymentForm;