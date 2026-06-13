import {
  Copy,
  Edit3,
  Eye,
  Filter,
  MoreVertical,
  Printer,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useWorkshop, WorkOrder } from "../contexts/WorkshopContext";

type OrderStatus = "Aberta" | "Em andamento" | "Pendente" | "Concluída" | "Finalizada" | "Cancelada";
type OrderPriority = "Normal" | "Alta" | "Urgente";

type ServiceOrder = {
  id: string;
  source?: "context" | "example";
  cliente: string;
  telefone: string;
  veiculo: string;
  quilometragem: string;
  problema: string;
  observacoes: string;
  status: OrderStatus;
  prioridade: OrderPriority;
  abertura: string;
  fechamento: string;
};

type ModalType = "details" | "edit" | "status" | "delete" | null;
type ActiveTab = "Detalhes";
type MenuPosition = { left: number; top: number };

const CONSULTA_EXAMPLE_ORDERS_KEY = "oficina-consulta-example-orders";

const EXAMPLE_ORDERS: ServiceOrder[] = [
  {
    id: "OS-0007",
    cliente: "João Silva",
    telefone: "(11) 98765-4321",
    veiculo: "ABC1D23 Fiat Argo 2020",
    quilometragem: "42.350 km",
    problema: "Barulho na suspensão dianteira",
    observacoes: "Cliente relatou barulho ao passar por lombadas.",
    status: "Em andamento",
    prioridade: "Alta",
    abertura: "12/06/2026 10:45",
    fechamento: "Ainda não finalizada",
  },
  {
    id: "OS-0006",
    cliente: "Maria Souza",
    telefone: "(11) 97654-3210",
    veiculo: "XYZ9E87 Volkswagen Gol 2018",
    quilometragem: "68.120 km",
    problema: "Revisão geral e troca de óleo",
    observacoes: "Verificar filtros e completar fluidos antes da entrega.",
    status: "Aberta",
    prioridade: "Normal",
    abertura: "12/06/2026 09:30",
    fechamento: "Ainda não finalizada",
  },
  {
    id: "OS-0005",
    cliente: "Pedro Santos",
    telefone: "(11) 96543-2109",
    veiculo: "QWE5F45 Chevrolet Onix 2021",
    quilometragem: "35.890 km",
    problema: "Falha ao ligar o veículo",
    observacoes: "Cliente informou que a falha ocorre principalmente pela manhã.",
    status: "Pendente",
    prioridade: "Alta",
    abertura: "11/06/2026 16:20",
    fechamento: "Ainda não finalizada",
  },
  {
    id: "OS-0004",
    cliente: "Carlos Oliveira",
    telefone: "(11) 95432-1098",
    veiculo: "RTY2G34 Toyota Corolla 2022",
    quilometragem: "51.700 km",
    problema: "Troca de pastilhas de freio",
    observacoes: "Pastilhas dianteiras com desgaste acentuado.",
    status: "Concluída",
    prioridade: "Normal",
    abertura: "10/06/2026 14:15",
    fechamento: "11/06/2026",
  },
];

function readStoredExampleOrders() {
  const storedOrders = window.localStorage.getItem(CONSULTA_EXAMPLE_ORDERS_KEY);

  if (storedOrders === null) {
    return EXAMPLE_ORDERS;
  }

  try {
    return JSON.parse(storedOrders) as ServiceOrder[];
  } catch {
    return EXAMPLE_ORDERS;
  }
}

const statusOptions: Array<"Todos" | OrderStatus> = [
  "Todos",
  "Aberta",
  "Em andamento",
  "Pendente",
  "Concluída",
  "Finalizada",
  "Cancelada",
];

const priorityOptions: Array<"Todas" | OrderPriority> = [
  "Todas",
  "Normal",
  "Alta",
  "Urgente",
];

export default function Ordens() {
  const {
    orders: contextOrders,
    updateOrder: updateContextOrder,
    deleteOrder: deleteContextOrder,
  } = useWorkshop();
  const [exampleOrders, setExampleOrders] = useState<ServiceOrder[]>(readStoredExampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("Todos");
  const [priority, setPriority] = useState<(typeof priorityOptions)[number]>("Todas");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Detalhes");
  const [editForm, setEditForm] = useState<ServiceOrder | null>(null);
  const [statusDraft, setStatusDraft] = useState<OrderStatus>("Aberta");
  const [printOrder, setPrintOrder] = useState<ServiceOrder | null>(null);

  const contextServiceOrders = useMemo(
    () => contextOrders.map(mapWorkOrderToServiceOrder),
    [contextOrders]
  );

  const orders = useMemo(
    () => [...contextServiceOrders, ...exampleOrders],
    [contextServiceOrders, exampleOrders]
  );

  useEffect(() => {
    window.localStorage.setItem(
      CONSULTA_EXAMPLE_ORDERS_KEY,
      JSON.stringify(exampleOrders)
    );
  }, [exampleOrders]);

  const closeModal = () => {
    setSelectedOrder(null);
    setEditForm(null);
    setModalType(null);
    setActiveTab("Detalhes");
    setStatusDraft("Aberta");
  };

  const openModal = (order: ServiceOrder, type: Exclude<ModalType, null>) => {
    setSelectedOrder(order);
    setOpenMenuId(null);
    setMenuPosition(null);
    setModalType(type);
    setActiveTab("Detalhes");
    setEditForm(type === "edit" ? { ...order } : null);
    setStatusDraft(order.status);
  };

  const updateEditForm = (field: keyof ServiceOrder, value: string) => {
    setEditForm((current) => (current ? { ...current, [field]: value } : current));
  };

  const saveEditedOrder = () => {
    if (!editForm) {
      return;
    }

    if (editForm.source === "context") {
      updateContextOrder(editForm.id, {
        clienteNome: editForm.cliente,
        problema: editForm.problema,
        servico: editForm.observacoes
          ? `${editForm.problema}\n\nObservações: ${editForm.observacoes}`
          : editForm.problema,
        observacoes: editForm.observacoes,
        prioridade: editForm.prioridade,
        status: editForm.status,
      });
    } else {
      setExampleOrders((current) =>
        current.map((order) => (order.id === editForm.id ? { ...editForm } : order))
      );
    }
    closeModal();
  };

  const saveStatus = () => {
    if (!selectedOrder) {
      return;
    }

    if (selectedOrder.source === "context") {
      updateContextOrder(selectedOrder.id, { status: statusDraft });
    } else {
      setExampleOrders((current) =>
        current.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: statusDraft,
                fechamento: isFinishedStatus(statusDraft)
                  ? order.fechamento === "Ainda não finalizada"
                    ? formatCurrentDateTime()
                    : order.fechamento
                  : order.fechamento,
              }
            : order
        )
      );
    }
    closeModal();
  };

  const duplicateOrder = (order: ServiceOrder) => {
    const nextNumber =
      Math.max(
        ...orders.map((currentOrder) => Number(currentOrder.id.replace(/\D/g, "")) || 0)
      ) + 1;

    const duplicatedOrder: ServiceOrder = {
      ...order,
      id: `OS-${String(nextNumber).padStart(4, "0")}`,
      source: "example",
      status: "Aberta",
      abertura: formatCurrentDateTime(),
      fechamento: "Ainda não finalizada",
    };

    setExampleOrders((current) => [duplicatedOrder, ...current]);
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const deleteOrder = () => {
    if (!selectedOrder) {
      return;
    }

    const confirmDelete = window.confirm("Deseja excluir esta ordem de serviço?");

    if (!confirmDelete) {
      return;
    }

    if (selectedOrder.source === "context") {
      deleteContextOrder(selectedOrder.id);
    } else {
      setExampleOrders((current) => {
        const updatedOrders = current.filter((order) => order.id !== selectedOrder.id);
        window.localStorage.setItem(
          CONSULTA_EXAMPLE_ORDERS_KEY,
          JSON.stringify(updatedOrders)
        );
        return updatedOrders;
      });
    }
    closeModal();
  };

  const printServiceOrder = (order: ServiceOrder) => {
    setPrintOrder(order);
    setOpenMenuId(null);
    setMenuPosition(null);
    window.setTimeout(() => {
      window.print();
    }, 0);
  };

  const toggleMenu = (orderId: string, button: HTMLButtonElement) => {
    if (openMenuId === orderId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }

    const rect = button.getBoundingClientRect();
    const menuWidth = 224;
    const left = Math.max(16, Math.min(window.innerWidth - menuWidth - 16, rect.right - menuWidth));
    const top = rect.bottom + 8;

    setOpenMenuId(orderId);
    setMenuPosition({ left, top });
  };

  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    if (!modalType) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalType]);

  useEffect(() => {
    if (!openMenuId) {
      return;
    }

    const closeMenu = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [openMenuId]);

  useEffect(() => {
    const clearPrintOrder = () => {
      setPrintOrder(null);
    };

    window.addEventListener("afterprint", clearPrintOrder);

    return () => {
      window.removeEventListener("afterprint", clearPrintOrder);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.cliente.toLowerCase().includes(query);
      const matchesStatus = status === "Todos" || order.status === status;
      const matchesPriority = priority === "Todas" || order.prioridade === priority;
      const matchesPeriod = isWithinPeriod(order.abertura, startDate, endDate);

      return matchesSearch && matchesStatus && matchesPriority && matchesPeriod;
    });
  }, [endDate, orders, priority, searchTerm, startDate, status]);

  const openMenuOrder = orders.find((order) => order.id === openMenuId) ?? null;

  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="orders-consult-page print:hidden">
        <div className="orders-consult-container">
          <header className="orders-consult-header">
            <h1>Consulta de Ordens de Serviço</h1>
            <p>Pesquise e acompanhe todas as ordens de serviço cadastradas.</p>
          </header>

          <section className="orders-consult-filters" aria-label="Filtros de ordens">
            <label className="orders-consult-search">
              <span>Busca</span>
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por número ou cliente..."
              />
            </label>

            <label>
              <span>Status</span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as (typeof statusOptions)[number])
                }
              >
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Prioridade</span>
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as (typeof priorityOptions)[number])
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Data inicial</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>

            <label>
              <span>Data final</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>

            <button type="button" className="orders-consult-filter-button">
              <Filter size={18} />
              <span>Filtrar</span>
            </button>
          </section>

          <section className="orders-consult-table-card" aria-label="Ordens de serviço">
            <div className="orders-consult-table-wrap">
              <table className="orders-consult-table">
                <thead>
                  <tr>
                    <th>Nº da OS</th>
                    <th>Cliente</th>
                    <th>Veículo</th>
                    <th>Problema Relatado</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Abertura</th>
                    <th>Fechamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.cliente}</td>
                      <td>
                        <span className="orders-consult-vehicle">{order.veiculo}</span>
                      </td>
                      <td>{order.problema}</td>
                      <td>
                        <span className={`orders-consult-status ${statusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`orders-consult-priority ${priorityClass(
                            order.prioridade
                          )}`}
                        >
                          {order.prioridade}
                        </span>
                      </td>
                      <td>{order.abertura}</td>
                      <td>{order.fechamento}</td>
                      <td>
                        <div className="orders-consult-actions">
                          <button
                            type="button"
                            aria-label={`Visualizar ${order.id}`}
                            onClick={() => openModal(order, "details")}
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Mais opções de ${order.id}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleMenu(order.id, event.currentTarget);
                            }}
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="orders-consult-footer">
              Mostrando {filteredOrders.length} de {orders.length} ordens de serviço
            </footer>
          </section>
        </div>
      </main>

      {openMenuOrder && menuPosition ? (
        <div
          className="fixed z-40 w-56 rounded-lg border border-slate-200 bg-white py-2 text-left shadow-xl print:hidden"
          style={{ left: menuPosition.left, top: menuPosition.top }}
          onClick={(event) => event.stopPropagation()}
        >
          <ActionMenuButton
            icon={<Eye size={18} />}
            label="Visualizar OS"
            onClick={() => openModal(openMenuOrder, "details")}
          />
          <ActionMenuButton
            icon={<Edit3 size={18} />}
            label="Editar OS"
            onClick={() => openModal(openMenuOrder, "edit")}
          />
          <ActionMenuButton
            icon={<RefreshCcw size={18} />}
            label="Atualizar Status"
            onClick={() => openModal(openMenuOrder, "status")}
          />
          <ActionMenuButton
            icon={<Printer size={18} />}
            label="Imprimir OS"
            onClick={() => printServiceOrder(openMenuOrder)}
          />
          <ActionMenuButton
            icon={<Copy size={18} />}
            label="Duplicar OS"
            onClick={() => duplicateOrder(openMenuOrder)}
          />
          <ActionMenuButton
            icon={<Trash2 size={18} />}
            label="Excluir OS"
            danger
            onClick={() => openModal(openMenuOrder, "delete")}
          />
        </div>
      ) : null}

      {selectedOrder && modalType ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={handleOverlayMouseDown}
        >
          <section
            className="flex max-h-[92vh] w-full max-w-[860px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex min-h-[76px] items-center justify-between px-5 sm:px-6">
              <h2
                id="order-details-title"
                className="text-xl font-black tracking-normal text-slate-950"
              >
                {selectedOrder.id}
              </h2>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                aria-label="Fechar detalhes da ordem"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            {modalType === "details" ? (
              <>
                <div className="border-b border-slate-200 px-5 sm:px-6">
                  <div className="flex gap-2 overflow-x-auto">
                    <button
                      type="button"
                      className="border-b-2 border-blue-600 px-4 py-3 text-sm font-black text-blue-600"
                      onClick={() => setActiveTab("Detalhes")}
                    >
                      {activeTab}
                    </button>
                  </div>
                </div>

                <OrderDetails order={selectedOrder} />
              </>
            ) : null}

            {modalType === "edit" && editForm ? (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ModalField
                    label="Cliente"
                    value={editForm.cliente}
                    onChange={(value) => updateEditForm("cliente", value)}
                  />
                  <ModalField
                    label="Veículo"
                    value={editForm.veiculo}
                    onChange={(value) => updateEditForm("veiculo", value)}
                  />
                  <label className="grid gap-2 text-sm font-black text-slate-950">
                    Status
                    <select
                      className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-950"
                      value={editForm.status}
                      onChange={(event) =>
                        updateEditForm("status", event.target.value as OrderStatus)
                      }
                    >
                      {statusOptions.slice(1).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-black text-slate-950">
                    Prioridade
                    <select
                      className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-950"
                      value={editForm.prioridade}
                      onChange={(event) =>
                        updateEditForm("prioridade", event.target.value as OrderPriority)
                      }
                    >
                      {priorityOptions.slice(1).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-black text-slate-950 sm:col-span-2">
                    Problema Relatado
                    <textarea
                      className="min-h-24 rounded-lg border border-slate-300 p-3 text-sm font-medium text-slate-950"
                      value={editForm.problema}
                      onChange={(event) => updateEditForm("problema", event.target.value)}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-slate-950 sm:col-span-2">
                    Observações
                    <textarea
                      className="min-h-24 rounded-lg border border-slate-300 p-3 text-sm font-medium text-slate-950"
                      value={editForm.observacoes}
                      onChange={(event) =>
                        updateEditForm("observacoes", event.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-slate-300 px-5 font-black text-slate-700 transition hover:border-slate-400"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-blue-600 px-5 font-black text-white shadow-sm transition hover:bg-blue-700"
                    onClick={saveEditedOrder}
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            ) : null}

            {modalType === "status" ? (
              <div className="p-5 sm:p-6">
                <label className="grid gap-2 text-sm font-black text-slate-950">
                  Novo status
                  <select
                    className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-950"
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value as OrderStatus)}
                  >
                    {statusOptions.slice(1).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-slate-300 px-5 font-black text-slate-700 transition hover:border-slate-400"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-blue-600 px-5 font-black text-white shadow-sm transition hover:bg-blue-700"
                    onClick={saveStatus}
                  >
                    Atualizar status
                  </button>
                </div>
              </div>
            ) : null}

            {modalType === "delete" ? (
              <div className="p-5 sm:p-6">
                <p className="text-sm leading-6 text-slate-600">
                  Tem certeza que deseja excluir a ordem{" "}
                  <strong className="text-slate-950">{selectedOrder.id}</strong>? Essa ação
                  removerá a OS da lista.
                </p>
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-slate-300 px-5 font-black text-slate-700 transition hover:border-slate-400"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg bg-red-600 px-5 font-black text-white shadow-sm transition hover:bg-red-700"
                    onClick={deleteOrder}
                  >
                    Excluir OS
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      {printOrder ? <PrintableOrder order={printOrder} /> : null}
    </>
  );
}

function ActionMenuButton({
  danger,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition hover:bg-slate-50 ${
        danger ? "text-red-600" : "text-slate-950"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function OrderDetails({ order }: { order: ServiceOrder }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6">
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-200 px-4 py-4 text-base font-black text-slate-950">
          Informações Gerais
        </h3>
        <dl className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2">
          <DetailItem label="Cliente" value={order.cliente} />
          <DetailItem label="Telefone" value={order.telefone} />
          <DetailItem label="Veículo" value={order.veiculo} />
          <DetailItem label="Quilometragem" value={order.quilometragem} />
          <DetailItem label="Data de abertura" value={order.abertura} />
          <DetailItem label="Data de fechamento" value={order.fechamento} />
          <div>
            <dt className="mb-2 text-sm font-semibold text-slate-500">Status</dt>
            <dd>
              <span className={`orders-consult-status ${statusClass(order.status)}`}>
                {order.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="mb-2 text-sm font-semibold text-slate-500">Prioridade</dt>
            <dd>
              <span className={`orders-consult-priority ${priorityClass(order.prioridade)}`}>
                {order.prioridade}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-black text-slate-950">Problema Relatado</h3>
        <p className="text-sm leading-6 text-slate-950">{order.problema}</p>
      </section>

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-black text-slate-950">Observações</h3>
        <p className="text-sm leading-6 text-slate-950">{order.observacoes}</p>
      </section>
    </div>
  );
}

function ModalField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-950">
      {label}
      <input
        className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function PrintableOrder({ order }: { order: ServiceOrder }) {
  return (
    <section className="hidden p-10 text-slate-950 print:block">
      <h1 className="text-3xl font-black">Ordem de Serviço {order.id}</h1>
      <div className="mt-8 grid grid-cols-2 gap-5 text-base">
        <PrintItem label="Cliente" value={order.cliente} />
        <PrintItem label="Veículo" value={order.veiculo} />
        <PrintItem label="Problema" value={order.problema} />
        <PrintItem label="Status" value={order.status} />
        <PrintItem label="Prioridade" value={order.prioridade} />
        <PrintItem label="Abertura" value={order.abertura} />
        <PrintItem label="Fechamento" value={order.fechamento} />
      </div>
    </section>
  );
}

function PrintItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 text-sm font-semibold text-slate-500">{label}</dt>
      <dd className="text-sm font-medium leading-6 text-slate-950">{value}</dd>
    </div>
  );
}

function mapWorkOrderToServiceOrder(order: WorkOrder): ServiceOrder {
  return {
    id: order.id,
    source: "context",
    cliente: order.clienteNome,
    telefone: "-",
    veiculo: `${order.placa} ${order.marca} ${order.modelo} ${order.ano}`.trim(),
    quilometragem: formatKm(order.quilometragem),
    problema: order.problema,
    observacoes: order.observacoes || "-",
    status: normalizeOrderStatus(order.status),
    prioridade: order.prioridade,
    abertura: formatOrderDateTime(order.dataAbertura || order.createdAt),
    fechamento: order.dataFechamento
      ? formatOrderDateTime(order.dataFechamento)
      : "Ainda não finalizada",
  };
}

function normalizeOrderStatus(status: WorkOrder["status"]): OrderStatus {
  if (status === "Aguardando peça") return "Pendente";
  if (status === "Finalizada") return "Finalizada";
  if (status === "Concluída") return "Concluída";
  if (status === "Cancelada") return "Cancelada";
  if (status === "Pendente") return "Pendente";
  if (status === "Em andamento") return "Em andamento";
  return "Aberta";
}

function isFinishedStatus(status: OrderStatus) {
  return status === "Concluída" || status === "Finalizada";
}

function isWithinPeriod(value: string, startDate: string, endDate: string) {
  if (!startDate && !endDate) return true;

  const orderDate = parseOrderDate(value);
  if (!orderDate) return false;

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (orderDate < start) return false;
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59`);
    if (orderDate > end) return false;
  }

  return true;
}

function parseOrderDate(value: string) {
  if (!value) return null;

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) return directDate;

  const match = value.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:,?\s+(\d{2}):(\d{2}))?/
  );
  if (!match) return null;

  const [, day, month, year, hour = "00", minute = "00"] = match;
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatOrderDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatKm(value?: string) {
  if (!value) return "-";

  return `${Number(value).toLocaleString("pt-BR")} km`;
}

function statusClass(status: OrderStatus) {
  return {
    Aberta: "is-open",
    "Em andamento": "is-progress",
    Pendente: "is-pending",
    Concluída: "is-done",
    Finalizada: "is-done",
    Cancelada: "is-canceled",
  }[status];
}

function priorityClass(priority: OrderPriority) {
  return {
    Normal: "is-normal",
    Alta: "is-high",
    Urgente: "is-urgent",
  }[priority];
}

function formatCurrentDateTime() {
  const now = new Date();
  const date = new Intl.DateTimeFormat("pt-BR").format(now);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return `${date} ${time}`;
}

