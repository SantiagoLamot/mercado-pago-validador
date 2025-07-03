import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [form, setForm] = useState({
    nombreDeUsuario: '',
    contrasena: ''
  })

  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.nombreDeUsuario) newErrors.nombreDeUsuario = 'Usuario obligatorio'
    if (form.contrasena.length < 6) newErrors.contrasena = 'Mínimo 6 caracteres'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error en login')
        }

        const data = await response.json()
        localStorage.setItem('token', data.token)

        setShowSuccess(true)

        setTimeout(() => {
          navigate('/')
        }, 1500)
      } catch (err) {
        console.error(err)
        setApiError(err.message)
        setShowSuccess(false)
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(validationErrors)
      setShowSuccess(false)
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>

      {loading && (
        <div className="alert alert-info">
          Procesando login...
        </div>
      )}

      {showSuccess && (
        <div className="alert alert-success">
          ¡Logueado correctamente! Redirigiendo al menú principal...
        </div>
      )}

      {apiError && (
        <div className="alert alert-error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="nombreDeUsuario"
            className={errors.nombreDeUsuario ? 'input-error' : ''}
            value={form.nombreDeUsuario}
            onChange={handleChange}
          />
          {errors.nombreDeUsuario && <div className="invalid-feedback">{errors.nombreDeUsuario}</div>}
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            className={errors.contrasena ? 'input-error' : ''}
            value={form.contrasena}
            onChange={handleChange}
          />
          {errors.contrasena && <div className="invalid-feedback">{errors.contrasena}</div>}
        </div>

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default Login
