# 🛠️ Sistema de Criação de Máquinas e Adição de Peças

## 📋 Visão Geral

Sistema completo para criar máquinas personalizadas, selecionar imagens de um catálogo e adicionar peças em localizações específicas através de um grid interativo. **Tudo funciona com state local - sem reload de página!**

## ✨ Funcionalidades Principais

### 1. **Configurar Máquina**

- ✅ Nome personalizado da máquina
- ✅ Seleção de imagem de um catálogo com 25+ opções
- ✅ Preview em tempo real na tela principal
- ✅ Modo edição a qualquer momento

### 2. **Grid Interativo (600 Posições)**

- ✅ 30 colunas x 20 linhas = 600 localizações
- ✅ Adicionar peças clicando nos quadrados
- ✅ Visualização imediata (quadrados verdes)
- ✅ **SEM RELOAD** - tudo no estado local

### 3. **Gerenciamento de Peças**

- ✅ Lista em tempo real das peças adicionadas
- ✅ Remover peças individualmente
- ✅ Link direto para loja integrada
- ✅ Contador de peças adicionadas

### 4. **Salvar Máquina**

- ✅ Botão "Salvar Máquina" persiste tudo de uma vez
- ✅ Cria máquina + adiciona todas as peças no banco
- ✅ Redireciona para lista de máquinas após salvar
- ✅ Validação antes de salvar

## 🚀 Como Usar

### Passo 1: Configurar Máquina

1. Acesse `/adicionar-maquina`
2. Digite o nome da máquina (ex: "TP85")
3. Selecione uma imagem do dropdown
4. Clique em "Confirmar"

### Passo 2: Adicionar Peças

1. Veja a imagem da máquina com grid sobreposto
2. Clique em qualquer quadrado vazio (ícone + ao hover)
3. Selecione a peça no dropdown
4. Clique em "Adicionar"
5. A peça aparece instantaneamente na lista e no grid

### Passo 3: Gerenciar Peças

- **Ver detalhes**: Clique no quadrado verde
- **Remover**: Use o botão de lixeira na lista lateral
- **Reconfigurar**: Botão "Configurar" no rodapé

### Passo 4: Salvar

1. Adicione todas as peças desejadas
2. Clique no botão "Salvar Máquina" (rodapé direito)
3. Sistema persiste tudo no banco de dados
4. Redireciona para `/suas-maquinas`

## 🎨 Interface

### Área Principal

- **Esquerda**: Imagem da máquina com grid interativo
- **Direita**: Lista de peças adicionadas

### Rodapé

- **Esquerda**: Botão "Voltar" + Nome da máquina
- **Direita**: Botão "Configurar" + Botão "Salvar Máquina"

## 🔧 Arquitetura Técnica

### Estado Local (sem reload)

```typescript
// Estado da máquina
const [nomeMaquina, setNomeMaquina] = useState('');
const [imagemMaquina, setImagemMaquina] = useState('');

// Estado das peças (array local)
const [pecasAdicionadas, setPecasAdicionadas] = useState<PecaLocalType[]>([]);
```

### Fluxo de Dados

1. **Configuração**: Nome + Imagem → State local
2. **Adicionar Peça**: Clique → Atualiza array local → Re-render
3. **Remover Peça**: Clique → Filtra array → Re-render
4. **Salvar**: Persiste máquina → Loop adiciona peças → Redireciona

### Componentes

#### `FormularioMaquina.tsx`

- Select de imagens do catálogo
- Input de nome
- Callbacks: `onSalvar`, `onCancelar`

#### `AdicionarPeca.tsx`

- Recebe `onAdicionar` callback
- **NÃO** chama server actions
- Atualiza estado local via callback

#### `ListaPecasMaquina.tsx`

- Recebe `onRemover` callback
- Lista local (não do banco)
- Atualização instantânea

#### `page.tsx` (Client Component)

- Gerencia todo o estado
- Grid de 600 posições
- Botão "Salvar" chama actions

### Catálogo de Imagens (`lib/imagens-maquinas.ts`)

Array com 25+ máquinas:

- TP85
- Envolvedora
- Flowpack
- TC 4S 200
- Pouch Pneumática
- E muitas outras...

## 📊 Schemas do Banco

### `maquinas`

```typescript
{
  id: string(PK);
  nome: string;
  imagem: string(URL);
  criadoEm: timestamp;
  alteradoEm: timestamp;
}
```

### `pecas_na_maquina`

```typescript
{
  id: string(PK);
  maquinaId: string(FK);
  pecaId: string(FK);
  localizacao: integer(0 - 599);
}
```

## 🎯 Vantagens da Nova Abordagem

### ✅ Sem Reload de Página

- Adicionar/remover peças é instantâneo
- Melhor UX e performance
- Menos chamadas ao servidor

### ✅ Catálogo de Imagens

- 25+ imagens pré-carregadas
- Não precisa fazer upload
- Seleção rápida via dropdown

### ✅ Preview em Tempo Real

- Vê a máquina enquanto adiciona peças
- Grid interativo sobreposto
- Feedback visual imediato

### ✅ Salvar em Lote

- Só persiste quando clicar em "Salvar"
- Validação antes de salvar
- Melhor controle do processo

## 🔄 Fluxo Completo

```
1. Usuário acessa /adicionar-maquina
   ↓
2. Configura nome + seleciona imagem
   ↓
3. Vê preview da máquina com grid
   ↓
4. Adiciona várias peças (sem reload!)
   ↓
5. Clica em "Salvar Máquina"
   ↓
6. Sistema cria máquina no DB
   ↓
7. Loop adiciona todas as peças
   ↓
8. Redireciona para /suas-maquinas
```

## 📝 Notas Importantes

- **Grid**: 600 posições (índice 0-599)
- **Imagens**: Todas em `/assets/images/maquinas/`
- **State Local**: Peças só persistem ao clicar em "Salvar"
- **Validação**: Não permite salvar sem peças
- **Cancelar**: Pode reconfigurar a qualquer momento

## 🎨 Melhorias de UI/UX

- ✅ Preview da imagem centralizada
- ✅ Contador de peças na lista
- ✅ Botões com ícones descritivos
- ✅ Feedback visual ao adicionar/remover
- ✅ Estado de loading ao salvar
- ✅ Toast notifications

---

**Resultado**: Sistema completo, rápido e sem reloads! 🚀
