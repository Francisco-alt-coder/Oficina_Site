import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useWorkshop } from "../contexts/WorkshopContext";

export default function Clientes() {
  const { clients, addClient } = useWorkshop();
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const scrollToClientForm = () => {
    document.getElementById("client-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addClient(form);
    setForm({ nome: "", cpf: "", telefone: "", email: "" });
    setSuccessMessage("Cliente cadastrado com sucesso");
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

            <button
              type="button"
              onClick={scrollToClientForm}
              className="clients-primary-action"
            >
              Cadastrar cliente
            </button>
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
                    required
                    value={form.nome}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, nome: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>CPF</span>
                  <input
                    required
                    value={form.cpf}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, cpf: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>Telefone</span>
                  <input
                    required
                    value={form.telefone}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, telefone: event.target.value }))
                    }
                  />
                </label>

                <label>
                  <span>E-mail</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="clients-form-actions">
                <button type="submit" className="clients-submit">
                  Salvar Cliente
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
                        <strong>{client.nome}</strong>
                        <span>{client.cpf}</span>
                        <span>{client.telefone}</span>
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
