import { Fragment, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import {
  listarEmpresas,
  altaEmpresa,
  ajustarSuscripcion,
  cambiarEstadoEmpresa,
  resetearContrasenaEmpresa,
  historialSuscripcion,
} from '../../services/adminService';
import type { AltaEmpresaRequest, AltaEmpresaResponse, EmpresaResumen, SuscripcionMovimiento } from '../../types/admin';
import { Button, FormField, Alert } from '../ui';
import styles from './Admin.module.scss';

const INITIAL_FORM: AltaEmpresaRequest = {
  nombreDeUsuario: '',
  correo: '',
  nombre: '',
  apellido: '',
  nombreEmpresa: '',
};

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return fallback + (err.response?.data?.error ?? err.message);
  }
  return fallback + String(err);
};

export const AdminEmpresas = () => {
  const [empresas, setEmpresas] = useState<EmpresaResumen[]>([]);
  const [error, setError] = useState('');
  const [nuevaClave, setNuevaClave] = useState<AltaEmpresaResponse | null>(null);
  const [form, setForm] = useState<AltaEmpresaRequest>(INITIAL_FORM);
  const [historialAbiertoId, setHistorialAbiertoId] = useState<number | null>(null);
  const [historial, setHistorial] = useState<SuscripcionMovimiento[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const cargar = async () => {
    try {
      const data = await listarEmpresas();
      setEmpresas(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al cargar empresas: '));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const updateField = (field: keyof AltaEmpresaRequest) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAlta = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const resp = await altaEmpresa(form);
      setNuevaClave(resp);
      setForm(INITIAL_FORM);
      cargar();
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al dar de alta: '));
    }
  };

  const handleAjustarDias = async (id: number) => {
    const dias = window.prompt(
      'Días a sumar (ej: 30) o quitar (ej: -10) de la suscripción:',
      '30'
    );
    if (!dias) return;
    const diasNum = parseInt(dias, 10);
    if (Number.isNaN(diasNum) || diasNum === 0) return;
    try {
      await ajustarSuscripcion(id, { dias: diasNum });
      cargar();
      if (historialAbiertoId === id) {
        cargarHistorial(id);
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al ajustar suscripción: '));
    }
  };

  const cargarHistorial = async (id: number) => {
    setCargandoHistorial(true);
    try {
      const data = await historialSuscripcion(id);
      setHistorial(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al cargar historial: '));
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleToggleHistorial = (id: number) => {
    if (historialAbiertoId === id) {
      setHistorialAbiertoId(null);
      setHistorial([]);
      return;
    }
    setHistorialAbiertoId(id);
    cargarHistorial(id);
  };

  const handleToggleEstado = async (empresa: EmpresaResumen) => {
    try {
      await cambiarEstadoEmpresa(empresa.id, !empresa.activo);
      cargar();
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al cambiar estado: '));
    }
  };

  const handleResetPassword = async (empresa: EmpresaResumen) => {
    if (!window.confirm(`¿Generar una contraseña nueva para ${empresa.nombreEmpresa}? La actual dejará de funcionar.`)) {
      return;
    }
    try {
      const resp = await resetearContrasenaEmpresa(empresa.id);
      setNuevaClave(resp);
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al generar contraseña: '));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Empresas</h1>

      {error && <Alert variant="error">{error}</Alert>}
      {nuevaClave && (
        <Alert variant="info">
          Usuario <strong>{nuevaClave.nombreDeUsuario}</strong> — contraseña:{' '}
          <strong>{nuevaClave.contrasenaTemporal}</strong>
        </Alert>
      )}

      <form onSubmit={handleAlta} className={styles.form} noValidate>
        <h3>Alta manual de empresa</h3>
        <FormField
          id="admin-alta-username"
          label="Nombre de usuario"
          value={form.nombreDeUsuario}
          onChange={updateField('nombreDeUsuario')}
          required
        />
        <FormField
          id="admin-alta-correo"
          label="Correo"
          type="email"
          value={form.correo}
          onChange={updateField('correo')}
          required
        />
        <FormField
          id="admin-alta-nombre"
          label="Nombre"
          value={form.nombre}
          onChange={updateField('nombre')}
          required
        />
        <FormField
          id="admin-alta-apellido"
          label="Apellido"
          value={form.apellido}
          onChange={updateField('apellido')}
          required
        />
        <FormField
          id="admin-alta-empresa"
          label="Nombre de la empresa"
          value={form.nombreEmpresa}
          onChange={updateField('nombreEmpresa')}
          required
        />
        <Button type="submit" className={styles.submitButton}>
          Crear empresa
        </Button>
      </form>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Usuario</th>
              <th>Suscripción</th>
              <th>Cuenta MP</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <Fragment key={empresa.id}>
                <tr className={styles.dataRow}>
                  <td data-label="Empresa">{empresa.nombreEmpresa}</td>
                  <td data-label="Usuario">{empresa.nombreDeUsuario}</td>
                  <td data-label="Suscripción">
                    <span className={`${styles.badge} ${empresa.suscripcionActiva ? styles.ok : styles.warn}`}>
                      {empresa.suscripcionActiva ? 'Activa' : 'Vencida'}
                    </span>
                    {empresa.expiracionSuscripcion && (
                      <div className={styles.expiration}>
                        hasta {new Date(empresa.expiracionSuscripcion).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td data-label="Cuenta MP">
                    <span className={`${styles.badge} ${empresa.cuentaMpActiva ? styles.ok : styles.warn}`}>
                      {empresa.cuentaMpConectada ? (empresa.cuentaMpActiva ? 'Conectada' : 'Pausada') : 'Sin conectar'}
                    </span>
                  </td>
                  <td data-label="Estado">
                    <span className={`${styles.badge} ${empresa.activo ? styles.ok : styles.warn}`}>
                      {empresa.activo ? 'Activa' : 'Suspendida'}
                    </span>
                  </td>
                  <td data-label="Acciones" className={styles.rowActions}>
                    <Button variant="secondary" size="sm" onClick={() => handleAjustarDias(empresa.id)}>
                      Sumar/quitar días
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleEstado(empresa)}>
                      {empresa.activo ? 'Suspender' : 'Reactivar'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleResetPassword(empresa)}>
                      Nueva contraseña
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleHistorial(empresa.id)}>
                      {historialAbiertoId === empresa.id ? 'Ocultar historial' : 'Ver historial'}
                    </Button>
                  </td>
                </tr>
                {historialAbiertoId === empresa.id && (
                  <tr className={styles.historialRow}>
                    <td colSpan={6}>
                      {cargandoHistorial ? (
                        <p>Cargando historial...</p>
                      ) : historial.length === 0 ? (
                        <p>Todavía no hay movimientos de suscripción para esta empresa.</p>
                      ) : (
                        <div className={styles.tableScroll}>
                          <table className={`${styles.table} ${styles.historial}`}>
                            <thead>
                              <tr>
                                <th>Fecha</th>
                                <th>Origen</th>
                                <th>Días</th>
                                <th>Nueva expiración</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historial.map((mov) => (
                                <tr key={mov.id}>
                                  <td data-label="Fecha">{new Date(mov.creadoEn).toLocaleString()}</td>
                                  <td data-label="Origen">
                                    {mov.origen === 'PAGO_MP'
                                      ? 'Pago automático (Mercado Pago)'
                                      : `Admin: ${mov.adminNombre ?? 'desconocido'}`}
                                  </td>
                                  <td data-label="Días">
                                    {mov.dias === null ? '—' : mov.dias > 0 ? `+${mov.dias}` : mov.dias}
                                  </td>
                                  <td data-label="Nueva expiración">
                                    {mov.fechaExpiracionResultante
                                      ? new Date(mov.fechaExpiracionResultante).toLocaleDateString()
                                      : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
