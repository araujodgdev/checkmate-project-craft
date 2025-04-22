
# Checkmate - Sistema Inteligente de Checklist para Desenvolvimento

![Checkmate Logo](public/placeholder.svg)

Checkmate é um sistema inteligente de checklist para gerenciamento de projetos de desenvolvimento, com foco em lógica, autenticação, layout responsivo e integração com API externa.

## Funcionalidades Principais

### Autenticação e Gerenciamento de Usuários
- Login e cadastro de usuários com e-mail/senha via Supabase Auth
- Perfil de usuário personalizado com visualização de estatísticas
- Proteção de rotas para usuários autenticados

### Dashboard de Projetos
- Visualização de todos os projetos do usuário
- Estatísticas e métricas de progresso dos projetos
- Filtragem e ordenação de projetos

### Gerenciamento de Projetos
- Criação de novos projetos com definição de nome, descrição, tipo e tecnologias
- Edição de informações do projeto
- Definição de prazos e monitoramento de progresso
- Compartilhamento de projetos via links públicos

### Sistema de Checklists
- Criação de múltiplos checklists para cada projeto
- Adição de tarefas dentro de cada checklist
- Marcação de tarefas como concluídas
- Filtragem de tarefas (todas, pendentes, concluídas)
- Visualização de progresso por checklist e geral do projeto

### Gerenciamento de Tarefas
- Adição de tarefas com descrição detalhada

### Gerenciamento de Arquivos
- Upload e gerenciamento de arquivos relacionados ao projeto
- Visualização de documentos diretamente na plataforma

### Exportação e Compartilhamento
- Exportação de checklists e projetos em formato PDF
- Compartilhamento de projetos com links públicos para visualização
- Permissões configuráveis para visualização de informações do projeto

### Interface Responsiva
- Design adaptável para dispositivos móveis e desktop
- Layout otimizado para diferentes tamanhos de tela
- Componentes interativos responsivos

### Análise e Estatísticas
- Visualização de progresso geral dos projetos
- Análise de tecnologias mais utilizadas
- Estatísticas de projetos concluídos e em andamento

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React
- **Gerenciamento de Estado**: TanStack Query, Zustand
- **Autenticação e Banco de Dados**: Supabase
- **Roteamento**: React Router
- **Visualização de Dados**: Recharts

## Estrutura do Projeto

O projeto é organizado em uma arquitetura modular:

- `/components`: Componentes reutilizáveis da interface
- `/hooks`: Hooks personalizados para lógica de negócios
- `/lib`: Utilidades e configurações
- `/pages`: Páginas principais da aplicação
- `/integrations`: Integrações com serviços externos

## Como Utilizar

1. Crie uma conta ou faça login
2. Na dashboard, crie um novo projeto
3. Adicione checklists ao projeto
4. Adicione tarefas aos checklists
5. Acompanhe o progresso e gerencie suas tarefas
6. Compartilhe o projeto com sua equipe quando necessário

## Funcionalidades Avançadas

### Modo Público
O sistema permite compartilhar projetos em modo público, permitindo que usuários não autenticados visualizem (mas não editem) projetos específicos.

### Análise de Progresso
O sistema calcula automaticamente o progresso dos projetos com base nas tarefas concluídas, fornecendo métricas em tempo real.
