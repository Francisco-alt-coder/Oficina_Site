import React, { useMemo, useState } from "react";
import { ArrowLeft, Calendar, ClipboardPlus, FileText, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useWorkshop, Vehicle, WorkOrder } from "../contexts/WorkshopContext";

type Priority = "Normal" | "Alta" | "Urgente";

const createInitialForm = () => ({
  vehicleId: "",
  problema: "",
  prioridade: "Normal" as Priority,
  dataAbertura: new Date().toISOString().slice(0, 16),
  dataFechamento: "",
  observacoes: "",
  status: "Aberta" as WorkOrder["status"],
});

function formatDateTime(value: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function OrdemServico() {
  const navigate = useNavigate();
  const { vehicles, addOrder } = useWorkshop();
  const [form, setForm] = useState(createInitialForm);
  const [feedback, setFeedback] = useState("");

  const selectedVehicle = useMemo<Vehicle | undefined>(
    () => vehicles.find((vehicle) => String(vehicle.id) === form.vehicleId),
    [form.vehicleId, vehicles]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedVehicle) {
      setFeedback("Selecione um veículo para criar a ordem de serviço.");
      return;
    }

    const serviceDescription = form.observacoes
      ? `${form.problema}\n\nObservações: ${form.observacoes}`
      : form.problema;

    await addOrder({
      vehicleId: selectedVehicle.id,
      clientId: selectedVehicle.clientId,
      clienteNome: selectedVehicle.clienteNome,
      placa: selectedVehicle.placa,
      marca: selectedVehicle.marca,
      modelo: selectedVehicle.modelo,
      ano: selectedVehicle.ano,
      quilometragem: selectedVehicle.quilometragem || "",
      problema: form.problema,
      servico: serviceDescription,
      prioridade: form.prioridade,
      dataAbertura: form.dataAbertura,
      dataFechamento: form.dataFechamento || null,
      observacoes: form.observacoes,
      status: form.status,
    });

    setFeedback("Ordem de serviço criada com sucesso");
    setForm(createInitialForm());
    window.setTimeout(() => navigate("/ordens"), 1000);
  };

  return (
    <>
      <Navbar />
      <main className="new-order-page">
        <div className="new-order-container">
          <div className="new-order-grid">
            <form className="new-order-card new-order-form" onSubmit={handleSubmit}>
              <div className="new-order-heading">
                <span className="new-order-icon">
                  <ClipboardPlus size={24} />
                </span>
                <div>
                  <h1>Nova Ordem de Serviço</h1>
                  <p>Preencha as informações para abrir uma nova ordem de serviço.</p>
                </div>
              </div>

              <div className="new-order-fields">
                <label>
                  <span>Veículo <strong>*</strong></span>
                  <select
                    required
                    value={form.vehicleId}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, vehicleId: event.target.value }))
                    }
                  >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
                      </option>
                    ))}
                  </select>
                </label>

                {!selectedVehicle && (
                  <div className="new-order-warning">
                    Selecione um veículo na lista para liberar o cadastro de ordem.
                  </div>
                )}

                <label>
                  <span>Problema Relatado <strong>*</strong></span>
                  <textarea
                    required
                    rows={5}
                    value={form.problema}
                    placeholder="Descreva o problema relatado pelo cliente..."
                    onChange={(event) =>
                      setForm((current) => ({ ...current, problema: event.target.value }))
                    }
                  />
                </label>

                <div className="new-order-inline">
                  <label>
                    <span>Prioridade</span>
                    <select
                      value={form.prioridade}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          prioridade: event.target.value as Priority,
                        }))
                      }
                    >
                      <option>Normal</option>
                      <option>Alta</option>
                      <option>Urgente</option>
                    </select>
                  </label>

                  <label>
                    <span>Data de Abertura</span>
                    <div className="new-order-date-field">
                      <input
                        type="datetime-local"
                        required
                        value={form.dataAbertura}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            dataAbertura: event.target.value,
                          }))
                        }
                      />
                      <Calendar size={18} />
                    </div>
                  </label>

                  <label>
                    <span>Data de Fechamento</span>
                    <div className="new-order-date-field">
                      <input
                        type="datetime-local"
                        placeholder="Selecione a data de fechamento"
                        value={
                          form.dataFechamento
                        }
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            dataFechamento: event.target.value,
                          }))
                        }
                      />
                      <Calendar size={18} />
                    </div>
                  </label>
                </div>

                <label>
                  <span>Observações <small>(opcional)</small></span>
                  <textarea
                    rows={3}
                    value={form.observacoes}
                    placeholder="Informações adicionais..."
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        observacoes: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="new-order-actions">
                <button type="button" className="new-order-back" onClick={() => navigate(-1)}>
                  <ArrowLeft size={18} />
                  <span>Voltar</span>
                </button>

                <button type="submit" className="new-order-submit">
                  <Plus size={18} />
                  <span>Criar Ordem de Serviço</span>
                </button>
              </div>

              {feedback && <div className="new-order-feedback">{feedback}</div>}
            </form>

            <aside className="new-order-side">
              <section className="new-order-card new-order-info-card">
                <div className="new-order-side-heading">
                  <span className="new-order-icon">
                    <User size={22} />
                  </span>
                  <h2>Informações do Cliente</h2>
                </div>

                <p>Selecione um veículo para ver as informações do cliente.</p>

                <div className="new-order-client-box">
                  {selectedVehicle ? (
                    <dl>
                      <div>
                        <dt>Cliente</dt>
                        <dd>{selectedVehicle.clienteNome}</dd>
                      </div>
                      <div>
                        <dt>Veículo</dt>
                        <dd>
                          {selectedVehicle.marca} {selectedVehicle.modelo}
                        </dd>
                      </div>
                      <div>
                        <dt>Placa</dt>
                        <dd>{selectedVehicle.placa}</dd>
                      </div>
                    </dl>
                  ) : (
                    <strong>Nenhum veículo selecionado.</strong>
                  )}
                </div>
              </section>

              <section className="new-order-card new-order-summary-card">
                <div className="new-order-side-heading">
                  <span className="new-order-icon">
                    <FileText size={22} />
                  </span>
                  <h2>Resumo da Ordem</h2>
                </div>

                <dl className="new-order-summary-list">
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <span className="new-order-badge is-open">Aberta</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Prioridade</dt>
                    <dd>
                      <span className={`new-order-badge is-${form.prioridade.toLowerCase()}`}>
                        {form.prioridade}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Data de Abertura</dt>
                    <dd>{formatDateTime(form.dataAbertura)}</dd>
                  </div>
                  <div>
                    <dt>Data de Fechamento</dt>
                    <dd>
                      {form.dataFechamento
                        ? formatDateTime(form.dataFechamento)
                        : "Ainda não finalizada"}
                    </dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

