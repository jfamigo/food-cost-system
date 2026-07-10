# Food Cost System

Sistema de gestão de custos de insumos (Food Cost e Ficha Técnica Operacional) para cozinhas profissionais e industriais

# Sobre o projeto

Em muitos restaurantes e cozinhas industriais, o controle de custos ainda é feito em planilhas manuais desatualizadas, ou até mesmo, apenas baseado na experiência do chef. Isto gera um problema real e recorrente no setor: 
- Pratos vendidos com margem de lucro menor do que o esperado, ou até no prejuízo, sem que ninguém perceba.

Este sistema resolve esse problema automatizando o cálculo real de custo de cada prato (em espanhol: "escandallo"), considerando:

- **Fator de correção (em espanho: "merma"):**  é a diferença entre o peso bruto e o peso líquido aproveitável
- **Conversão de unidades:** permite registrar receitas em gramas, litros ou unidades, mesmo quando o insumo é comprado em outra unidade de medida
**- Histórico de preços:** restareia automaticamente cada mudança de preço de compra, via trigger no banco de dados
- **Calculo de margem de lucro:** sugere o preço de venda ideal com base no custo real e na margem alvo definida

# Tecnologias utilizadas
**Backend:** Node.js, Express, TypeScript
**Banco de dados**: PostgreSQL
**Arquitetura**: Camadas (Route -> Controller -> Service -> Repository)

# Funcionalidades implementadas
- CRUD completo de insumos (com soft delete)
- CRUD de Fichas Técnicas (receitas)
- Vínculo de insumos a receitas, com validação de unidade de medida
- Cálculo automático de alterações de preço (via trigger PostgreSQL)
- Cálculo completo de Escadallo: custo total, custo por porção e preço de venda sugerido

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL instalado e rodando

### Passo a passo

1. Clone o repositório:
```bash
git clone https://github.com/jfamigo/food-cost-system.git
cd food-cost-system
```

2. Crie o banco de dados no PostgreSQL e execute os scripts:
```bash
psql -U seu_usuario -d nome_do_banco -f database/schema.sql
psql -U seu_usuario -d nome_do_banco -f database/seed.sql
```

3. Configure as variáveis de ambiente:
```bash
cd backend
```
Crie um arquivo `.env` com:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
PORT=3000
```

4. Instale as dependências e rode o servidor:
```bash
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.


### Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/insumos` | Lista todos os insumos ativos |
| POST | `/insumos` | Cria um novo insumo |
| GET | `/insumos/:id` | Busca um insumo específico |
| PUT | `/insumos/:id` | Atualiza um insumo |
| DELETE | `/insumos/:id` | Desativa um insumo (soft delete) |
| GET | `/fichas-tecnicas` | Lista todas as fichas técnicas |
| POST | `/fichas-tecnicas` | Cria uma nova ficha técnica |
| POST | `/fichas-tecnicas/:id/insumos` | Vincula um insumo a uma ficha técnica |
| GET | `/fichas-tecnicas/:id/escandallo` | Calcula o custo total, por porção e preço sugerido de uma receita |

## 🗺️ Roadmap

- [ ] Endpoints de estoque, compras e registro de perdas
- [ ] Frontend em React com dashboard de margem de lucro
- [ ] Testes unitários
- [ ] Deploy em produção

## Autor

Desenvolvido por João Francisco Amigo Gimenes como parte de de projeto para transição de carreira para desenvolvimento de sotftware, unindo experiência prévia em Gestão Estratégica de Negócios Gastronômicos assim como práticas dentro da cozinha industrial.