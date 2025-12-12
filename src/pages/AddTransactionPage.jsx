import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransaction from '../components/AddTransaction';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [isOpen] = useState(true); // Always open when this page is accessed

  const handleClose = () => {
    // Navigate back to cashier dashboard when closing
    navigate('/cashier', { replace: true });
  };

  return (
    <AddTransaction 
      isOpen={isOpen} 
      onClose={handleClose} 
    />
  );
};

export default AddTransactionPage;