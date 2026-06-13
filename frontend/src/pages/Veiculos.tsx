import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Car, Edit3, Gauge, Hash, RotateCcw, Save, Search, Tag, Trash2, User, X } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useWorkshop, Vehicle } from "../contexts/WorkshopContext";

const modelosPorMarca = {
  Fiat: [
    "Mobi", "Argo", "Cronos", "Pulse", "Fastback", "Strada", "Toro",
    "Titano", "Fiorino", "Scudo", "E-Scudo", "Ducato", "500e",
    "Uno", "Palio", "Siena", "Grand Siena", "Idea", "Punto", "Bravo",
    "Stilo", "Tempra", "Tipo", "Doblò", "Marea", "Linea", "Freemont",
  ],
  Chevrolet: [
    "Onix", "Onix Plus", "Tracker", "Spin", "Sonic", "Equinox",
    "Trailblazer", "Montana", "S10", "Silverado", "Spark EUV",
    "Captiva EV", "Equinox EV", "Blazer EV RS", "Celta", "Corsa",
    "Classic", "Prisma", "Astra", "Vectra", "Monza", "Kadett",
    "Omega", "Opala", "Chevette", "Cruze", "Zafira", "Meriva",
    "Agile", "Captiva",
  ],
  Toyota: [
    "Corolla", "Corolla Hybrid", "Corolla Cross",
    "Corolla Cross Hybrid", "Yaris Cross", "Yaris Cross Hybrid",
    "Hilux", "SW4", "RAV4", "Hiace", "Hiace Furgão",
    "GR Corolla", "GR Yaris", "Etios", "Yaris", "Bandeirante",
    "Fielder", "Camry", "Prius",
  ],
  Volkswagen: [
    "Polo", "Virtus", "Nivus", "T-Cross", "Taos", "Tiguan Allspace",
    "Saveiro", "Amarok", "Tera", "ID.4", "Fusca", "Brasília",
    "Kombi", "Gol", "Voyage", "Parati", "Fox", "SpaceFox",
    "CrossFox", "Golf", "Jetta", "Passat", "Santana", "Quantum",
    "Pointer", "Logus", "Apollo", "Bora", "Up!",
  ],
};

type VehicleBrand = keyof typeof modelosPorMarca;

const BRAND_CARDS: Array<{ name: VehicleBrand; logo: string }> = [
  { name: "Fiat", logo: "/fiat.png" },
  { name: "Chevrolet", logo: "/chevrolet.png" },
  { name: "Toyota", logo: "/toyota.png" },
  { name: "Volkswagen", logo: "/volkswagen.png" },
];

const initialForm = {
  clienteNome: "",
  placa: "",
  marca: "",
  modelo: "",
  ano: "",
  quilometragem: "",
};

function formatKm(value?: string) {
  if (!value) return "Não informado";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "Não informado";

  return `${numericValue.toLocaleString("pt-BR")} km`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function Veiculos() {
  const { clients, vehicles, addVehicle, updateVehicle, deleteVehicle } = useWorkshop();
  const [form, setForm] = useState(initialForm);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const availableModels = form.marca
    ? modelosPorMarca[form.marca as VehicleBrand] ?? []
    : [];

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [selectedVehicleId, vehicles]
  );

  const filteredVehicles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return vehicles;

    return vehicles.filter((vehicle) =>
      [
        vehicle.placa,
        vehicle.marca,
        vehicle.modelo,
        vehicle.ano,
        vehicle.clienteNome,
        vehicle.quilometragem,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm, vehicles]);

  const handleBrandChange = (marca: string) => {
    setForm((current) => ({
      ...current,
      marca,
      modelo: "",
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setEditingVehicleId(null);
    setSuccessMessage("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const vehicleData = {
      clienteNome: form.clienteNome,
      placa: form.placa,
      marca: form.marca,
      modelo: form.modelo,
      ano: form.ano,
      quilometragem: onlyDigits(form.quilometragem),
    };

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, vehicleData);
      setSuccessMessage("Veiculo atualizado com sucesso");
    } else {
      addVehicle(vehicleData);
      setSuccessMessage("Veiculo cadastrado com sucesso");
    }

    setForm(initialForm);
    setEditingVehicleId(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setForm({
      clienteNome: vehicle.clienteNome || "",
      placa: vehicle.placa || "",
      marca: vehicle.marca || "",
      modelo: vehicle.modelo || "",
      ano: vehicle.ano || "",
      quilometragem: vehicle.quilometragem || "",
    });
    setEditingVehicleId(vehicle.id);
    setSelectedVehicleId(null);
    setSuccessMessage("");
  };

  const handleOpenDetails = (id: number) => {
    const vehicle = vehicles.find((current) => current.id === id);
    if (!vehicle) return;

    setSelectedVehicleId(vehicle.id);
  };

  const handleCloseDetails = () => {
    setSelectedVehicleId(null);
  };

  const handleEditFromDetails = () => {
    if (!selectedVehicle) return;

    handleEdit(selectedVehicle);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Deseja excluir este veículo?");
    if (!confirmed) return;

    deleteVehicle(id);

    if (editingVehicleId === id) {
      setForm(initialForm);
      setEditingVehicleId(null);
    }
  };

  useEffect(() => {
    if (!successMessage) return;

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  return (
    <>
      <Navbar />
      <main className="vehicles-page">
        <div className="vehicles-container">
          <header className="vehicles-header">
            <div>
              <h1>Cadastro de Veículo</h1>
              <p>Registre o veículo e vincule-o ao cliente para demonstração.</p>
            </div>
          </header>

          <div className="vehicles-grid">
            <form
              id="vehicle-form"
              className="vehicles-card vehicles-form"
              onSubmit={handleSubmit}
            >
              <div className="vehicles-card-heading">
                <span className="vehicles-heading-icon">
                  <Car size={20} />
                </span>
                <div>
                  <h2>Novo Veículo</h2>
                  <p>Preencha os dados do veículo abaixo.</p>
                </div>
              </div>

              <div className="vehicles-form-fields">
                <label>
                  <span>Cliente <strong>*</strong></span>
                  <input
                    list="clientes"
                    required
                    value={form.clienteNome}
                    placeholder="Digite ou selecione o cliente"
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        clienteNome: event.target.value,
                      }))
                    }
                  />
                  <datalist id="clientes">
                    {clients.map((client) => (
                      <option key={client.id} value={client.nome} />
                    ))}
                  </datalist>
                </label>

                <label>
                  <span>Marca <strong>*</strong></span>
                  <select
                    required
                    value={form.marca}
                    onChange={(event) => handleBrandChange(event.target.value)}
                  >
                    <option value="">Selecione a marca</option>
                    {BRAND_CARDS.map((brand) => (
                      <option key={brand.name} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="vehicles-brand-grid" aria-label="Marcas disponíveis">
                  {BRAND_CARDS.map((brand) => (
                    <button
                      key={brand.name}
                      type="button"
                      className={`vehicles-brand-card ${
                        form.marca === brand.name ? "is-selected" : ""
                      }`}
                      onClick={() => handleBrandChange(brand.name)}
                    >
                      <img src={brand.logo} alt={brand.name} />
                      <strong>{brand.name}</strong>
                    </button>
                  ))}
                </div>

                <label>
                  <span>Modelo <strong>*</strong></span>
                  <input
                    list="modelos-lista"
                    required
                    value={form.modelo}
                    disabled={!form.marca}
                    placeholder={
                      form.marca ? "Selecione ou digite o modelo" : "Selecione uma marca primeiro"
                    }
                    onChange={(event) =>
                      setForm((current) => ({ ...current, modelo: event.target.value }))
                    }
                  />
                  <datalist id="modelos-lista">
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </datalist>
                </label>

                <div className="vehicles-inline-fields">
                  <label>
                    <span>Placa <strong>*</strong></span>
                    <input
                      required
                      maxLength={8}
                      placeholder="Ex: ABC1D23"
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
                    <span>Ano <strong>*</strong></span>
                    <input
                      required
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Ex: 2020"
                      value={form.ano}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          ano: event.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </label>

                  <label>
                    <span>Quilometragem <strong>*</strong></span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="Ex: 125000"
                      value={form.quilometragem}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          quilometragem: onlyDigits(event.target.value),
                        }))
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="vehicles-form-actions">
                <button type="button" className="vehicles-clear" onClick={handleReset}>
                  <RotateCcw size={18} />
                  <span>Limpar</span>
                </button>

                <button type="submit" className="vehicles-submit">
                  <Save size={18} />
                  <span>{editingVehicleId ? "Salvar Veículo" : "Cadastrar Veículo"}</span>
                </button>
              </div>

              {successMessage && (
                <span className="vehicles-success">{successMessage}</span>
              )}
            </form>

            <section className="vehicles-card vehicles-table-card">
              <div className="vehicles-table-header">
                <div className="vehicles-card-heading">
                  <span className="vehicles-heading-icon">
                    <Car size={20} />
                  </span>
                  <div>
                    <h2>Veículos Cadastrados</h2>
                    <p>Lista de todos os veículos cadastrados.</p>
                  </div>
                </div>

                <label className="vehicles-search">
                  <span>Buscar veículo</span>
                  <Search size={18} />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar veículo..."
                  />
                </label>
              </div>

              <div className="vehicles-table-wrap">
                <table className="vehicles-table">
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>Ano</th>
                      <th>Cliente</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="vehicles-empty">
                            Nenhum veículo cadastrado ainda.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredVehicles.map((vehicle: Vehicle) => (
                        <tr key={vehicle.id}>
                          <td>
                            <span className="vehicles-plate">{vehicle.placa}</span>
                          </td>
                          <td>{vehicle.marca}</td>
                          <td>{vehicle.modelo}</td>
                          <td>{vehicle.ano}</td>
                          <td>{vehicle.clienteNome}</td>
                          <td>
                            <div className="vehicles-actions">
                              <button
                                type="button"
                                aria-label={`Detalhes ${vehicle.placa}`}
                                onClick={() => handleOpenDetails(vehicle.id)}
                              >
                                <Edit3 size={17} />
                              </button>
                              <button
                                type="button"
                                className="is-danger"
                                aria-label={`Excluir ${vehicle.placa}`}
                                onClick={() => handleDelete(vehicle.id)}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <p className="vehicles-table-footer">
                Mostrando {filteredVehicles.length} de {vehicles.length} veículos
              </p>
            </section>
          </div>
        </div>
      </main>

      {selectedVehicle && (
        <div className="vehicles-modal-overlay" role="presentation">
          <section
            className="vehicles-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vehicle-details-title"
          >
            <header className="vehicles-modal-header">
              <h2 id="vehicle-details-title">Detalhes do Veículo</h2>
              <button
                type="button"
                className="vehicles-modal-close"
                aria-label="Fechar detalhes do veículo"
                onClick={handleCloseDetails}
              >
                <X size={18} />
              </button>
            </header>

            <div className="vehicles-modal-content">
              <div className="vehicles-detail-grid">
                <div className="vehicles-detail-item">
                  <span className="vehicles-detail-icon">
                    <Hash size={16} />
                  </span>
                  <div>
                    <span>Placa</span>
                    <strong>{selectedVehicle.placa}</strong>
                  </div>
                </div>

                <div className="vehicles-detail-item">
                  <span className="vehicles-detail-icon">
                    <Tag size={16} />
                  </span>
                  <div>
                    <span>Marca</span>
                    <strong>{selectedVehicle.marca}</strong>
                  </div>
                </div>

                <div className="vehicles-detail-item">
                  <span className="vehicles-detail-icon">
                    <Car size={16} />
                  </span>
                  <div>
                    <span>Modelo</span>
                    <strong>{selectedVehicle.modelo}</strong>
                  </div>
                </div>

                <div className="vehicles-detail-item">
                  <span className="vehicles-detail-icon">
                    <Calendar size={16} />
                  </span>
                  <div>
                    <span>Ano</span>
                    <strong>{selectedVehicle.ano}</strong>
                  </div>
                </div>

                <div className="vehicles-detail-item vehicles-detail-item-wide">
                  <span className="vehicles-detail-icon">
                    <Gauge size={16} />
                  </span>
                  <div>
                    <span>Quilometragem</span>
                    <strong>{formatKm(selectedVehicle.quilometragem)}</strong>
                  </div>
                </div>
              </div>

              <div className="vehicles-modal-section">
                <h3>Dados do Cliente</h3>
                <div className="vehicles-detail-grid">
                  <div className="vehicles-detail-item">
                    <span className="vehicles-detail-icon">
                      <User size={16} />
                    </span>
                    <div>
                      <span>Nome</span>
                      <strong>{selectedVehicle.clienteNome}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="vehicles-modal-actions">
              <button
                type="button"
                className="vehicles-clear"
                onClick={handleEditFromDetails}
              >
                <Edit3 size={17} />
                <span>Editar</span>
              </button>
              <button
                type="button"
                className="vehicles-submit"
                onClick={handleCloseDetails}
              >
                <span>Fechar</span>
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
