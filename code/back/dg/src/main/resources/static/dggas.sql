-- Criação da tabela Cliente
CREATE TABLE Cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR,
    telefone VARCHAR,
    endereco VARCHAR,
    data_ultima_compra DATE,
    previsao_termino_gas DATE
);

-- Criação da tabela Venda
CREATE TABLE Venda (
    id SERIAL PRIMARY KEY,
    data DATE,
    valor DECIMAL,
    cliente_id INT REFERENCES Cliente(id)
);

-- Criação da tabela Relatorio
CREATE TABLE Relatorio (
    id SERIAL PRIMARY KEY,
    data_geracao DATE,
    tipo VARCHAR,
    conteudo TEXT
);