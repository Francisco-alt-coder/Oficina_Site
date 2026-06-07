import { ArrowRight, Car, ClipboardList, Grid2X2, Home as HomeIcon, LogIn, Users, Wrench } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const modulePreview = [
  {
    id: 1,
    title: "Clientes",
    icon: Users,
    description: "Cadastrar e gerenciar clientes da oficina.",
    href: "/clientes",
  },
  {
    id: 2,
    title: "Veículos",
    icon: Car,
    description: "Registrar veículos e acompanhar a frota.",
    href: "/veiculos",
  },
  {
    id: 3,
    title: "Ordens",
    icon: ClipboardList,
    description: "Gerenciar ordens de serviço.",
    href: "/ordens-servico",
  },
  {
    id: 4,
    title: "Dashboard",
    icon: Car,
    description: "Ver a visão geral da operação.",
    href: "/dashboard",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">
      <header className="home-public-header">
        <div className="home-public-nav">
          <a href="#inicio" className="home-public-brand" aria-label="Oficina Pro">
            <span>
              <Wrench size={28} />
            </span>
            <div>
              <strong>Oficina Pro</strong>
              <p>Gestão inteligente para oficinas</p>
            </div>
          </a>

          <nav className="home-public-links" aria-label="Navegação da página">
            <a href="#inicio" className="is-active">
              <HomeIcon size={20} />
              <span>Início</span>
            </a>
            <a href="#funcionalidades">
              <Grid2X2 size={20} />
              <span>Funcionalidades</span>
            </a>
          </nav>

          <button type="button" onClick={() => navigate("/")} className="home-login-link">
            <LogIn size={20} />
            <span>Entrar</span>
          </button>
        </div>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="home-eyebrow">Gestão inteligente para oficinas</p>
              <h1>Software de gestão claro, rápido e profissional.</h1>
              <p className="home-hero-text">
                Conecte clientes, veículos e ordens de serviço em um fluxo simples.
              </p>
            </div>

            <aside className="home-brand-panel" aria-label="Montadoras autorizadas">
              <h2>Oficina Autorizada</h2>
              <p>Atendimento especializado para as principais montadoras</p>

              <div className="home-brand-grid">
                <div className="home-brand-card">
                  <img src="/fiat.png" alt="Fiat" />
                  <span>AUTORIZADA</span>
                </div>

                <div className="home-brand-card">
                  <img src="/volkswagen.png" alt="Volkswagen" />
                  <span>AUTORIZADA</span>
                </div>

                <div className="home-brand-card">
                  <img src="/chevrolet.png" alt="Chevrolet" />
                  <span>AUTORIZADA</span>
                </div>

                <div className="home-brand-card">
                  <img src="/toyota.png" alt="Toyota" />
                  <span>AUTORIZADA</span>
                </div>
              </div>

              <div className="home-trust-note">
                <strong>Rede autorizada e especializada</strong>
                <span>Peças originais, profissionais certificados e garantia de qualidade.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-modules" id="funcionalidades">
        <div className="home-container">
          <div className="home-section-heading">
            <p className="home-eyebrow">Módulos integrados</p>
            <h2>Conheça cada módulo do sistema</h2>
            <p>Clique em qualquer módulo para explorar suas funcionalidades completas.</p>
          </div>

          <div className="home-module-grid">
            {modulePreview.map((module) => {
              const ModuleIcon = module.icon;

              return (
                <button
                  key={module.id}
                  onClick={() => navigate(module.href)}
                  className="home-module-card"
                >
                  <div>
                    <div className="home-module-icon">
                      <ModuleIcon size={24} />
                    </div>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </div>

                  <div className="home-module-link">
                    Explorar
                    <ArrowRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-container">
          <p className="home-footer-title">© 2026 Oficina Pro</p>
          <p>Software profissional para oficinas mecânicas.</p>
        </div>
      </footer>
    </main>
  );
}
