import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Veiculos from "../pages/Veiculos";
import Ordens from "../pages/Ordens";
import OrdemServico from "../pages/OrdemServico";
import OrdensServico from "../pages/OrdensServico";
import Login from "../pages/Login";

const AUTH_KEY = "oficina-auth";

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthenticated = Boolean(localStorage.getItem(AUTH_KEY));
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/clientes" element={<RequireAuth><Clientes /></RequireAuth>} />
        <Route path="/veiculos" element={<RequireAuth><Veiculos /></RequireAuth>} />
        <Route path="/ordem-servico" element={<RequireAuth><OrdemServico /></RequireAuth>} />
        <Route path="/ordens" element={<RequireAuth><Ordens /></RequireAuth>} />
        <Route path="/consulta" element={<RequireAuth><Ordens /></RequireAuth>} />
        <Route path="/ordens-servico" element={<RequireAuth><OrdensServico /></RequireAuth>} />
      </Routes>
    </Router>
  );
}
