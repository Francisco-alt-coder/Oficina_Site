class Cliente:

    def __init__(
        self,
        nome,
        telefone,
        endereco,
        cep
    ):

        self.nome = nome
        self.telefone = telefone
        self.endereco = endereco
        self.cep = cep

    def mostrar_dados(self):

        print(f"Nome: {self.nome}")
        print(f"Telefone: {self.telefone}")
        print(f"Endereço: {self.endereco}")
        print(f"CEP: {self.cep}")

# Veículo

class Veiculo:

    def __init__(
        self,
        placa,
        modelo,
        marca,
        ano
    ):

        self.placa = placa
        self.modelo = modelo
        self.marca = marca
        self.ano = ano

    def mostrar_dados(self):

        print(f"Placa: {self.placa}")
        print(f"Modelo: {self.modelo}")
        print(f"Marca: {self.marca}")
        print(f"Ano: {self.ano}")

# Ordem De Serviço

class OrdemServico:

    def __init__(
        self,
        produto,
        peca,
        data_abertura,
        data_fechamento,
        status
    ):

        self.produto = produto
        self.peca = peca
        self.data_abertura = data_abertura
        self.data_fechamento = data_fechamento
        self.status = status

    def mostrar_dados(self):

        print(f"Produto: {self.produto}")
        print(f"Peça: {self.peca}")
        print(f"Data abertura: {self.data_abertura}")
        print(f"Data fechamento: {self.data_fechamento}")
        print(f"Status: {self.status}")
        