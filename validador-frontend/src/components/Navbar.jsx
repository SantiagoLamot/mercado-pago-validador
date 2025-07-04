import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Inicio</NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="custom-btn me-2">
                    Registro
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="custom-btn">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button onClick={handleLogout} className="custom-btn logout-btn">
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
