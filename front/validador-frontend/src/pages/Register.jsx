// src/pages/Register.jsx
import { useState } from 'react'

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const validate = () => {
        const newErrors = {}

        if (!form.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio'
        if (!form.email.includes('@')) newErrors.email = 'Correo inválido'
        if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length === 0) {
            console.log('Formulario válido:', form)
            // Acá luego se hace la petición al backend
        } else {
            setErrors(validationErrors)
        }
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Registro</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* Username */}
                <div className="mb-3">
                    <label className="form-label">Nombre de usuario</label>
                    <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={form.username}
                        onChange={handleChange}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                {/* Email */}
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

                {/* Password */}
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

                {/* Confirm Password */}
                <div className="mb-3">
                    <label className="form-label">Repetir contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary">Registrarse</button>
            </form>
        </div>
    )
}

export default Register
