import type { ReactNode } from 'react';
import styles from './Alert.module.scss';

interface AlertProps {
  variant?: 'error' | 'info';
  children: ReactNode;
}

export const Alert = ({ variant = 'error', children }: AlertProps) => {
  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {children}
    </div>
  );
};
