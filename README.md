# AgroConnect

AgroConnect é uma aplicação fullstack de backoffice desenvolvida para centralizar solicitações de clientes dentro de um ecossistema de soluções para o agronegócio.

A aplicação oferece uma camada operacional simples onde clientes, áreas de produto e solicitações de serviço podem ser gerenciados em um único lugar. O projeto foi pensado a partir de um desafio comum em ambientes com múltiplos produtos: manter as interações com clientes organizadas quando as demandas podem envolver diferentes áreas de negócio, como gestão agrícola, operações de campo, gestão de sementes, serviços laboratoriais, análise de dados, integrações e suporte técnico.

## Visão Geral

O AgroConnect funciona como uma plataforma leve de gestão de solicitações para operações no agronegócio. Ele permite que uma equipe interna cadastre clientes, classifique solicitações por área de produto, acompanhe o status dos atendimentos, defina prioridades e mantenha um histórico de comunicação por meio de comentários.

O objetivo é oferecer uma base clara e extensível para um backoffice de atendimento e operações, que possa evoluir futuramente para uma plataforma mais ampla de suporte, onboarding ou customer success.

## Funcionalidades Principais

- Cadastro de clientes
- Catálogo de áreas de produto
- Criação de solicitações
- Listagem e filtragem de solicitações
- Acompanhamento de solicitações por status
- Filtro por área de produto
- Classificação por prioridade
- Fluxo de progressão de status
- Comentários e histórico de interações
- Exclusão de solicitações
- Cards de resumo no dashboard
- Notificações via snackbar para feedback ao usuário
- Endpoint de health check da API

## Stack Tecnológica

### Backend

- Ruby on Rails API-only
- PostgreSQL
- Active Record
- API RESTful em JSON

### Frontend

- React
- TypeScript
- Vite
- CSS
- Ícones com Lucide React

### Infraestrutura

- Docker
- Docker Compose
- Hot reload em ambiente de desenvolvimento para frontend e backend

## Arquitetura

O AgroConnect utiliza uma arquitetura fullstack desacoplada:

```text
React + TypeScript SPA
        ↓ HTTP/JSON
Ruby on Rails API
        ↓ Active Record
PostgreSQL
```

O frontend é responsável pela interface do usuário e consome o backend por meio de endpoints REST. O backend expõe uma API JSON, gerencia a persistência dos dados e aplica o fluxo principal das solicitações. O PostgreSQL armazena clientes, áreas de produto, tickets e comentários.

## Modelo de Domínio

A aplicação é organizada em torno de quatro entidades principais:

- **Cliente**: representa um cliente para o qual se pode abrir solicitações.
- **Área de Produto**: representa uma área de negócio ou linha de produto dentro do ecossistema agro.
- **Solicitação**: representa uma demanda de cliente relacionada a uma área de produto específica.
- **Comentário**: representa o histórico de interações de uma solicitação.

Principais relacionamentos:

```text
Cliente          → possui muitas Solicitações
Área de Produto  → possui muitas Solicitações
Solicitação      → pertence a um Cliente
Solicitação      → pertence a uma Área de Produto
Solicitação      → possui muitos Comentários
```

## Fluxo das Solicitações

As solicitações seguem um fluxo operacional simples:

```text
Aberta → Em Andamento → Aguardando Cliente → Resolvida → Fechada
```

Esse fluxo simula um processo básico de suporte ou operação, no qual as solicitações podem ser recebidas, tratadas, pausadas enquanto aguardam retorno do cliente, resolvidas e finalmente encerradas.

## Como Executar o Projeto

### Requisitos

- Docker
- Docker Compose

### Executando a aplicação

A partir da raiz do projeto, execute:

```bash
docker compose up --build
```

Após os containers iniciarem, acesse:

```text
Frontend: http://localhost:5173
Health check do backend: http://localhost:3000/api/v1/health
```

Resposta esperada do health check:

```json
{
  "status": "ok",
  "application": "AgroConnect API"
}
```

## Comandos de Desenvolvimento

Verificar containers em execução:

```bash
docker compose ps
```

Visualizar logs do backend:

```bash
docker compose logs -f api
```

Abrir o console do Rails:

```bash
docker compose exec api bundle exec ./bin/rails console
```

Listar rotas do Rails:

```bash
docker compose exec api bundle exec ./bin/rails routes
```

Recriar o banco de dados:

```bash
docker compose exec api bundle exec ./bin/rails db:drop db:create db:migrate db:seed
```

Executar verificação de tipos no frontend:

```bash
docker compose exec frontend npm run lint
```

## Testes Automatizados

O projeto possui cobertura básica de testes no backend e no frontend, com foco nas principais regras do fluxo de solicitações e na apresentação dos dados na interface.

### Backend

Os testes do backend utilizam a estrutura nativa de testes do Rails.

A cobertura inclui:

- Validação do fluxo de progressão de status das solicitações
- Testes do Service Object `RequestTickets::AdvanceStatus`
- Testes básicos de models
- Testes de endpoints principais da API

Executar todos os testes do backend:

```bash
docker compose exec api bundle exec rails test
```

Executar apenas os testes do fluxo de status:

```bash
docker compose exec api bundle exec rails test test/services/request_tickets/advance_status_test.rb
```

### Frontend

Os testes do frontend utilizam Vitest e Testing Library.

A cobertura inclui:

- Validação dos formatadores de status e prioridade
- Testes de apresentação dos dados dos tickets
- Testes de interação em componentes
- Validação do fluxo de confirmação antes da exclusão de uma solicitação

Executar todos os testes do frontend:

```bash
docker compose exec frontend npm run test
```

Executar verificação de tipos no frontend:

```bash
docker compose exec frontend npm run lint
```

## Endpoints da API

```http
GET    /api/v1/health

GET    /api/v1/customers
POST   /api/v1/customers
DELETE /api/v1/customers/:id

GET    /api/v1/product_areas

GET    /api/v1/request_tickets
POST   /api/v1/request_tickets
PATCH  /api/v1/request_tickets/:id
PATCH  /api/v1/request_tickets/:id/advance_status
DELETE /api/v1/request_tickets/:id

POST   /api/v1/request_tickets/:request_ticket_id/ticket_comments
```

## Roadmap do Produto

O AgroConnect foi projetado como um MVP extensível. Possíveis próximos passos incluem:

- Autenticação e controle de acesso por perfil
- Visões separadas para clientes e equipes internas
- Atribuição de solicitações a usuários internos
- Monitoramento de SLA e prazos de atendimento
- Suporte a anexos, documentos e imagens
- Integrações com e-mail e notificações
- Métricas avançadas no dashboard
- Trilha de auditoria para alterações de status e comentários
- Busca, paginação e filtros avançados
- Quadro de tickets em formato Kanban
