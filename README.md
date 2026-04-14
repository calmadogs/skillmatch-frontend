# 🚀 SkillMatch Frontend

## 📌 Sobre o projeto

O SkillMatch é uma plataforma web que conecta clientes a freelancers, permitindo a criação de projetos, definição de requisitos e candidatura de profissionais de forma prática e eficiente.

Clientes podem criar projetos com orçamento, prazo e habilidades exigidas, enquanto freelancers podem visualizar oportunidades e se candidatar conforme seu perfil.

Este repositório contém o frontend da aplicação, desenvolvido com foco em experiência do usuário, organização e escalabilidade.

---

## 🚀 Tecnologias utilizadas

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Axios
* shadcn/ui

---

## 🎯 Funcionalidades

* Autenticação de usuários (login e registro)
* Dashboard para clientes e freelancers
* Criação de projetos com:

  * título
  * descrição
  * orçamento
  * prazo
  * habilidades exigidas
* Visualização de projetos disponíveis
* Sistema de candidatura
* Cancelamento de candidatura
* Interface moderna e responsiva

---

## ⚙️ Como rodar o projeto

```bash
# Clonar o repositório
git clone https://github.com/calmadogs/skillmatch-frontend.git

# Entrar na pasta
cd skillmatch-frontend

# Instalar dependências
npm install

# Rodar o projeto
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3001
```

---

## 🔐 Autenticação

A autenticação é baseada em token armazenado em cookies.

O frontend utiliza esse token para acessar rotas protegidas e consumir a API.

---

## 📂 Estrutura do projeto

```
app/
 ├── dashboard/
 │    ├── candidaturas/
 │    ├── projetos/
 │    │    ├── [id]/
 │    │    ├── disponiveis/
 │    │    └── novoProjeto/
 │    └── page.tsx
 ├── login/
 ├── register/
 ├── layout.tsx
 ├── page.tsx
 └── globals.css

components/
 ├── layout/
 ├── ui/
 └── modals/

lib/
 ├── api.ts
 ├── auth.ts
 ├── middleware.ts
 ├── queryClient.ts
 ├── skill-icons.ts
 ├── skills.ts
 └── validations/
```

---

## 📄 Licença

Este projeto é apenas para fins de estudo e portfólio.
