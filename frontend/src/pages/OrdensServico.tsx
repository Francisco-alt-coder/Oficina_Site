import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useWorkshop } from "../contexts/WorkshopContext";

type Ordem = {
  id: string;
  cliente: string;
  veiculo: string;
  servico: string;
  status: "Em andamento" | "Finalizada" | "Pendente";
  valor: string;
  data: string;
};

const initialOrdens: Ordem[] = [
  {
    id: "OS-001",
    cliente: "João Silva",
    veiculo: "Toyota Corolla",
    servico: "Revisão completa",
    status: "Em andamento",
    valor: "R$ 450",
    data: "2026-06-04",
  },
  {
    id: "OS-002",
    cliente: "Maria Santos",
    veiculo: "Honda Civic",
    servico: "Troca de óleo",
    status: "Finalizada",
    valor: "R$ 320",
    data: "2026-06-02",
  },
  {
    id: "OS-003",
    cliente: "Pedro Costa",
    veiculo: "Chevrolet Onix",
    servico: "Alinhamento e balanceamento",
    status: "Pendente",
    valor: "R$ 280",
    data: "2026-06-05",
  },
];

export default function OrdensServico() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ordens, setOrdens] = useState<Ordem[]>(initialOrdens);
  const [editingOrder, setEditingOrder] = useState<Ordem | null>(null);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const { orders } = useWorkshop();

  const contextOrders: Ordem[] = orders.map((order) => ({
    id: order.id,
    cliente: order.clienteNome,
    veiculo: `${order.placa} - ${order.modelo}`,
    servico: order.servico,
    status: order.status === "Concluída" ? "Finalizada" : "Em andamento",
    valor: "R$ 0",
    data: order.createdAt.slice(0, 10),
  }));

  const allOrders = [...contextOrders, ...ordens];

  const filtered = allOrders.filter(
    (ordem) =>
      ordem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.veiculo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteOrder = (ordem: Ordem) => {
    const shouldDelete = window.confirm(`Excluir a ordem ${ordem.id}?`);
    if (!shouldDelete) return;

    setOrdens((current) => current.filter((item) => item.id !== ordem.id));
    setFeedback(`Ordem ${ordem.id} excluída.`);
    window.setTimeout(() => setFeedback(""), 3000);
  };

  const saveOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingOrder) return;

    setOrdens((current) =>
      current.map((item) => (item.id === editingOrder.id ? editingOrder : item))
    );
    setFeedback(`Ordem ${editingOrder.id} atualizada.`);
    setEditingOrder(null);
    window.setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <>
      <Navbar />
      <main className="orders-page">
        <div className="orders-container">
          <header className="orders-header">
            <div>
              <h1>Ordens de Serviço</h1>
              <p>Acompanhe todas as ordens cadastradas</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/veiculos")}
              className="orders-primary-action"
            >
              <Plus size={20} />
              <span>Nova Ordem</span>
            </button>
          </header>

          <div className="orders-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por OS, cliente ou veículo..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {feedback && <div className="orders-feedback">{feedback}</div>}

          <section className="orders-table-card" aria-label="Tabela de ordens">
            <div className="orders-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>OS</th>
                    <th>Cliente</th>
                    <th>Veículo</th>
                    <th>Serviço</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ordem) => (
                    <tr key={ordem.id}>
                      <td>
                        <strong>{ordem.id}</strong>
                      </td>
                      <td>{ordem.cliente}</td>
                      <td>{ordem.veiculo}</td>
                      <td>{ordem.servico}</td>
                      <td>
                        <span className={`orders-status ${ordem.status}`}>
                          {ordem.status}
                        </span>
                      </td>
                      <td>
                        <strong>{ordem.valor}</strong>
                      </td>
                      <td>
                        <div className="orders-actions">
                          <button
                            type="button"
                            onClick={() => setEditingOrder(ordem)}
                            aria-label={`Editar ${ordem.id}`}
                          >
                            <Edit size={17} />
                          </button>
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => deleteOrder(ordem)}
                            aria-label={`Excluir ${ordem.id}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="orders-mobile-list" aria-label="Lista de ordens">
            {filtered.map((ordem) => (
              <article key={ordem.id} className="orders-mobile-card">
                <div className="orders-mobile-top">
                  <strong>{ordem.id}</strong>
                  <span className={`orders-status ${ordem.status}`}>{ordem.status}</span>
                </div>

                <dl>
                  <div>
                    <dt>Cliente</dt>
                    <dd>{ordem.cliente}</dd>
                  </div>
                  <div>
                    <dt>Veículo</dt>
                    <dd>{ordem.veiculo}</dd>
                  </div>
                  <div>
                    <dt>Serviço</dt>
                    <dd>{ordem.servico}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{ordem.valor}</dd>
                  </div>
                </dl>

                <div className="orders-actions">
                  <button
                    type="button"
                    onClick={() => setEditingOrder(ordem)}
                    aria-label={`Editar ${ordem.id}`}
                  >
                    <Edit size={17} />
                  </button>
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() => deleteOrder(ordem)}
                    aria-label={`Excluir ${ordem.id}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </section>

          {filtered.length === 0 && (
            <div className="orders-empty">Nenhuma ordem de serviço encontrada</div>
          )}
        </div>
      </main>

      {editingOrder && (
        <div className="orders-modal-backdrop" role="dialog" aria-modal="true">
          <form className="orders-modal" onSubmit={saveOrder}>
            <div className="orders-modal-header">
              <div>
                <h2>Editar {editingOrder.id}</h2>
                <p>Atualize os dados da ordem de serviço.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                aria-label="Fechar edição"
              >
                <X size={20} />
              </button>
            </div>

            <div className="orders-modal-fields">
              <label>
                <span>Cliente</span>
                <input
                  value={editingOrder.cliente}
                  onChange={(event) =>
                    setEditingOrder((current) =>
                      current ? { ...current, cliente: event.target.value } : current
                    )
                  }
                />
              </label>

              <label>
                <span>Veículo</span>
                <input
                  value={editingOrder.veiculo}
                  onChange={(event) =>
                    setEditingOrder((current) =>
                      current ? { ...current, veiculo: event.target.value } : current
                    )
                  }
                />
              </label>

              <label>
                <span>Serviço</span>
                <input
                  value={editingOrder.servico}
                  onChange={(event) =>
                    setEditingOrder((current) =>
                      current ? { ...current, servico: event.target.value } : current
                    )
                  }
                />
              </label>

              <label>
                <span>Status</span>
                <select
                  value={editingOrder.status}
                  onChange={(event) =>
                    setEditingOrder((current) =>
                      current
                        ? { ...current, status: event.target.value as Ordem["status"] }
                        : current
                    )
                  }
                >
                  <option>Em andamento</option>
                  <option>Finalizada</option>
                  <option>Pendente</option>
                </select>
              </label>

              <label>
                <span>Valor</span>
                <input
                  value={editingOrder.valor}
                  onChange={(event) =>
                    setEditingOrder((current) =>
                      current ? { ...current, valor: event.target.value } : current
                    )
                  }
                />
              </label>
            </div>

            <div className="orders-modal-actions">
              <button type="button" onClick={() => setEditingOrder(null)}>
                Cancelar
              </button>
              <button type="submit">Salvar alterações</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
