import { useAuth } from '../context/AuthContext';
import styles from './Home.module.scss';

export const Home = () => {
  const { username } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Bienvenido {username} al validador de MP</h1>
        <p className={styles.subtitle}>Asegurate de recibir tus transacciones.</p>
      </div>
    </div>
  );
};

export default Home;
