import { ArrowRight, Car, ClipboardList, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

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

  const handleWhatsApp = () => {
    const whatsappNumber = "559991064104";
    const message =
      "Olá! Gostaria de conhecer o sistema Oficina Pro e obter mais informações.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <main className="home-page">
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
      <button
        type="button"
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#18bf56] shadow-xl shadow-green-500/30 transition-all hover:-translate-y-0.5 hover:bg-[#12a84a]"
        aria-label="Falar no WhatsApp"
      >
        <img
          src="/whatsapp.png"
          alt=""
          aria-hidden="true"
          className="h-12 w-12 rounded-full object-cover"
        />
      </button>
    </>
  );
}
