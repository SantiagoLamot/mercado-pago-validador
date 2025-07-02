import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Inicio</Link>
      <Link to="/register" style={{ marginRight: '1rem' }}>Registro</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}

export default Navbar
