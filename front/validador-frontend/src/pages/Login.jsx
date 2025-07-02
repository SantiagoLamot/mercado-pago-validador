import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
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

    if (!form.email.includes('@')) newErrors.email = 'Correo inválido'
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length === 0) {
      // Simular login correcto
      setShowSuccess(true)

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } else {
      setErrors(validationErrors)
      setShowSuccess(false)
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Iniciar Sesión</h2>

      {/* ✅ Cartel de éxito */}
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          ¡Logueado correctamente! Redirigiendo al menú principal...
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  )
}

export default Login
