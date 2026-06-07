import React, { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useWorkshop, Vehicle, WorkOrder } from "../contexts/WorkshopContext";

export default function Veiculos() {
  const { vehicles, orders, addVehicle, addOrder } = useWorkshop();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState({
    clienteNome: "",
    placa: "",
    marca: "",
    modelo: "",
    ano: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [orderSuccessMessage, setOrderSuccessMessage] = useState("");
  const [orderForm, setOrderForm] = useState({
    problema: "",
    servico: "",
    status: "Em andamento" as WorkOrder["status"],
  });

  const scrollToVehicleForm = () => {
    document.getElementById("vehicle-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      clienteNome: form.clienteNome,
      placa: form.placa,
      marca: form.marca,
      modelo: form.modelo,
      ano: form.ano,
      status: "Disponível",
    };

    addVehicle(form);
    setSelectedVehicle(newVehicle);
    setForm({ clienteNome: "", placa: "", marca: "", modelo: "", ano: "" });
    setSuccessMessage("Veículo cadastrado com sucesso");
    document.getElementById("ordem-servico")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOrderSuccessMessage("");
    document.getElementById("ordem-servico")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleOrderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVehicle) {
      window.alert("Selecione um veículo antes de salvar a ordem de serviço.");
      return;
    }

    addOrder({
      vehicleId: selectedVehicle.id,
      clientId: `${selectedVehicle.id}`,
      clienteNome: selectedVehicle.clienteNome,
      placa: selectedVehicle.placa,
      modelo: selectedVehicle.modelo,
      problema: orderForm.problema,
      servico: orderForm.servico,
      status: orderForm.status,
    });

    setOrderForm({ problema: "", servico: "", status: "Em andamento" });
    setOrderSuccessMessage("Ordem de serviço criada com sucesso");
  };

  useEffect(() => {
    if (!successMessage && !orderSuccessMessage) return;

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
      setOrderSuccessMessage("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [successMessage, orderSuccessMessage]);

  const selectedVehicleOrders = selectedVehicle
    ? orders.filter((order) => order.vehicleId === selectedVehicle.id)
    : [];

  return (
    <>
      <Navbar />
      <main className="vehicles-page">
        <div className="vehicles-container">
          <header className="vehicles-header">
            <div>
              <h1>Cadastro de Veículo</h1>
              <p>Registre o veículo e vincule-o ao cliente para a demonstração.</p>
            </div>

            <button
              type="button"
              onClick={scrollToVehicleForm}
              className="vehicles-primary-action"
            >
              <Plus size={20} />
              <span>Cadastrar Veículo</span>
            </button>
          </header>

          <div className="vehicles-grid">
            <form
              id="vehicle-form"
              className="vehicles-card vehicles-form"
              onSubmit={handleSubmit}
            >
              <div className="vehicles-form-fields">
                <label>
                  <span>Cliente</span>
                  <input
                    required
                    value={form.clienteNome}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, clienteNome: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>Placa</span>
                  <input
                    required
                    value={form.placa}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        placa: event.target.value.toUpperCase(),
                      }))
                    }
                  />
                </label>

                <label>
                  <span>Marca</span>
                  <input
                    required
                    value={form.marca}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, marca: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>Modelo</span>
                  <input
                    required
                    value={form.modelo}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, modelo: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>Ano</span>
                  <input
                    required
                    value={form.ano}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, ano: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="vehicles-form-actions">
                <button type="submit" className="vehicles-submit">
                  <Save size={20} />
                  <span>Cadastrar Veículo</span>
                </button>

                {successMessage && (
                  <span className="vehicles-success">{successMessage}</span>
                )}
              </div>
            </form>

            <aside className="vehicles-side">
              <section className="vehicles-card">
                <h2>Veículos Cadastrados</h2>
                <p>Selecione um veículo para abrir uma nova ordem de serviço.</p>

                <div className="vehicles-list">
                  {vehicles.length === 0 ? (
                    <div className="vehicles-empty">Nenhum veículo cadastrado ainda.</div>
                  ) : (
                    vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => handleSelectVehicle(vehicle)}
                        className={`vehicles-list-item ${
                          selectedVehicle?.id === vehicle.id ? "is-selected" : ""
                        }`}
                      >
                        <strong>
                          {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
                        </strong>
                        <span>Cliente: {vehicle.clienteNome}</span>
                      </button>
                    ))
                  )}
                </div>
              </section>

              <section className="vehicles-card" id="ordem-servico">
                <h2>Veículo Selecionado</h2>
                <p>Escolha um veículo para registrar uma nova ordem de serviço.</p>

                <div className="vehicles-selected">
                  <span>Veículo Selecionado</span>
                  {selectedVehicle ? (
                    <>
                      <strong>{selectedVehicle.placa}</strong>
                      <p>
                        {selectedVehicle.marca} {selectedVehicle.modelo} -{" "}
                        {selectedVehicle.ano}
                      </p>
                    </>
                  ) : (
                    <strong>Nenhum veículo selecionado</strong>
                  )}
                </div>

                <form className="vehicles-order-form" onSubmit={handleOrderSubmit}>
                  {selectedVehicle ? (
                    <div className="vehicles-order-summary">
                      <div>
                        <span>Cliente</span>
                        <strong>{selectedVehicle.clienteNome}</strong>
                      </div>
                      <div>
                        <span>Veículo</span>
                        <strong>
                          {selectedVehicle.placa} - {selectedVehicle.marca}{" "}
                          {selectedVehicle.modelo}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="vehicles-warning">
                      Selecione um veículo na lista para liberar o cadastro de ordem.
                    </div>
                  )}

                  <label>
                    <span>Problema Relatado</span>
                    <textarea
                      required
                      value={orderForm.problema}
                      onChange={(event) =>
                        setOrderForm((current) => ({
                          ...current,
                          problema: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </label>

                  <label>
                    <span>Serviço Executado</span>
                    <textarea
                      required
                      value={orderForm.servico}
                      onChange={(event) =>
                        setOrderForm((current) => ({
                          ...current,
                          servico: event.target.value,
                        }))
                      }
                      rows={2}
                    />
                  </label>

                  <label>
                    <span>Status</span>
                    <select
                      value={orderForm.status}
                      onChange={(event) =>
                        setOrderForm((current) => ({
                          ...current,
                          status: event.target.value as WorkOrder["status"],
                        }))
                      }
                    >
                      <option>Em andamento</option>
                      <option>Aguardando peça</option>
                      <option>Concluída</option>
                    </select>
                  </label>

                  <div className="vehicles-order-actions">
                    <button type="submit" className="vehicles-submit vehicles-order-submit">
                      Salvar Ordem
                    </button>

                    {orderSuccessMessage && (
                      <span className="vehicles-success">{orderSuccessMessage}</span>
                    )}
                  </div>
                </form>

                <div className="vehicles-orders">
                  <h3>Ordens deste veículo</h3>
                  {selectedVehicleOrders.length === 0 ? (
                    <div className="vehicles-empty">Nenhuma ordem deste veículo ainda.</div>
                  ) : (
                    selectedVehicleOrders.map((order) => (
                      <div key={order.id} className="vehicles-order-item">
                        <strong>{order.id}</strong>
                        <span>{order.servico}</span>
                        <small>{order.status}</small>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
