import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 focus:ring-indigo-500 shadow-lg hover:shadow-xl',
    accent: 'bg-gradient-to-r from-lime-400 to-lime-500 text-gray-900 hover:from-lime-500 hover:to-lime-600 focus:ring-lime-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100/80 text-gray-800 hover:bg-gray-200/80 focus:ring-gray-500 dark:bg-gray-700/80 dark:text-gray-100 dark:hover:bg-gray-600/80',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    ghost: 'text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
