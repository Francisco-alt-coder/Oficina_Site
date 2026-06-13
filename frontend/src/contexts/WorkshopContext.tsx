import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Client = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  veiculos: number;
  ultimaOS: string;
  status: string;
};

export type Vehicle = {
  id: number;
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
  vehicleId: number;
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
  addClient: (client: AddClientForm) => void;
  deleteClient: (id: number) => void;
  addVehicle: (vehicle: AddVehicleForm) => void;
  updateVehicle: (id: number, vehicle: AddVehicleForm) => void;
  deleteVehicle: (id: number) => void;
  addOrder: (order: Omit<WorkOrder, "id" | "createdAt">) => WorkOrder;
  updateOrder: (id: string, order: Partial<Omit<WorkOrder, "id" | "createdAt">>) => void;
  deleteOrder: (id: string) => void;
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

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() =>
    readStoredList<Client>(STORAGE_KEYS.clients)
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    readStoredList<Vehicle>(STORAGE_KEYS.vehicles)
  );
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    readStoredList<WorkOrder>(STORAGE_KEYS.orders)
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.vehicles, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  }, [orders]);

  const addClient = (client: AddClientForm) => {
    setClients((prev) => [
      ...prev,
      {
        id: prev.reduce((maxId, current) => Math.max(maxId, current.id), 0) + 1,
        nome: client.nome,
        cpf: client.cpf,
        telefone: client.telefone,
        email: client.email,
        veiculos: 0,
        ultimaOS: "-",
        status: "Ativo",
      },
    ]);

    void fetch(`${API_BASE_URL}/clientes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    }).catch(() => undefined);
  };

  const deleteClient = (id: number) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const addVehicle = (vehicle: AddVehicleForm) => {
    setVehicles((prev) => [
      ...prev,
      {
        id: prev.reduce((maxId, current) => Math.max(maxId, current.id), 0) + 1,
        clienteNome: vehicle.clienteNome,
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: vehicle.ano,
        quilometragem: vehicle.quilometragem,
        status: "Disponível",
      },
    ]);

    void fetch(`${API_BASE_URL}/carros/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: Number(vehicle.ano),
      }),
    }).catch(() => undefined);
  };

  const updateVehicle = (id: number, vehicle: AddVehicleForm) => {
    setVehicles((prev) =>
      prev.map((current) =>
        current.id === id
          ? {
              ...current,
              clienteNome: vehicle.clienteNome,
              placa: vehicle.placa,
              marca: vehicle.marca,
              modelo: vehicle.modelo,
              ano: vehicle.ano,
              quilometragem: vehicle.quilometragem,
            }
          : current
      )
    );
  };

  const deleteVehicle = (id: number) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
  };

  const addOrder = (order: Omit<WorkOrder, "id" | "createdAt">) => {
    const shouldClose =
      order.status === "Concluída" || order.status === "Finalizada";
    const dataFechamento = shouldClose
      ? order.dataFechamento ?? new Date().toISOString()
      : null;
    const lastSequentialId = Math.max(
      0,
      ...orders
        .map((currentOrder) => currentOrder.id.match(/^OS-(\d{4})$/)?.[1])
        .filter((value): value is string => Boolean(value))
        .map((value) => Number(value))
    );
    const nextOrderNumber = lastSequentialId || orders.length;
    const newOrder: WorkOrder = {
      ...order,
      id: `OS-${String(nextOrderNumber + 1).padStart(4, "0")}`,
      dataFechamento,
      createdAt: order.dataAbertura
        ? new Date(order.dataAbertura).toISOString()
        : new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    void fetch(`${API_BASE_URL}/ordens/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descricao: order.servico,
        valor: 0,
      }),
    }).catch(() => undefined);

    return newOrder;
  };

  const updateOrder = (
    id: string,
    order: Partial<Omit<WorkOrder, "id" | "createdAt">>
  ) => {
    setOrders((prev) =>
      prev.map((current) => {
        if (current.id !== id) return current;

        const nextStatus = order.status ?? current.status;
        const isFinished = nextStatus === "Concluída" || nextStatus === "Finalizada";
        const nextDataFechamento = isFinished
          ? order.dataFechamento ?? current.dataFechamento ?? new Date().toISOString()
          : order.dataFechamento ?? current.dataFechamento;

        return {
          ...current,
          ...order,
          dataFechamento: nextDataFechamento,
        };
      })
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => {
      const updatedOrders = prev.filter((order) => order.id !== id);
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  const value = useMemo(
    () => ({
      clients,
      vehicles,
      orders,
      ordersCount: orders.length,
      revenue: 0,
      addClient,
      deleteClient,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addOrder,
      updateOrder,
      deleteOrder,
    }),
    [clients, vehicles, orders]
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
