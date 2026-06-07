import {
  Car,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle,
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
  { label: "Ordens", icon: ClipboardList, href: "/ordens-servico" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = localStorage.getItem("oficina-auth");
  const loggedUser = session ? JSON.parse(session) as { email?: string } : null;

  const handleLogout = () => {
    localStorage.removeItem("oficina-auth");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/");
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

        <nav className="app-navbar-links">
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

        <div className="app-navbar-actions">
          {loggedUser && (
            <div className="app-navbar-user" title={loggedUser.email || "Usuário logado"}>
              <UserCircle size={20} />
              <span>{loggedUser.email || "Logado"}</span>
            </div>
          )}
          <Link to="/home" className="app-navbar-home">
            Início
          </Link>
          <button type="button" onClick={handleLogout} className="app-navbar-logout">
            <LogOut size={18} />
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

          <Link to="/home" onClick={() => setMobileOpen(false)}>
            Início
          </Link>
          {loggedUser && (
            <div className="app-navbar-mobile-user">
              <UserCircle size={18} />
              <span>{loggedUser.email || "Usuário logado"}</span>
            </div>
          )}
          <button type="button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </header>
  );
}
