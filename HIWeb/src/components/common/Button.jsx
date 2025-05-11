import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon = null,
  className = ''
}) => {
  const buttonClasses = `
    hi-button 
    hi-button--${variant} 
    hi-button--${size}
    ${fullWidth ? 'hi-button--full-width' : ''}
    ${icon ? 'hi-button--with-icon' : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="hi-button__icon">{icon}</span>}
      <span className="hi-button__text">{children}</span>
    </button>
  );
};

export default Button;