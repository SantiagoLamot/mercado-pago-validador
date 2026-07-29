import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.scss';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'sm';
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, loadingText, disabled, children, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className ?? ''}`}
        disabled={disabled || loading}
        aria-busy={loading}
        {...rest}
      >
        {loading ? loadingText ?? 'Cargando…' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const MotionButton = motion.create(Button);
