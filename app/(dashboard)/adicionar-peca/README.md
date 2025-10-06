# Sistema de Gerenciamento de Peças

Este módulo implementa um CRUD completo para gerenciar peças usando **Server Actions** do Next.js 15 e **Drizzle ORM**.

## 📁 Estrutura

```
adicionar-peca/
├── _actions/
│   └── pecas.ts          # Server Actions (criar, listar, editar, deletar)
├── _components/
│   ├── FormularioPeca.tsx    # Formulário de criação/edição
│   └── ListaPecas.tsx        # Componente de listagem
├── page.tsx              # Página principal
└── README.md             # Este arquivo
```

## 🚀 Funcionalidades

### ✅ Criar Peça

- Formulário validado com feedback de erros
- Campos: nome (obrigatório), link da loja integrada (obrigatório)
- Toast de sucesso/erro
- Revalidação automática da página

### ✅ Listar Peças

- Grid responsivo com cards
- Link direto para loja integrada em cada card

### ✅ Editar Peça

- Modal com formulário pré-preenchido
- Mesmas validações do criar
- Atualização em tempo real

### ✅ Deletar Peça

- Confirmação antes de deletar
- Toast de feedback
- Atualização automática da lista

## 🔧 Server Actions

Todas as actions estão em `_actions/pecas.ts`:

```typescript
// Listar todas as peças
await listarPecas();

// Criar nova peça
await criarPeca(formData);

// Editar peça existente
await editarPeca(id, formData);

// Deletar peça
await deletarPeca(id);

// Buscar peça específica
await buscarPeca(id);
```

## 📊 Schema do Banco

```typescript
pecas:
  - id: string (PK)
  - nome: string (NOT NULL)
  - linkLojaIntegrada: string (NOT NULL)
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 🎨 Componentes UI Utilizados

- `Card` - Cards para exibir peças
- `Dialog` - Modais para criar/editar
- `Button` - Botões de ação
- `Input` - Campos de formulário
- `Label` - Labels dos campos
- Ícones do `lucide-react`
- Toast do `sonner`

## 💡 Boas Práticas Implementadas

1. **Server Actions**: Todas as operações de banco são server-side
2. **Validação**: Validação no servidor com feedback de erros
3. **Revalidação**: `revalidatePath()` para atualizar dados automaticamente
4. **UX**: Loading states, confirmações, toasts
5. **TypeScript**: Tipagem completa em todo o código
6. **Acessibilidade**: Componentes do Radix UI
7. **Performance**: Server Components quando possível

## 🔄 Fluxo de Dados

1. Usuário preenche formulário
2. `action` é executada no servidor
3. Validação dos dados
4. Operação no banco (Drizzle ORM)
5. Revalidação da rota
6. UI atualizada automaticamente
7. Toast de feedback

## 🎯 Como Usar

1. Acesse `/adicionar-peca` no dashboard
2. Clique em "Nova Peça" para criar
3. Clique em "Editar" no card para editar
4. Clique no ícone de lixeira para deletar
5. Todas as ações mostram feedback visual

## 🔐 Segurança

- Server Actions executam no servidor
- Validação de dados no servidor
- Proteção contra SQL injection (Drizzle ORM)
- Rotas protegidas pelo layout do dashboard
