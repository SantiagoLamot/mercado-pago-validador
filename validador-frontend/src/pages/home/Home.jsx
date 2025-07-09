import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.homeBackground}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Bienvenido al validador de Mercado Pago</h1>
        <p className={styles.subtitle}>Asegurate de recibir tus pagos!</p>
      </div>
    </div>
  );
};

export default Home;
