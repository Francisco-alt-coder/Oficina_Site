import { ArrowRight, Car, ClipboardList, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useWorkshop } from "../contexts/WorkshopContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { clients, vehicles, ordersCount } = useWorkshop();

  const metrics = [
    {
      label: "Clientes cadastrados",
      value: clients.length.toString(),
      icon: Users,
      subtitle: "Base ativa de clientes",
    },
    {
      label: "Veículos cadastrados",
      value: vehicles.length.toString(),
      icon: Car,
      subtitle: "Veículos registrados",
    },
    {
      label: "Ordens abertas",
      value: ordersCount.toString(),
      icon: ClipboardList,
      subtitle: "Serviços em acompanhamento",
    },
  ];

  const shortcuts = [
    {
      label: "Clientes",
      description: "Cadastrar, consultar e acompanhar clientes.",
      icon: Users,
      path: "/clientes",
    },
    {
      label: "Veículos",
      description: "Registrar veículos e vincular ao cliente.",
      icon: Car,
      path: "/veiculos",
    },
    {
      label: "Ordens de Serviço",
      description: "Abrir e acompanhar serviços da oficina.",
      icon: ClipboardList,
      path: "/ordens-servico",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-hero">
            <div>
              <p className="dashboard-eyebrow">Oficina Pro</p>
              <h1>Dashboard</h1>
              <p>
                Visão geral da operação, cadastros recentes e atalhos para as
                principais rotinas da oficina.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/veiculos")}
              className="dashboard-primary-action"
            >
              Nova ordem
              <ArrowRight size={18} />
            </button>
          </header>

          <section className="dashboard-metrics" aria-label="Resumo da operação">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article key={metric.label} className="dashboard-metric-card">
                  <div>
                    <p>{metric.label}</p>
                    <strong>{metric.value}</strong>
                  </div>
                  <span className="dashboard-metric-icon">
                    <Icon size={24} />
                  </span>
                  <small>{metric.subtitle}</small>
                </article>
              );
            })}
          </section>

          <section className="dashboard-shortcuts" aria-label="Atalhos">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;

              return (
                <button
                  key={shortcut.path}
                  type="button"
                  onClick={() => navigate(shortcut.path)}
                  className="dashboard-shortcut-card"
                >
                  <div className="dashboard-shortcut-top">
                    <span>
                      <Icon size={24} />
                    </span>
                    <ArrowRight size={20} />
                  </div>

                  <strong>{shortcut.label}</strong>
                  <p>{shortcut.description}</p>
                </button>
              );
            })}
          </section>

          <section className="dashboard-lists" aria-label="Listagens recentes">
            <article className="dashboard-list-card">
              <div className="dashboard-list-header">
                <div>
                  <h2>Clientes recentes</h2>
                  <p>Últimos clientes adicionados ao sistema.</p>
                </div>
                <button type="button" onClick={() => navigate("/clientes")}>
                  Ver todos
                  <ArrowRight size={16} />
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="dashboard-empty">Nenhum cliente cadastrado ainda.</div>
              ) : (
                <div className="dashboard-list-items">
                  {clients.slice(0, 8).map((client) => (
                    <div key={client.id} className="dashboard-list-item">
                      <strong>{client.nome}</strong>
                      <span>{client.telefone}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="dashboard-list-card">
              <div className="dashboard-list-header">
                <div>
                  <h2>Veículos recentes</h2>
                  <p>Placas, modelos e vínculos cadastrados.</p>
                </div>
                <button type="button" onClick={() => navigate("/veiculos")}>
                  Ver todos
                  <ArrowRight size={16} />
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="dashboard-empty">Nenhum veículo cadastrado ainda.</div>
              ) : (
                <div className="dashboard-list-items">
                  {vehicles.slice(0, 8).map((vehicle) => (
                    <div key={vehicle.id} className="dashboard-list-item">
                      <div>
                        <strong>{vehicle.placa}</strong>
                        <span>
                          {vehicle.marca} {vehicle.modelo}
                        </span>
                      </div>
                      <em>{vehicle.status}</em>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
