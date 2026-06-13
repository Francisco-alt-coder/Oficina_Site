import React, { useEffect, useState } from "react";
import { Eye, Save, Trash2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useWorkshop } from "../contexts/WorkshopContext";

const initialForm = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
};

function maskCPF(cpf: string) {
  if (!cpf) return "";

  const numeros = cpf.replace(/\D/g, "");

  return `***.***.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
}

function formatCPF(cpf: string) {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) {
    return cpf;
  }

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
    6,
    9
  )}-${numeros.slice(9, 11)}`;
}

export default function Clientes() {
  const { clients, addClient, deleteClient } = useWorkshop();
  const [form, setForm] = useState(initialForm);
  const [successMessage, setSuccessMessage] = useState("");
  const [visibleCpfIds, setVisibleCpfIds] = useState<number[]>([]);

  const handleFieldChange = (
    field: "nome" | "cpf" | "telefone" | "email",
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addClient(form);
    setForm(initialForm);
    setSuccessMessage("Cliente cadastrado com sucesso");
  };

  const handleDeleteClient = (id: number) => {
    const confirmDelete = window.confirm("Deseja excluir este cliente?");

    if (!confirmDelete) return;

    deleteClient(id);
    setVisibleCpfIds((current) => current.filter((clientId) => clientId !== id));
  };

  const toggleCpfVisibility = (id: number) => {
    setVisibleCpfIds((current) =>
      current.includes(id)
        ? current.filter((clientId) => clientId !== id)
        : [...current, id]
    );
  };

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  return (
    <>
      <Navbar />
      <main className="clients-page">
        <div className="clients-container">
          <header className="clients-header">
            <div>
              <h1>Cadastro de Cliente</h1>
              <p>Preencha os dados abaixo e salve um novo cliente para a demonstração.</p>
            </div>

          </header>

          <div className="clients-grid">
            <form
              id="client-form"
              className="clients-card clients-form"
              onSubmit={handleSubmit}
            >
              <div className="clients-form-fields">
                <label>
                  <span>Nome</span>
                  <input
                    list="client-names"
                    required
                    value={form.nome}
                    placeholder="Digite ou selecione o nome"
                    onChange={(event) => handleFieldChange("nome", event.target.value)}
                  />
                  <datalist id="client-names">
                    {clients.map((client) => (
                      <option key={client.id} value={client.nome} />
                    ))}
                  </datalist>
                </label>

                <label>
                  <span>CPF</span>
                  <input
                    list="client-cpfs"
                    required
                    value={form.cpf}
                    placeholder="Digite ou selecione o CPF"
                    onChange={(event) => handleFieldChange("cpf", event.target.value)}
                  />
                  <datalist id="client-cpfs">
                    {clients.map((client) => (
                      <option key={client.id} value={client.cpf} />
                    ))}
                  </datalist>
                </label>

                <label>
                  <span>Telefone</span>
                  <input
                    required
                    value={form.telefone}
                    onChange={(event) => handleFieldChange("telefone", event.target.value)}
                  />
                </label>

                <label>
                  <span>E-mail</span>
                  <input
                    list="client-emails"
                    required
                    type="email"
                    value={form.email}
                    placeholder="Digite ou selecione o e-mail"
                    onChange={(event) => handleFieldChange("email", event.target.value)}
                  />
                  <datalist id="client-emails">
                    {clients.map((client) => (
                      <option key={client.id} value={client.email} />
                    ))}
                  </datalist>
                </label>
              </div>

              <div className="clients-form-actions">
                <button type="submit" className="vehicles-submit">
                  <Save size={18} />
                  <span>Salvar Cliente</span>
                </button>

                {successMessage && (
                  <span className="clients-success">{successMessage}</span>
                )}
              </div>
            </form>

            <aside className="clients-side">
              <section className="clients-card">
                <h2>Clientes Cadastrados</h2>
                <p>Aqui estão os clientes salvos durante a demonstração.</p>

                <div className="clients-list">
                  {clients.length === 0 ? (
                    <div className="clients-empty">Nenhum cliente cadastrado ainda.</div>
                  ) : (
                    clients.map((client) => (
                      <div key={client.id} className="clients-list-item">
                        <div className="clients-list-item-content">
                          <strong>{client.nome}</strong>
                          <span className="clients-cpf-line">
                            <span>
                              {visibleCpfIds.includes(client.id)
                                ? formatCPF(client.cpf)
                                : maskCPF(client.cpf)}
                            </span>
                            <button
                              type="button"
                              className="clients-cpf-toggle"
                              aria-label={`${
                                visibleCpfIds.includes(client.id) ? "Ocultar" : "Mostrar"
                              } CPF de ${client.nome}`}
                              onClick={() => toggleCpfVisibility(client.id)}
                            >
                              <Eye size={15} />
                              {visibleCpfIds.includes(client.id)
                                ? "Ocultar CPF"
                                : "Mostrar CPF"}
                            </button>
                          </span>
                          <span>{client.telefone}</span>
                          <span>{client.email || "E-mail não informado"}</span>
                        </div>
                        <button
                          type="button"
                          className="clients-delete-button"
                          aria-label={`Excluir ${client.nome}`}
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="clients-card">
                <h2>Fluxo de uso</h2>
                <p>
                  Cadastre um cliente, depois registre o veículo e veja os resultados no
                  dashboard.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
