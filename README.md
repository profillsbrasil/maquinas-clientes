# Máquina Clientes - Profills

Sistema de gestão de clientes com autenticação.

## Setup Rápido

```bash
# Instalar
bun install

# Configurar .env
TURSO_DATABASE_URL=sua-url
TURSO_AUTH_TOKEN=seu-token
BETTER_AUTH_SECRET=gerar-com-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# Aplicar schema
bun run db:push

# Rodar
bun run dev
```

## Estrutura

```
app/
  ├── (dashboard)/           # Rotas autenticadas (compartilham layout)
  │   ├── layout.tsx         # Layout com Sidebar + Header (estado persistente)
  │   ├── page.tsx           # Dashboard principal (/)
  │   └── clientes/          # Página de clientes (/clientes)
  │
  ├── (auth)/                # Rotas públicas (sem layout)
  │   ├── login/             # Login
  │   └── signup/            # Registro
  │
  ├── _components/           # Componentes compartilhados
  │   └── sidebar/
  │       ├── Sidebar.tsx
  │       └── Header.tsx
  │
  └── api/auth/[...all]/     # API Better Auth

lib/
  ├── auth.ts                # Config Better Auth (servidor)
  ├── auth-client.ts         # Cliente React (hooks)
  ├── auth-helpers.ts        # Helpers reutilizáveis
  └── utils.ts

db/schema/                   # Schemas do banco
```

## Como Criar Novas Páginas

### Página Autenticada (com sidebar):

Criar em `app/(dashboard)/nova-pagina/page.tsx`:

```tsx
export default function NovaPaginaPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h1>Nova Página</h1>
      </div>
    </main>
  );
}
```

✅ **Sidebar e Header automáticos**
✅ **Estado da sidebar persiste**
✅ **Validação de auth automática**

### Página Pública (sem sidebar):

Criar em `app/(auth)/nova-pagina/page.tsx`

## Comandos

```bash
bun run dev          # Dev
bun run build        # Build
bun run db:push      # Aplicar schema
bun run db:studio    # UI do banco
```

## Route Groups (Next.js 13+)

- `(dashboard)` - Layout compartilhado, estado persistente
- `(auth)` - Sem layout, páginas públicas
- Os parênteses não aparecem na URL
