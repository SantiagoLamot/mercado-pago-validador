import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Suscripcion from './pages/suscripcion/Suscripcion';
import Notificaciones from './pages/notificaciones/Notificaciones';
import Oauth from './pages/oauth/Oauth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/suscripcion" element={<Suscripcion />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/oauth" element={<Oauth />} />
      </Routes>
    </Router>
  );
}

export default App;

