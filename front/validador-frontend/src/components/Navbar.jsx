import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar-custom">
      <Link to="/" className="navbar-link">Inicio</Link>
      <Link to="/register" className="navbar-link">Registro</Link>
      <Link to="/login" className="navbar-link">Login</Link>
    </nav>
  )
}

export default Navbar
