import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroCard.module.scss';

interface HeroCardProps {
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}

export const HeroCard = ({ icon, title, description, children }: HeroCardProps) => {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={styles.icon}>{icon}</div>

      <motion.h1
        className={styles.title}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className={styles.text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {description}
      </motion.p>

      {children}
    </motion.div>
  );
};

export const Highlight = ({ children }: { children: ReactNode }) => (
  <span className={styles.highlight}>{children}</span>
);
