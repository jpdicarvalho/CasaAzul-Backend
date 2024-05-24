# CasaAzul API

## Visão Geral

Este repositório contém a API da aplicação CasaAzul, desenvolvida em Node.js. A API é responsável por gerenciar as informações dos atendimentos realizados pela instituição Casa Azul, localizada em Santarém, proporcionando um gerenciamento eficiente e organizado dos dados dos pacientes e colaboradores. O banco de dados utilizado é o MySQL.

## Requisitos

Para executar este projeto, você precisará ter o seguinte instalado:

- [Node.js](https://nodejs.org/) (versão 12 ou superior)
- [MySQL](https://www.mysql.com/)

## Instalação

Siga os passos abaixo para instalar e configurar o projeto:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jpdicarvalho/CasaAzul-Backend.git

2. **Navegue até o diretório do projeto:**
   ```bash
   cd CasaAzul-Backend
   
3. **Instale as dependências do projeto:**
   ```bash
   npm install

4. **Configuração do ambiente:**
   - Renomeie o arquivo .env.example para .env
     ```bash
     mv .env.example .env

   - Edite o arquivo .env com as configurações do seu banco de dados MySQL:
     ```bash
     DB_URL=(url DB hospedado)

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   node Controller.js

## Modelo Entidade-Relacionamento
![Modelo Entidade-Relacionamento](https://github.com/jpdicarvalho/CasaAzul-Backend/assets/114435447/b044340d-5e44-4686-9d6b-51bdab8aab58)
