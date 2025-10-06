# 🗄️ O que está sendo salvo no banco de dados

## 📝 Exemplo: Quando você cria um usuário

### Passo 1: Você chama `signUp.email()`

```typescript
signUp.email({
  email: 'joao@example.com',
  password: 'senha12345',
  name: 'João Silva'
});
```

---

### Passo 2: Better Auth salva na tabela `USER`

```sql
INSERT INTO user VALUES (
  id: "usr_abc123",
  name: "João Silva",
  email: "joao@example.com",
  email_verified: 0,              -- Sempre 0 (false) porque requireEmailVerification: false
  image: NULL,
  created_at: "2025-10-06 15:30:45",  -- ✅ Formato legível agora!
  updated_at: "2025-10-06 15:30:45"
);
```

---

### Passo 3: Better Auth salva na tabela `ACCOUNT`

```sql
INSERT INTO account VALUES (
  id: "acc_xyz789",
  account_id: "joao@example.com",
  provider_id: "credential",      -- ✅ "credential" = email/senha
  user_id: "usr_abc123",
  access_token: NULL,             -- ❌ Vazio (só OAuth)
  refresh_token: NULL,            -- ❌ Vazio (só OAuth)
  id_token: NULL,                 -- ❌ Vazio (só OAuth)
  access_token_expires_at: NULL,  -- ❌ Vazio (só OAuth)
  refresh_token_expires_at: NULL, -- ❌ Vazio (só OAuth)
  scope: NULL,                    -- ❌ Vazio (só OAuth)
  password: "$2b$10$hashed...",   -- ✅ Hash bcrypt da senha
  created_at: "2025-10-06 15:30:45",
  updated_at: "2025-10-06 15:30:45"
);
```

---

### Passo 4: Better Auth cria a sessão (tabela `SESSION`)

```sql
INSERT INTO session VALUES (
  id: "ses_def456",
  expires_at: "2025-10-13 15:30:45",  -- 7 dias depois
  token: "random_long_secure_token_here_123abc",
  created_at: "2025-10-06 15:30:45",
  updated_at: "2025-10-06 15:30:45",
  ip_address: "192.168.1.100",        -- ✅ IP do usuário
  user_agent: "Mozilla/5.0...",       -- ✅ Navegador usado
  user_id: "usr_abc123"
);
```

---

### Passo 5: Cookie é salvo no navegador

```http
Set-Cookie: auth.session_token=random_long_secure_token_here_123abc;
            HttpOnly;
            Secure;
            SameSite=Lax;
            Max-Age=604800
```

---

## 🔄 O que acontece quando você faz login?

### Usuário faz login:

```typescript
signIn.email({
  email: 'joao@example.com',
  password: 'senha12345'
});
```

### Better Auth:

1. ✅ Busca na tabela `account` por `provider_id = "credential"` e `account_id = "joao@example.com"`
2. ✅ Compara o hash da senha
3. ✅ Cria uma **NOVA sessão** na tabela `session`
4. ✅ Retorna o token para o navegador

---

## 🚫 Tabela `VERIFICATION` (vazia)

Como você tem `requireEmailVerification: false`, essa tabela **nunca é usada**.

Se estivesse ativada, teria algo assim:

```sql
-- Exemplo hipotético (não acontece na sua implementação)
INSERT INTO verification VALUES (
  id: "ver_ghi789",
  identifier: "joao@example.com",
  value: "123456",                   -- Código de 6 dígitos
  expires_at: "2025-10-06 16:30:45", -- Expira em 1 hora
  created_at: "2025-10-06 15:30:45",
  updated_at: "2025-10-06 15:30:45"
);
```

---

## 📊 Comparação: Email/Senha vs OAuth

### 🔐 Seu caso (Email/Senha):

```
ACCOUNT:
├─ provider_id: "credential"
├─ password: "$2b$10$hash..."  ✅
├─ access_token: NULL          ❌
└─ refresh_token: NULL         ❌
```

### 🌐 Se fosse OAuth (Google):

```
ACCOUNT:
├─ provider_id: "google"
├─ password: NULL              ❌
├─ access_token: "ya29.a0..."  ✅ Token do Google
├─ refresh_token: "1//0e..."   ✅ Para renovar
├─ access_token_expires_at: "2025-10-06 16:30:45"
└─ scope: "email profile"      ✅ Permissões
```

---

## 🔍 Como consultar seus dados

### Ver todos os usuários:

```sql
SELECT id, name, email, created_at
FROM user;
```

### Ver sessões ativas de um usuário:

```sql
SELECT
  id,
  ip_address,
  user_agent,
  created_at,
  expires_at
FROM session
WHERE user_id = 'usr_abc123'
  AND expires_at > datetime('now')
ORDER BY created_at DESC;
```

### Ver método de login de um usuário:

```sql
SELECT
  u.name,
  u.email,
  a.provider_id,
  CASE
    WHEN a.password IS NOT NULL THEN 'Email/Senha'
    WHEN a.access_token IS NOT NULL THEN 'OAuth'
  END as tipo_login
FROM user u
JOIN account a ON u.id = a.user_id;
```

---

## 🎯 CONCLUSÃO

| Tabela           | Status  | Campos Usados                               | Campos Vazios                                          |
| ---------------- | ------- | ------------------------------------------- | ------------------------------------------------------ |
| **user**         | ✅ 100% | Todos                                       | Nenhum                                                 |
| **account**      | ⚠️ 50%  | id, accountId, providerId, userId, password | accessToken, refreshToken, idToken, scope, \*ExpiresAt |
| **session**      | ✅ 100% | Todos                                       | Nenhum                                                 |
| **verification** | ❌ 0%   | Nenhum                                      | Todos (tabela vazia)                                   |

**Os campos vazios existem para compatibilidade futura com OAuth.**
