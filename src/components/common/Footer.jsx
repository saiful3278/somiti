import React from 'react';

const Footer = () => {
  console.log('Footer rendered');
  // Prevent right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent drag and drop
  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <footer className="footer">
      <img 
        src="/footer_logo.svg" 
        alt="Footer Logo" 
        className="footer-logo"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        draggable={false}
      />
    </footer>
  );
};

export default Footer;