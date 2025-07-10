import { useEffect, useState } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('username');
    setUsername(storedUser);
  }, []);

  return (
    <div className={styles.homeBackground}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Bienvenido {username} al validador de MP</h1>
        <p className={styles.subtitle}>Asegurate de recibir tus transacciones!.</p>
      </div>
    </div>
  );
};

export default Home;
