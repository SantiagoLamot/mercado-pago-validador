import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiCheck,
  FiX,
  FiPlay,
  FiPause,
  FiChevronDown,
  FiShield,
  FiZap,
  FiClock,
  FiSmartphone,
  FiEyeOff,
  FiShoppingBag,
  FiShoppingCart,
  FiPackage,
  FiPlusCircle,
  FiBox,
  FiTag,
  FiTool,
  FiCoffee,
  FiHeart,
  FiVolume2,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';
import styles from './Landing.module.scss';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function trackEvent(name: string, payload?: Record<string, unknown>) {
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, ...payload });
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navInner}>
        <a href="#top" className={styles.navBrand}>
          <span className={styles.navBrandDot} aria-hidden="true" />
          Validador MP
        </a>
        <nav className={styles.navLinks} aria-label="Navegación principal">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#ideal-para">Ideal para</a>
          <a href="#preguntas-frecuentes">Preguntas</a>
        </nav>
        <div className={styles.navActions}>
          <Link to="/login" className={styles.navGhostBtn}>
            Ingresar
          </Link>
          <Link
            to="/register"
            className={styles.navCta}
            onClick={() => trackEvent('cta_click', { location: 'nav', label: 'comenzar_ahora' })}
          >
            Comenzar ahora
          </Link>
        </div>
      </div>
    </header>
  );
}

function WaveBars({ active }: { active: boolean }) {
  return (
    <div className={`${styles.waveBars} ${active ? styles.waveBarsActive : ''}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

function FloatingNotification() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible((v) => !v);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.phoneMockup}>
      <div className={styles.phoneNotch} aria-hidden="true" />
      <div className={styles.phoneScreen}>
        <div className={styles.phoneStatusBar}>
          <span>9:41</span>
          <span className={styles.phoneStatusIcons} aria-hidden="true">●●●</span>
        </div>
        <div className={styles.phoneAppHeader}>
          <span>Validador MP</span>
          <span className={styles.liveDot} aria-hidden="true" />
        </div>
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              className={styles.notificationCard}
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.notificationTop}>
                <span className={styles.notificationEmoji} role="img" aria-label="Dinero">
                  💰
                </span>
                <span className={styles.notificationBadge}>
                  <FiCheck aria-hidden="true" /> Dinero acreditado
                </span>
              </div>
              <p className={styles.notificationTitle}>Pago recibido</p>
              <p className={styles.notificationAmount}>$4.000</p>
              <p className={styles.notificationAlias}>Alias: almacen.maria</p>
              <div className={styles.notificationVoice}>
                <FiVolume2 aria-hidden="true" />
                <WaveBars active={visible} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className={styles.phoneCaption}>“Se recibió un pago de cuatro mil pesos.”</p>
      </div>
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -60]);
  const glowY = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section id="top" className={styles.hero}>
      <motion.div className={styles.heroGlowA} style={{ y: glowY }} aria-hidden="true" />
      <motion.div className={styles.heroGlowB} style={{ y: glowY }} aria-hidden="true" />
      <div className={styles.heroInner}>
        <motion.div
          className={styles.heroCopy}
          style={{ y: parallaxY }}
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span className={styles.eyebrow} variants={fadeUp} transition={{ duration: 0.5 }}>
            <FiShield aria-hidden="true" /> Confirmación real de pagos, en el instante
          </motion.span>
          <motion.h1 className={styles.heroTitle} variants={fadeUp} transition={{ duration: 0.6 }}>
            Nunca más entregues un producto por un comprobante falso.
          </motion.h1>
          <motion.p className={styles.heroSubtitle} variants={fadeUp} transition={{ duration: 0.6 }}>
            Escuchá una notificación de voz únicamente cuando el dinero haya ingresado realmente a tu
            Mercado Pago. Sin mirar el celular. Sin revisar comprobantes.
          </motion.p>
          <motion.div className={styles.heroActions} variants={fadeUp} transition={{ duration: 0.6 }}>
            <Link
              to="/register"
              className={styles.primaryBtn}
              onClick={() => trackEvent('cta_click', { location: 'hero', label: 'comenzar_ahora' })}
            >
              Comenzar ahora <FiArrowRight aria-hidden="true" />
            </Link>
            <a
              href="#como-funciona"
              className={styles.secondaryBtn}
              onClick={() => trackEvent('cta_click', { location: 'hero', label: 'ver_como_funciona' })}
            >
              Ver cómo funciona
            </a>
          </motion.div>
          <motion.p className={styles.heroMicrocopy} variants={fadeUp} transition={{ duration: 0.5 }}>
            Configurás tu alias y listo. Sin instalar hardware, sin cambiar de cuenta.
          </motion.p>
        </motion.div>
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <FloatingNotification />
        </motion.div>
      </div>
    </section>
  );
}

const steps = [
  {
    number: '01',
    title: 'Ingresás tu Alias de Mercado Pago',
    description: 'Configurás una sola vez el alias de tu cuenta. No compartís contraseñas ni datos sensibles.',
  },
  {
    number: '02',
    title: 'El sistema monitorea automáticamente los ingresos',
    description: 'Validador MP consulta en tiempo real los movimientos reales de tu cuenta de Mercado Pago.',
  },
  {
    number: '03',
    title: 'Cuando el dinero entra realmente, lo escuchás',
    description: '“Se recibió un pago de…” — una voz automática confirma el ingreso sin que mires el celular.',
  },
];

function HowItWorks() {
  return (
    <section id="como-funciona" className={styles.section}>
      <Reveal className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Cómo funciona</span>
        <h2>Tres pasos. Cero comprobantes.</h2>
        <p>De la configuración a la primera confirmación de voz en minutos.</p>
      </Reveal>
      <div className={styles.timeline}>
        <div className={styles.timelineLine} aria-hidden="true" />
        {steps.map((step, i) => (
          <Reveal key={step.number} className={styles.timelineStep} delay={i * 0.12}>
            <span className={styles.timelineNumber}>{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const receiptRisks = [
  'Capturas de pantalla editadas con apps de edición',
  'Comprobantes generados o falsificados con plantillas',
  'Comprobantes enviados antes de cancelar la transferencia',
  'Transferencias rechazadas o revertidas después del envío',
  'Estafas coordinadas en el momento de mayor apuro del local',
];

function WhyNotReceipts() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>El problema</span>
          <h2>¿Por qué no confiar en los comprobantes?</h2>
          <p>Un comprobante es solo una imagen. No prueba que el dinero haya ingresado a tu cuenta.</p>
        </Reveal>
        <div className={styles.risksGrid}>
          {receiptRisks.map((risk, i) => (
            <Reveal key={risk} className={styles.riskCard} delay={i * 0.06}>
              <FiEyeOff aria-hidden="true" />
              <span>{risk}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className={styles.certaintyCallout}>
          <FiCheck aria-hidden="true" />
          <p>
            Con Validador MP solo importa una cosa: <strong>que el dinero haya ingresado realmente.</strong>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const withoutItems = [
  'Mirar el celular constantemente',
  'Abrir Mercado Pago a cada rato',
  'Hacer esperar al cliente',
  'Comparar comprobantes a simple vista',
  'Riesgo permanente de estafa',
];

const withItems = [
  'Voz automática en el instante exacto',
  'Confirmación de dinero real acreditado',
  'Cero comprobantes falsos aceptados',
  'Atención más rápida al cliente',
  'Mayor seguridad para tu negocio',
];

function Comparison() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>La diferencia</span>
        <h2>Antes y después de Validador MP</h2>
      </Reveal>
      <div className={styles.compareGrid}>
        <Reveal className={`${styles.compareCard} ${styles.compareCardNegative}`}>
          <h3>Sin Validador MP</h3>
          <ul>
            {withoutItems.map((item) => (
              <li key={item}>
                <FiX aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className={`${styles.compareCard} ${styles.compareCardPositive}`} delay={0.1}>
          <h3>Con Validador MP</h3>
          <ul>
            {withItems.map((item) => (
              <li key={item}>
                <FiCheck aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

const businesses = [
  { label: 'Kioscos', icon: FiShoppingBag },
  { label: 'Supermercados', icon: FiShoppingCart },
  { label: 'Panaderías', icon: FiPackage },
  { label: 'Farmacias', icon: FiPlusCircle },
  { label: 'Carnicerías', icon: FiBox },
  { label: 'Locales de ropa', icon: FiTag },
  { label: 'Ferreterías', icon: FiTool },
  { label: 'Estaciones de servicio', icon: FiZap },
  { label: 'Veterinarias', icon: FiHeart },
  { label: 'Bares y restaurantes', icon: FiCoffee },
];

function IdealFor() {
  return (
    <section id="ideal-para" className={styles.sectionAlt}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Para todo tipo de comercio</span>
          <h2>Ideal para...</h2>
          <p>Cualquier negocio que cobre con Mercado Pago puede usarlo desde el primer día.</p>
        </Reveal>
        <div className={styles.businessGrid}>
          {businesses.map(({ label, icon: Icon }, i) => (
            <Reveal key={label} className={styles.businessCard} delay={i * 0.04}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const DEMO_TEXT = 'Se recibió un pago de ocho mil quinientos pesos.';

function AudioDemo() {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    trackEvent('audio_demo_play', { text: DEMO_TEXT });
    const utterance = new SpeechSynthesisUtterance(DEMO_TEXT);
    utterance.lang = 'es-AR';
    utterance.rate = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return (
    <section className={styles.section}>
      <Reveal className={styles.audioCard}>
        <div className={styles.audioLeft}>
          <span className={styles.sectionEyebrow}>Escuchalo vos mismo</span>
          <h2>Así suena una confirmación real</h2>
          <p>Probá la demo y escuchá exactamente lo que tu comercio escucharía al recibir un pago.</p>
          <button
            type="button"
            className={styles.audioPlayBtn}
            onClick={handlePlay}
            aria-pressed={playing}
            aria-label={playing ? 'Detener demo de audio' : 'Reproducir demo de audio'}
          >
            {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
            {playing ? 'Reproduciendo…' : 'Reproducir'}
          </button>
        </div>
        <div className={styles.audioRight}>
          <WaveBars active={playing} />
          <p className={styles.audioQuote}>&ldquo;{DEMO_TEXT}&rdquo;</p>
        </div>
      </Reveal>
    </section>
  );
}

const benefits = [
  { icon: FiZap, text: 'Cobrá más rápido' },
  { icon: FiShield, text: 'Evitá estafas' },
  { icon: FiClock, text: 'Ahorrá tiempo' },
  { icon: FiEyeOff, text: 'No revises más comprobantes' },
  { icon: FiVolume2, text: 'Escuchá cada pago automáticamente' },
  { icon: FiCheck, text: 'Confirmación en tiempo real' },
  { icon: FiRefreshCw, text: 'Funciona todo el día' },
  { icon: FiSmartphone, text: 'Instalación sencilla' },
];

function Benefits() {
  return (
    <section className={styles.sectionAlt}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Beneficios</span>
          <h2>Lo que ganás desde el primer pago</h2>
        </Reveal>
        <div className={styles.benefitsGrid}>
          {benefits.map(({ icon: Icon, text }, i) => (
            <Reveal key={text} className={styles.benefitCard} delay={i * 0.04}>
              <Icon aria-hidden="true" />
              <span>{text}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: 'María G.',
    role: 'Almacén de barrio',
    quote:
      'Antes revisaba cada comprobante con desconfianza. Ahora escucho el aviso y sigo atendiendo. Cambió el ritmo del local.',
  },
  {
    name: 'Diego R.',
    role: 'Kiosco 24 horas',
    quote:
      'De noche es imposible estar mirando el teléfono todo el tiempo. La voz avisa sola y eso me da tranquilidad.',
  },
  {
    name: 'Lucía P.',
    role: 'Local de ropa',
    quote: 'Dejé de aceptar capturas de pantalla. Si no suena la confirmación, el producto no sale del mostrador.',
  },
];

function Testimonials() {
  return (
    <section className={styles.section}>
      <Reveal className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Testimonios</span>
        <h2>Lo que dicen los comercios</h2>
        <p className={styles.testimonialDisclaimer}>
          Ejemplos demostrativos con fines ilustrativos — reemplazar por testimonios reales antes de publicar.
        </p>
      </Reveal>
      <div className={styles.testimonialsGrid}>
        {testimonials.map((t, i) => (
          <Reveal key={t.name} className={styles.testimonialCard} delay={i * 0.08}>
            <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.testimonialAvatar} aria-hidden="true">
                {t.name.charAt(0)}
              </span>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  {
    q: '¿Cómo detecta los pagos?',
    a: 'Validador MP consulta directamente los movimientos de tu cuenta de Mercado Pago para confirmar cuándo el dinero fue efectivamente acreditado.',
  },
  {
    q: '¿Necesito abrir Mercado Pago?',
    a: 'No. El sistema monitorea tu cuenta en segundo plano y te avisa por voz apenas detecta un ingreso real.',
  },
  {
    q: '¿Funciona automáticamente?',
    a: 'Sí. Una vez que configurás tu alias, el monitoreo y los avisos de voz funcionan sin intervención manual.',
  },
  {
    q: '¿Puedo usar parlantes?',
    a: 'Sí, podés conectar el dispositivo a un parlante para escuchar los avisos incluso en locales con ruido ambiente.',
  },
  {
    q: '¿Escucho todos los pagos?',
    a: 'Escuchás una confirmación por cada pago real acreditado en tu cuenta, con el monto correspondiente.',
  },
  {
    q: '¿Hay demora?',
    a: 'La confirmación se emite en el momento en que el sistema detecta el ingreso real del dinero.',
  },
  {
    q: '¿Qué pasa si cierro la página?',
    a: 'El monitoreo depende de que la sesión esté activa; te recomendamos mantenerla abierta en el dispositivo del mostrador.',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="preguntas-frecuentes" className={styles.sectionAlt}>
      <div className={styles.sectionInner}>
        <Reveal className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Preguntas frecuentes</span>
          <h2>Todo lo que necesitás saber</h2>
        </Reveal>
        <div className={styles.faqList}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} className={styles.faqItem} delay={i * 0.03}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  {item.q}
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <FiChevronDown aria-hidden="true" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className={styles.finalCta}>
      <div className={styles.finalCtaGlow} aria-hidden="true" />
      <Reveal className={styles.finalCtaContent}>
        <FiTrendingUp className={styles.finalCtaIcon} aria-hidden="true" />
        <h2>Empezá a confirmar pagos reales en segundos.</h2>
        <p>Configurá tu alias hoy y dejá de confiar en comprobantes.</p>
        <Link
          to="/register"
          className={styles.primaryBtn}
          onClick={() => trackEvent('cta_click', { location: 'final_cta', label: 'probar_ahora' })}
        >
          Probar ahora <FiArrowRight aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <span className={styles.navBrand}>
          <span className={styles.navBrandDot} aria-hidden="true" />
          Validador MP
        </span>
        <p>Confirmación de pagos reales para comercios que cobran con Mercado Pago.</p>
        <div className={styles.footerLinks}>
          <Link to="/login">Ingresar</Link>
          <Link to="/register">Crear cuenta</Link>
          <a href="#top">Volver arriba</a>
        </div>
        <p className={styles.footerCopy}>© {new Date().getFullYear()} Validador MP. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export const Landing = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Validador MP — Confirmación de pagos reales de Mercado Pago por voz';
    trackEvent('landing_view');
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className={styles.page}>
      <NavBar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyNotReceipts />
        <Comparison />
        <IdealFor />
        <AudioDemo />
        <Benefits />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
