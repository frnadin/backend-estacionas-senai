# 🚗 ParkZone Senai - Backend

Bem-vindo ao repositório do backend do ParkZone Senai! Este projeto é um sistema de controle de acesso ao estacionamento da unidade SENAI São José, desenvolvido como projeto final do curso Técnico em Desenvolvimento de Sistemas (2025/01).

## 📦 Tecnologias Utilizadas

![Node.js](https://img.shields.io/badge/Node.js+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-AUTH-FFB500?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-ENV-green?style=for-the-badge)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Encryption-orange?style=for-the-badge)

---


## 🧠 Funcionalidades Chave

### 🔐 Autenticação e Autorização

- Login com JWT: Autenticação de usuário segura
- Proteção de Rotas: As rotas são protegidas usando um middleware auth
- Acesso Baseado em Permissões: O middleware authorize gerencia as permissões com base nos tipos de usuário

### 👤 Gerenciamento de Pessoas

- Cadastro e Listagem: Cadastre e liste diversos tipos de pessoas (alunos, visitantes, funcionários, administradores, etc.)
- Associação de Veículos: Vincule veículos a indivíduos

### 🚘 Gerenciamento de Veículos

- Registro de Veículos: Registre veículos associados a uma pessoa
- Tipos de Veículos: Suporta diferentes tipos de veículos (carro, moto, outro)

### ✅ Permissões de Acesso

- Controle Granular: Defina permissões de acesso por veículo e pessoa
- Validade e Bloqueio: Controle a validade do acesso e bloqueie entradas com um motivo especificado
- Autorização Automatizada: Autorização automática ou bloqueio na tentativa de entrada

### 📅 Registro de Entrada/Saída

- Criação Automática de Registros: Cria automaticamente registros de entrada e saída
- Verificação de Permissão em Tempo Real: Verifica as permissões no momento da tentativa de entrada
- Log Detalhado: Registra entradas/saídas autorizadas ou bloqueadas com seus respectivos motivos

---


## 🔐 Estrutura do Token JWT

O token JWT gerado após o login inclui os seguintes dados:

```json
{
  "id": 1,
  "email": "usuario@email.com",
  "type": "adminstrador"
}
```

Este token deve ser enviado no cabeçalho da requisição para rotas autenticadas:

Authorization: Bearer SEU_TOKEN_AQUI

🗂️ Estrutura de Pastas
```text
├── controllers/
├── middlewares/
├── models/
├── routes/
├── database.js
├── app.js
└── server.js
```
---

## 📌 Rotas Principais
#### 🔐 Auth
```text
| Método | Rota     | Descrição                |
|--------|----------|--------------------------|
| POST   | `/login` | Autenticação             |
```
#### 👤 Pessoas
```text

| Método | Rota           | Descrição                        | Acesso |
|--------|----------------|----------------------------------|--------|
| GET    | `/pessoas`     | Lista todas as pessoas           | ADM    |
| GET    | `/pessoas/:id` | Lista pessoa por ID              | ADM    |
| POST   | `/pessoas`     | Cria uma nova pessoa             | ADM    |
| PUT    | `/pessoas/:id` | Edita pessoa por ID              | ADM    |
| DELETE | `/pessoas/:id` | Remove pessoa por ID             | ADM    |
| GET    | `/pessoas/eu`  | Retorna dados do usuário logado  | Usuário|
```

#### 🚗 Veículos
```text

| Método | Rota                | Descrição                             | Acesso  |
|--------|---------------------|---------------------------------------|---------|
| GET    | `/veiculos`         | Lista todos os veículos               | ADM     |
| GET    | `/veiculos/meus`    | Lista veículos do usuário autenticado | Usuário |
| POST   | `/veiculos`         | Cria veículo para usuário (ADM)       | ADM     |
| POST   | `/veiculos/meus`    | Cria veículo próprio                  | Usuário |
| PUT    | `/veiculos/meus/:id`| Edita veículo próprio                 | Usuário |
| DELETE | `/veiculos/meus/:id`| Remove veículo próprio                | Usuário |

```

#### 🛡️ Permissões
```text

| Método | Rota          | Descrição                      | Acesso |
|--------|---------------|--------------------------------|--------|
| POST   | `/permissoes` | Cria nova permissão de acesso  | ADM    |
| GET    | `/permissoes` | Lista todas as permissões      | ADM    |
```


#### 📋 Registros de Entrada/Saída
```text

| Método | Rota                              | Descrição                                    | Acesso  |
|--------|-----------------------------------|----------------------------------------------|---------|
| POST   | `/registros`                      | Cria registro de entrada ou saída            | Usuário |
| POST   | `/registros/admin`                | Cria registro para terceiros (ADM)           | ADM     |
| GET    | `/registros/vagas-disponiveis`    | Consulta vagas disponíveis no estacionamento | Ambos   |

```

---

### ⚙️ Variáveis de Ambiente (.env)

Antes de rodar o projeto, configure as seguintes variáveis de ambiente em um arquivo .env na raiz do diretório:

#### env
```bash
PORT=3331
DATABASE_URL='postgresql://usuario:senha@localhost:5432/nome_do_banco'
SECRET_KEY='QSBjdXJpb3NpZGFkZSBtYXRvdSBvIGdhdG8uLi4gbWFzIGVsZSB0aW5oYSA5IHZpZGFzLiBUw6EgdHJhbnF1aWxvLg=='
```
### 🚀 Como Rodar o Projeto

Clone o repositório:

```bash

git clone https://github.com/frnadin/backend-estacionas-senai.git
```
Acesse a pasta do projeto:

```bash

cd backend-estacionas-senai
```
Instale as dependências:

```bash

npm install
```

Configure o arquivo .env: Crie um arquivo .env na raiz e adicione as variáveis de ambiente conforme descrito acima.

---

📚 **Projeto Acadêmico**

Este projeto foi desenvolvido como parte dos requisitos de conclusão do Curso Técnico em Desenvolvimento de Sistemas do SENAI São José (SC) – 1º semestre de 2025.

Desenvolvido por [Fernando](https://github.com/frnadin)  & [João Marques](https://github.com/maarqsz)


[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/frnadin)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fernandomendesgutilla/)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:fernandogutilla@hotmail.com)


---
