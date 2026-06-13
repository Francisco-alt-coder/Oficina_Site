import {
  Car,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Clientes", icon: Users, href: "/clientes" },
  { label: "Veículos", icon: Car, href: "/veiculos" },
  { label: "Ordem de Serviço", icon: ClipboardList, href: "/ordem-servico" },
  { label: "Consulta", icon: ClipboardList, href: "/ordens" },
];

type StoredUser = {
  nome?: string;
  name?: string;
  email?: string;
};

function parseStoredUser(value: string | null): StoredUser | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as StoredUser;
  } catch {
    return null;
  }
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedUser =
    parseStoredUser(localStorage.getItem("oficina-auth")) ||
    parseStoredUser(localStorage.getItem("user"));
  const userLabel =
    loggedUser?.nome || loggedUser?.name || loggedUser?.email || "Usuário logado";

  const handleLogout = () => {
    localStorage.removeItem("oficina-auth");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <Link to="/home" className="app-navbar-brand">
          <span className="app-navbar-logo">
            <Wrench size={20} />
          </span>
          <strong>Oficina Pro</strong>
        </Link>

        <nav className="app-navbar-links" aria-label="Menu principal">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={isActive ? "is-active" : ""}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-navbar-user-menu">
          <div className="app-navbar-user-trigger" title={userLabel}>
            <span>{userLabel}</span>
          </div>
          <button type="button" className="app-navbar-logout-button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Sair</span>
          </button>
        </div>

        <button
          type="button"
          className="app-navbar-menu"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="app-navbar-mobile">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={isActive ? "is-active" : ""}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="app-navbar-mobile-user">
            <strong title={userLabel}>{userLabel}</strong>
            <button type="button" onClick={handleLogout}>
              <LogOut size={17} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
