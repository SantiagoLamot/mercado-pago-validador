import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { readAuthSnapshot } from '../lib/storage';

export const RequiereAdmin = ({ children }: { children: ReactNode }) => {
  const { rol } = readAuthSnapshot();
  return rol === 'ADMIN' ? <>{children}</> : <Navigate to="/" />;
};
