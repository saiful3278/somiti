import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "default" 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalSizeClass = size === 'large' ? 'modal__content--large' : '';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal ${modalSizeClass}`}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button 
            className="modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;