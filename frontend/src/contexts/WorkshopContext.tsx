import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  criarCliente,
  listarClientes,
  removerCliente,
  type CriarClientePayload,
  type Cliente as ApiCliente,
} from "../services/clienteService";
import {
  atualizarCarro,
  criarCarro,
  listarCarros,
  removerCarro,
  type Carro as ApiCarro,
} from "../services/carroService";
import {
  atualizarOrdem,
  criarOrdem,
  listarOrdens,
  removerOrdem,
  type OrdemServico as ApiOrdem,
} from "../services/ordemService";

export type Client = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  veiculos: number;
  ultimaOS: string;
  status: string;
};

export type Vehicle = {
  id: string;
  clientId: string;
  clienteNome: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  quilometragem?: string;
  status: string;
};

export type WorkOrder = {
  id: string;
  vehicleId: string;
  clientId: string;
  clienteNome: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  quilometragem?: string;
  problema: string;
  servico: string;
  prioridade: "Normal" | "Alta" | "Urgente";
  dataAbertura: string;
  dataFechamento: string | null;
  observacoes: string;
  status:
    | "Aberta"
    | "Em andamento"
    | "Pendente"
    | "Aguardando peça"
    | "Concluída"
    | "Finalizada"
    | "Cancelada";
  createdAt: string;
};

type AddClientForm = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
};

type AddVehicleForm = {
  clienteNome: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  quilometragem: string;
};

type WorkshopContextValue = {
  clients: Client[];
  vehicles: Vehicle[];
  orders: WorkOrder[];
  ordersCount: number;
  revenue: number;
  clientsLoading: boolean;
  clientsError: string;
  refreshClients: () => Promise<void>;
  addClient: (client: AddClientForm) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addVehicle: (vehicle: AddVehicleForm) => Promise<void>;
  updateVehicle: (id: string, vehicle: AddVehicleForm) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addOrder: (order: Omit<WorkOrder, "id" | "createdAt">) => Promise<WorkOrder>;
  updateOrder: (id: string, order: Partial<Omit<WorkOrder, "id" | "createdAt">>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
};

const WorkshopContext = createContext<WorkshopContextValue | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";
const STORAGE_KEYS = {
  clients: "oficina-clients",
  vehicles: "oficina-vehicles",
  orders: "oficina-orders",
};

function readStoredList<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function mapApiCliente(cliente: ApiCliente): Client {
  return {
    id: String(cliente.id),
    nome: cliente.nome,
    cpf: cliente.cpf,
    telefone: cliente.telefone,
    email: cliente.email,
    veiculos: 0,
    ultimaOS: "-",
    status: "Ativo",
  };
}

function mapApiCarro(carro: ApiCarro): Vehicle {
  return {
    id: String(carro.id),
    clientId: String(carro.clienteId),
    clienteNome: carro.clienteNome ?? "",
    placa: carro.placa,
    marca: carro.marca,
    modelo: carro.modelo,
    ano: String(carro.ano),
    quilometragem: String(carro.quilometragem ?? ""),
    status: "Disponível",
  };
}

function normalizeApiStatus(status: string): WorkOrder["status"] {
  if (status === "Em andamento") return "Em andamento";
  if (status === "Pendente") return "Pendente";
  if (status === "Concluída") return "Concluída";
  if (status === "Finalizada") return "Finalizada";
  if (status === "Cancelada") return "Cancelada";
  return "Aberta";
}

function mapApiOrdem(ordem: ApiOrdem): WorkOrder {
  return {
    id: String(ordem.id),
    vehicleId: String(ordem.carroId),
    clientId: String(ordem.clienteId),
    clienteNome: ordem.clienteNome ?? "",
    placa: ordem.placa ?? "",
    marca: ordem.marca ?? "",
    modelo: ordem.modelo ?? "",
    ano: String(ordem.ano ?? ""),
    quilometragem: String(ordem.quilometragem ?? ""),
    problema: ordem.descricao,
    servico: ordem.descricao,
    prioridade: "Normal",
    dataAbertura: ordem.dataEntrada,
    dataFechamento: ordem.dataSaida ?? null,
    observacoes: ordem.observacoes ?? "",
    status: normalizeApiStatus(ordem.status),
    createdAt: ordem.createdAt ?? ordem.dataEntrada,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() =>
    readStoredList<Client>(STORAGE_KEYS.clients)
  );
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    readStoredList<Vehicle>(STORAGE_KEYS.vehicles)
  );
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    readStoredList<WorkOrder>(STORAGE_KEYS.orders)
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);

  const refreshClients = async () => {
    setClientsLoading(true);
    setClientsError("");

    try {
      const clientes = await listarClientes();
      setClients(clientes.map(mapApiCliente));
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Não foi possível carregar os clientes cadastrados."
      );
      console.error("Erro ao carregar clientes do backend:", error);
      setClientsError(message);
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    void refreshClients();
  }, []);

  const refreshVehicles = async () => {
    try {
      const carros = await listarCarros();
      setVehicles(carros.map(mapApiCarro));
    } catch (error) {
      console.error("Erro ao carregar veículos do backend:", error);
    }
  };

  useEffect(() => {
    void refreshVehicles();
  }, []);

  const refreshOrders = async () => {
    try {
      const ordens = await listarOrdens();
      setOrders(ordens.map(mapApiOrdem));
    } catch (error) {
      console.error("Erro ao carregar ordens do backend:", error);
    }
  };

  useEffect(() => {
    void refreshOrders();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  const addClient = async (client: AddClientForm) => {
    setClientsError("");

    try {
      const payload: CriarClientePayload = {
        ...client,
      };

      await criarCliente(payload);
      await refreshClients();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Não foi possível cadastrar o cliente."
      );
      console.error("Erro ao cadastrar cliente no backend:", error);
      setClientsError(message);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    setClientsError("");

    try {
      await removerCliente(id);
      await refreshClients();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Não foi possível excluir o cliente."
      );
      console.error("Erro ao excluir cliente no backend:", error);
      setClientsError(message);
      throw error;
    }
  };

  const addVehicle = async (vehicle: AddVehicleForm) => {
    const cliente = clients.find(
      (current) => current.nome.toLowerCase() === vehicle.clienteNome.toLowerCase()
    );

    if (!cliente) {
      throw new Error("Cliente não encontrado para vincular ao veículo.");
    }

    await criarCarro({
      clienteId: cliente.id,
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: Number(vehicle.ano),
      cor: "Não informada",
      quilometragem: Number(vehicle.quilometragem || 0),
    });
    await refreshVehicles();
  };

  const updateVehicle = async (id: string, vehicle: AddVehicleForm) => {
    const cliente = clients.find(
      (current) => current.nome.toLowerCase() === vehicle.clienteNome.toLowerCase()
    );

    if (!cliente) {
      throw new Error("Cliente não encontrado para vincular ao veículo.");
    }

    await atualizarCarro(id, {
      clienteId: cliente.id,
      placa: vehicle.placa,
      marca: vehicle.marca,
      modelo: vehicle.modelo,
      ano: Number(vehicle.ano),
      cor: "Não informada",
      quilometragem: Number(vehicle.quilometragem || 0),
    });
    await refreshVehicles();
  };

  const deleteVehicle = async (id: string) => {
    await removerCarro(id);
    await refreshVehicles();
  };

  const addOrder = async (order: Omit<WorkOrder, "id" | "createdAt">) => {
    const createdOrder = await criarOrdem({
      clienteId: order.clientId,
      carroId: order.vehicleId,
      descricao: order.servico,
      valor: 0,
      observacoes: order.observacoes,
    });
    const newOrder = mapApiOrdem(createdOrder);

    await refreshOrders();

    return newOrder;
  };

  const updateOrder = (
    id: string,
    order: Partial<Omit<WorkOrder, "id" | "createdAt">>
  ) => {
    return atualizarOrdem(id, {
      descricao: order.servico ?? order.problema,
      status: order.status,
      valor: 0,
      dataSaida: order.dataFechamento ?? undefined,
      observacoes: order.observacoes,
    }).then(() => refreshOrders());
  };

  const deleteOrder = (id: string) => {
    return removerOrdem(id).then(() => refreshOrders());
  };

  const value = useMemo(
    () => ({
      clients,
      vehicles,
      orders,
      ordersCount: orders.length,
      revenue: 0,
      clientsLoading,
      clientsError,
      refreshClients,
      addClient,
      deleteClient,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addOrder,
      updateOrder,
      deleteOrder,
    }),
    [clients, vehicles, orders, clientsLoading, clientsError]
  );

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
}

export function useWorkshop() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error("useWorkshop must be used within WorkshopProvider");
  }
  return context;
}
