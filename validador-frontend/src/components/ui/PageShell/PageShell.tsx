import type { ReactNode } from 'react';
import styles from './PageShell.module.scss';

interface PageShellProps {
  children: ReactNode;
  background?: 'light-blue' | 'transparent';
  wide?: boolean;
}

export const PageShell = ({ children, background = 'light-blue', wide = false }: PageShellProps) => {
  return (
    <div className={`${styles.shell} ${background === 'transparent' ? styles.transparent : ''}`}>
      <div className={`${styles.inner} ${wide ? styles.wide : ''}`}>{children}</div>
    </div>
  );
};
