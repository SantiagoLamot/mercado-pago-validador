import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Register.css'

const Register = () => {
  const [form, setForm] = useState({
    nombreDeUsuario: '',
    correo: '',
    contrasena: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    empresa: ''
  })

  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    const newErrors = {}

    if (!form.nombreDeUsuario.trim()) newErrors.nombreDeUsuario = 'El nombre de usuario es obligatorio'
    if (!form.correo.includes('@')) newErrors.correo = 'Correo inválido'
    if (form.contrasena.length < 6) newErrors.contrasena = 'Mínimo 6 caracteres'
    if (form.contrasena !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
    if (!form.apellido.trim()) newErrors.apellido = 'El apellido es obligatorio'
    if (!form.empresa.trim()) newErrors.empresa = 'La empresa es obligatoria'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:8080/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombreDeUsuario: form.nombreDeUsuario,
            correo: form.correo,
            contrasena: form.contrasena,
            nombre: form.nombre,
            apellido: form.apellido,
            empresa: form.empresa
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error en el registro')
        }

        setShowSuccess(true)
        setTimeout(() => navigate('/'), 1500)

      } catch (err) {
        setErrors({ general: err.message })
        setShowSuccess(false)
      }
    } else {
      setErrors(validationErrors)
      setShowSuccess(false)
    }
  }

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>

      {showSuccess && (
        <div className="alert alert-success">
          ¡Registrado con éxito! Redirigiendo al menú principal...
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="nombreDeUsuario"
            className={`form-control ${errors.nombreDeUsuario ? 'is-invalid' : ''}`}
            value={form.nombreDeUsuario}
            onChange={handleChange}
          />
          {errors.nombreDeUsuario && <div className="invalid-feedback">{errors.nombreDeUsuario}</div>}
        </div>

        <div className="form-group">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            value={form.correo}
            onChange={handleChange}
          />
          {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            className={`form-control ${errors.contrasena ? 'is-invalid' : ''}`}
            value={form.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
        </div>

        <div className="form-group">
          <label>Repetir contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            value={form.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
            value={form.apellido}
            onChange={handleChange}
          />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
        </div>

        <div className="form-group">
          <label>Empresa</label>
          <input
            type="text"
            name="empresa"
            className={`form-control ${errors.empresa ? 'is-invalid' : ''}`}
            value={form.empresa}
            onChange={handleChange}
          />
          {errors.empresa && <div className="invalid-feedback">{errors.empresa}</div>}
        </div>

        <button type="submit" className="btn-register">Registrarse</button>
      </form>
    </div>
  )
}

export default Register
