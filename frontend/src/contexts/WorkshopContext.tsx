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
  status: string;
};

export type WorkOrder = {
  id: string;
  vehicleId: number;
  clientId: string;
  clienteNome: string;
  placa: string;
  modelo: string;
  problema: string;
  servico: string;
  status: "Em andamento" | "Aguardando peça" | "Concluída";
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
};

type WorkshopContextValue = {
  clients: Client[];
  vehicles: Vehicle[];
  orders: WorkOrder[];
  ordersCount: number;
  revenue: number;
  addClient: (client: AddClientForm) => void;
  addVehicle: (vehicle: AddVehicleForm) => void;
  addOrder: (order: Omit<WorkOrder, "id" | "createdAt">) => WorkOrder;
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
        id: prev.length + 1,
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

  const addVehicle = (vehicle: AddVehicleForm) => {
    setVehicles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        clienteNome: vehicle.clienteNome,
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
        ano: vehicle.ano,
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

  const addOrder = (order: Omit<WorkOrder, "id" | "createdAt">) => {
    const newOrder: WorkOrder = {
      ...order,
      id: `OS-${Date.now()}`,
      createdAt: new Date().toISOString(),
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

  const value = useMemo(
    () => ({
      clients,
      vehicles,
      orders,
      ordersCount: orders.length,
      revenue: 0,
      addClient,
      addVehicle,
      addOrder,
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
