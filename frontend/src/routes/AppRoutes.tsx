import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/ClientesNew";
import Veiculos from "../pages/Veiculos";
import OrdensServico from "../pages/OrdensServico";
import Login from "../pages/Login";

const AUTH_KEY = "oficina-auth";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_KEY));
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/clientes" element={<RequireAuth><Clientes /></RequireAuth>} />
        <Route path="/veiculos" element={<RequireAuth><Veiculos /></RequireAuth>} />
        <Route path="/ordens-servico" element={<RequireAuth><OrdensServico /></RequireAuth>} />
      </Routes>
    </Router>
  );
}
