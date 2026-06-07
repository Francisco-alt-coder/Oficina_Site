import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

interface Carro {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  cliente: string;
  status: 'disponivel' | 'reparo' | 'manutencao' | 'venda';
}

interface FormData {
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  cliente: string;
  status: 'disponivel' | 'reparo' | 'manutencao' | 'venda';
}

/**
 * Página Carros - Gerenciamento de veículos da oficina
 * Exibe lista de carros com opções de adicionar, editar e deletar
 */
export default function Carros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | Carro['status']>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<FormData>({
    placa: '',
    marca: '',
    modelo: '',
    cor: '',
    ano: new Date().getFullYear(),
    cliente: '',
    status: 'disponivel',
  });

  // Simular carregamento de dados
  useEffect(() => {
    carregarCarros();
  }, []);

  const carregarCarros = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular chamada à API
      const dadosMock: Carro[] = [
        {
          id: '1',
          placa: 'ABC-1234',
          marca: 'Toyota',
          modelo: 'Corolla',
          cor: 'Prata',
          ano: 2022,
          cliente: 'João Silva',
          status: 'reparo',
        },
        {
          id: '2',
          placa: 'XYZ-5678',
          marca: 'Honda',
          modelo: 'Civic',
          cor: 'Preto',
          ano: 2021,
          cliente: 'Maria Santos',
          status: 'manutencao',
        },
        {
          id: '3',
          placa: 'DEF-9012',
          marca: 'Ford',
          modelo: 'Fiesta',
          cor: 'Branco',
          ano: 2023,
          cliente: 'Pedro Oliveira',
          status: 'disponivel',
        },
      ];
      setCarros(dadosMock);
    } catch (err) {
      setError('Erro ao carregar carros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ano' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.placa || !formData.marca || !formData.modelo) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingId) {
      setCarros((prev) =>
        prev.map((carro) =>
          carro.id === editingId ? { ...carro, ...formData } : carro
        )
      );
    } else {
      const newCarro: Carro = {
        ...formData,
        id: Date.now().toString(),
      };
      setCarros((prev) => [newCarro, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      marca: '',
      modelo: '',
      cor: '',
      ano: new Date().getFullYear(),
      cliente: '',
      status: 'disponivel',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (carro: Carro) => {
    setFormData(carro);
    setEditingId(carro.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este carro?')) {
      setCarros((prev) => prev.filter((carro) => carro.id !== id));
    }
  };

  const carrosFiltrados = carros.filter((carro) => {
    const matchStatus = filtroStatus === 'todos' || carro.status === filtroStatus;
    const matchSearch =
      carro.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carro.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: Carro['status']) => {
    const statusConfig = {
      disponivel: { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Disponível' },
      reparo: { bg: 'bg-red-100', text: 'text-red-800', label: '⚙ Em Reparo' },
      manutencao: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🔧 Manutenção' },
      venda: { bg: 'bg-blue-100', text: 'text-blue-800', label: '💰 À Venda' },
    };
    const config = statusConfig[status];
    return (
      <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', config.bg, config.text)}>
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout title="Carros" logo="🚗">
      <div className="space-y-6">
        {/* Header com filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Carros</h2>
            <p className="text-gray-500 text-sm mt-1">{carros.length} carros cadastrados</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              if (showForm && !editingId) setShowForm(false);
              else {
                resetForm();
                setShowForm(true);
              }
            }}
          >
            {showForm && !editingId ? '✕ Cancelar' : '+ Novo Carro'}
          </Button>
        </div>

        {/* Mensagens de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <Card variant="elevated" padding="lg">
            <CardHeader title={editingId ? 'Editar Carro' : 'Novo Carro'} />
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Placa *"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                    required
                  />
                  <Input
                    label="Marca *"
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    placeholder="Toyota"
                    required
                  />
                  <Input
                    label="Modelo *"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Corolla"
                    required
                  />
                  <Input
                    label="Cor"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                    placeholder="Prata"
                  />
                  <Input
                    label="Ano"
                    name="ano"
                    type="number"
                    value={formData.ano}
                    onChange={handleInputChange}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                  />
                  <Input
                    label="Cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="reparo">Em Reparo</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="venda">À Venda</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="primary">
                    {editingId ? '💾 Atualizar' : '➕ Criar'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Filtros e busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="🔍 Buscar por placa, marca, modelo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as typeof filtroStatus)}
            className="sm:w-48"
          >
            <option value="todos">Todos os Status</option>
            <option value="disponivel">✓ Disponível</option>
            <option value="reparo">⚙ Em Reparo</option>
            <option value="manutencao">🔧 Manutenção</option>
            <option value="venda">💰 À Venda</option>
          </Select>
        </div>

        {/* Lista de carros */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-gray-500 mt-2">Carregando...</p>
          </div>
        ) : carrosFiltrados.length === 0 ? (
          <Card variant="flat" padding="lg" className="text-center">
            <p className="text-gray-500">
              {carros.length === 0
                ? 'Nenhum carro cadastrado. Clique em "Novo Carro" para adicionar.'
                : 'Nenhum carro encontrado com os filtros selecionados.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carrosFiltrados.map((carro) => (
              <Card key={carro.id} variant="default" padding="md">
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {carro.marca} {carro.modelo}
                        </h3>
                        <p className="text-sm text-gray-500">{carro.placa}</p>
                      </div>
                      {getStatusBadge(carro.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">Cor:</span> {carro.cor}
                      </div>
                      <div>
                        <span className="text-gray-500">Ano:</span> {carro.ano}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Cliente:</span> {carro.cliente || '-'}
                      </div>
                    </div>
                  </div>
                </CardBody>

                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(carro)}
                  >
                    ✏ Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(carro.id)}
                  >
                    🗑 Deletar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
