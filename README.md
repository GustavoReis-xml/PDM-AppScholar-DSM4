# 🎓 App Scholar

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**App Scholar** é um Portal Acadêmico Institucional completo projetado para dispositivos móveis. A plataforma gerencia de forma centralizada a relação entre alunos, professores e a administração de uma instituição de ensino. Com um design moderno utilizando a estética *Glassmorphism*, o App Scholar oferece uma experiência premium e intuitiva para toda a comunidade acadêmica.

## 🎬 Vídeo Demonstrativo

[![Assista à demonstração](https://img.shields.io/badge/▶_Assistir_no_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/vCUaJzKt2PQ)

---

## ✨ Principais Funcionalidades

O sistema conta com três níveis de acesso com permissões rigorosas:

### 🛡️ Administrador
- **Gestão de Usuários:** Cadastro, edição e exclusão de Alunos e Professores.
- **Gestão Acadêmica:** Criação e manutenção do catálogo de Disciplinas.
- **Controle de Matrículas:** Associação granular de alunos às suas respectivas disciplinas via *switches* dinâmicos.
- **Visualização Global:** Acesso completo a toda a base de dados, permitindo a visualização do boletim de qualquer aluno com 1 clique.

### 👩‍🏫 Professor
- **Painel de Lançamento:** Acesso restrito apenas aos alunos oficialmente matriculados nas matérias que leciona.
- **Gestão de Notas:** Lançamento de notas P1, P2 e cálculo automático de médias e status final (Aprovado/Reprovado).
- **Acesso Rápido:** Consulta de boletim de seus alunos para verificação de dependências.

### 🧑‍🎓 Aluno
- **Boletim Interativo:** Visualização elegante em formato de "Cartão de Vidro" (Glass) do histórico de notas.
- **Dashboard Resumo:** Visualização rápida de disciplinas e status do semestre.

### 🔒 Segurança Comum
- **Criptografia Simétrica:** JWT (JSON Web Tokens) com controle de sessão e papéis (roles).
- **Self-Service:** Alteração de senha autônoma direto no Perfil.

---

## 🛠️ Tecnologias Utilizadas

**Frontend (Mobile App)**
- [React Native](https://reactnative.dev/) (Framework Principal)
- [Expo](https://expo.dev/) (Managed Workflow)
- `expo-blur` (Glassmorphism UI)
- `expo-haptics` (Feedback Tátil/Vibração)
- React Navigation (Navegação em Pilha e Abas)

**Backend (API Rest)**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- `pg` (Cliente PostgreSQL)
- `jsonwebtoken` (Autenticação)

**Banco de Dados**
- [PostgreSQL](https://www.postgresql.org/) (Modelagem Relacional)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (v16 ou superior)
- **PostgreSQL** rodando localmente (porta 5432)

### 1. Configurando o Banco de Dados (Backend)
Abra um terminal, navegue até a pasta `backend` e instale as dependências:
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend` com as credenciais do seu PostgreSQL (ou use o padrão do projeto caso ele crie as tabelas se estiverem vazias):
```env
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_scholar_db
JWT_SECRET=sua_chave_secreta
```

Inicie o servidor (ele cuidará de criar as tabelas e popular os dados de teste na primeira vez):
```bash
npm start
```
> O servidor rodará na porta `3000`.

### 2. Configurando o Aplicativo (Frontend)
Em outro terminal, na raiz do projeto (onde fica o `package.json` do Expo), instale as dependências:
```bash
npm install
```

Caso você vá testar em um dispositivo físico usando o Expo Go, você precisará informar o IP local do seu computador para o App conseguir se conectar na API. Vá no arquivo `src/services/api.js` e troque a `BASE_URL`:
```javascript
const BASE_URL = 'http://SEU_IP_LOCAL:3000/api';
```

Inicie o Expo:
```bash
npx expo start
```
Abra com o emulador pressionando `a` ou escaneie o QR Code com o app **Expo Go** no seu celular.

---

## 🔑 Contas de Teste (Mock Data)

O sistema conta com massa de dados rica para facilitar os testes. **O banco de dados é recriado e preenchido automaticamente caso as tabelas estejam vazias.**

**1. Administrador (Acesso total)**
- **Email:** `admin@fatec.sp.gov.br` | **Senha:** `admin`

**2. Professores (Acesso à listagem e lançamento de notas de suas disciplinas)**
- **Prof. Alberto Silva (Programação):** `alberto@fatec.sp.gov.br` | Senha: `prof123`
- **Prof. Beatriz Souza (Banco de Dados):** `beatriz@fatec.sp.gov.br` | Senha: `prof123`
- **Prof. Carlos Eduardo (Gestão):** `carlos@fatec.sp.gov.br` | Senha: `prof123`

**3. Alunos (Acesso visualização do próprio boletim)**
- **Lucas Andrade (ADS):** `lucas@fatec.sp.gov.br` | Senha: `aluno123`
- **Felipe Rocha (GTI):** `felipe@fatec.sp.gov.br` | Senha: `aluno123`
- **Juliana Mendes (GTI):** `juliana@fatec.sp.gov.br` | Senha: `aluno123`

*(Nota: Na tela de Login do aplicativo, existem botões coloridos para **Login Rápido** que preenchem as credenciais de teste automaticamente com um clique).*

---

## 🔁 Script de Reset Automático
Se você desconfigurar os dados e quiser voltar o banco de dados pro estado original e limpo, pare a execução do backend e rode:
```bash
node reset_db.js
```
Esse comando dropará todas as tabelas em cascata e executará as *Seeds* originais com toda a coerência restabelecida.

---

> Desenvolvido para a disciplina de Programação de Dispositivos Móveis.
