# 📋 Cursor Rules - Guia de Uso

## O Que São Cursor Rules?

Cursor Rules são regras e padrões do projeto que são automaticamente fornecidos para a IA do Cursor. Elas garantem consistência, qualidade e alinhamento com as melhores práticas do projeto.

## 📁 Localização

```
.cursor/rules/
  └── projeto-maquinas.mdc  # Regras principais do projeto
```

## 🎯 O Que Está Configurado

### 1. **Sempre Aplicado** (`alwaysApply: true`)

A regra `projeto-maquinas.mdc` é **sempre aplicada** em todas as conversas com a IA, garantindo consistência total.

### 2. **Princípios Fundamentais**

- ✅ Code best practices
- ✅ Princípio DRY (Don't Repeat Yourself)
- ✅ TypeScript rigoroso
- ✅ Código limpo e legível
- ✅ Sem TODOs ou placeholders

### 3. **Arquitetura do Projeto**

- Stack: Next.js 15, TypeScript, TailwindCSS, TanStack Query
- Estrutura de pastas padronizada
- Server Actions como padrão
- API Routes só para uploads/webhooks

### 4. **Padrões de Código**

#### Server Actions

```typescript
'use server';

export async function action() {
  try {
    const resultado = await db...;
    return { success: true, data: resultado };
  } catch (error) {
    console.error('Erro:', error);
    return { success: false, message: 'Erro' };
  }
}
```

#### TanStack Query

```typescript
export function useDados() {
  return useQuery({
    queryKey: ['dados'],
    queryFn: async () => {
      const result = await serverAction();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 60 * 5
  });
}
```

#### Renderização Otimista

```typescript
export function useDeletar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => { ... },
    onMutate: async (id) => {
      // Remove otimisticamente
      await queryClient.cancelQueries(['items']);
      const previous = queryClient.getQueryData(['items']);
      queryClient.setQueryData(['items'], (old) =>
        old?.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (err, id, context) => {
      // Reverte em caso de erro
      queryClient.setQueryData(['items'], context?.previous);
    }
  });
}
```

### 5. **Estrutura de Componentes**

```typescript
'use client';

// 1. Imports externos
import { useState } from 'react';

// 2. Imports do projeto
import { Button } from '@/components/ui/button';

// 3. Types
type Props = { ... };

// 4. Componente
export default function Component({ props }: Props) {
  // 5. Hooks
  const router = useRouter();
  const { data } = useQuery(...);
  const [state, setState] = useState();

  // 6. Handlers
  function handleClick() { }

  // 7. Effects
  useEffect(() => { }, []);

  // 8. Early returns
  if (loading) return <Skeleton />;

  // 9. Render
  return <div>...</div>;
}
```

### 6. **Performance**

- ✅ Prefetching ao hover
- ✅ Memoização com `useMemo`/`useCallback`
- ✅ Select fields otimizados
- ✅ Cache inteligente (5 minutos)

### 7. **Convenções de Nomenclatura**

```typescript
// Handlers
const handleClick = () => {};
const handleSubmit = () => {};

// Booleans
const isLoading = false;
const hasError = false;
const shouldUpdate = true;

// Componentes
function CardMaquina() {} // PascalCase

// Variáveis
const userId = 1; // camelCase
```

## 🎨 Benefícios

### 1. **Consistência Total**

Todos os desenvolvedores (e a IA) seguem os mesmos padrões automaticamente.

### 2. **Qualidade Garantida**

- Código sempre segue best practices
- TypeScript rigoroso
- Error handling adequado
- Performance considerada

### 3. **Produtividade**

- IA entende o contexto do projeto
- Menos revisões de código
- Padrões claros e documentados

### 4. **Onboarding Rápido**

Novos desenvolvedores têm um guia completo de como o projeto funciona.

## 📚 Como Usar

### 1. **IA Automática**

A IA já usa estas regras automaticamente! Não precisa fazer nada.

### 2. **Referência Manual**

Consulte `.cursor/rules/projeto-maquinas.mdc` quando tiver dúvidas.

### 3. **Exemplos Práticos**

A regra aponta para arquivos de exemplo:

- `lib/providers/QueryProvider.tsx`
- `app/(dashboard)/maquinas/hooks/useMaquinas.ts`
- `app/(dashboard)/maquinas/_actions/listar-maquinas.ts`
- `app/(dashboard)/maquinas/_components/CardMaquina.tsx`

## ✅ Checklist (da Regra)

Antes de finalizar qualquer código:

- [ ] Imports corretos e organizados
- [ ] Types definidos
- [ ] Error handling implementado
- [ ] Loading e error states
- [ ] TanStack Query sendo usado
- [ ] Código formatado
- [ ] Sem erros de lint
- [ ] Funcionalidade 100% completa
- [ ] Acessibilidade considerada
- [ ] Performance considerada

## 🚫 Não Fazer (da Regra)

❌ **NUNCA:**

- Use `any` sem justificativa
- Deixe TODOs ou placeholders
- Crie API Routes para CRUD (use server actions)
- Ignore erros
- Use CSS inline (use Tailwind)
- Esqueça acessibilidade
- Use cache do Next.js (problemático)

## 🔄 Atualizando as Regras

Para atualizar as regras:

1. Edite `.cursor/rules/projeto-maquinas.mdc`
2. Salve o arquivo
3. As mudanças são aplicadas automaticamente

## 📖 Estrutura do Arquivo

```markdown
---
alwaysApply: true
description: Descrição da regra
---

# Título

Conteúdo em Markdown...

## Referências a arquivos

[arquivo.ts](mdc:path/to/arquivo.ts)
```

### Metadados Possíveis:

- `alwaysApply: true/false` - Aplica em todas requests
- `description: string` - Permite IA buscar a regra
- `globs: string` - Patterns de arquivos (ex: `*.ts,*.tsx`)

## 💡 Dicas

### 1. **Referências de Arquivos**

Use `[nome](mdc:path/to/file)` para referenciar arquivos do projeto. A IA consegue navegar até eles.

### 2. **Regras Específicas**

Crie regras específicas para features complexas:

```markdown
---
description: Regras para sistema de autenticação
globs: **/auth/**/*.ts,**/auth/**/*.tsx
---
```

### 3. **Mantenha Simples**

Regras devem ser práticas e diretas. Se muito complexa, divida em múltiplas regras.

## 🎯 Resultado

Com as Cursor Rules implementadas:

- ✅ IA entende padrões do projeto
- ✅ Código consistente automaticamente
- ✅ Best practices sempre aplicadas
- ✅ Menos bugs e problemas
- ✅ Documentação viva e atualizada
- ✅ Onboarding simplificado

## 📚 Recursos

- [Cursor Rules Docs](https://docs.cursor.com/rules)
- [MDC Format](https://content.nuxt.com/usage/markdown)

---

**As regras estão ativas e sendo aplicadas em todas as conversas com a IA!** 🎉
