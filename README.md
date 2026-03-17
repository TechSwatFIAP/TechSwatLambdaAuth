# TechSwatLambdaAuth

Function Serverless para autenticacao via CPF e geracao de token JWT.

## Tecnologias

- Node.js 24.x
- AWS Lambda + API Gateway HTTP API v2
- JSON Web Token (JWT / HS256)

## Diagrama

```
+----------+     +--------------+     +-------------+     +--------------+
|  Client  |---->| API Gateway  |---->|   Lambda    |---->| Customer API |
|          |     |  POST /auth  |     | (this repo) |     | GET /users/  |
+----------+     +--------------+     +-------------+     |  document    |
                                            |              +--------------+
                                            v
                                      +-----------+
                                      |   JWT     |
                                      |  Token    |
                                      +-----------+
```

## Fluxo de Autenticacao

1. Cliente envia `cpf` + `otp`
2. Lambda valida o CPF (algoritmo de digitos verificadores)
3. Lambda valida o OTP
4. Lambda gera um token temporario (1 min) com `sub: user:<cpf>` e consulta `GET /api/v1/users/document?documentNumber=<cpf>` na Customer API
5. Se `active: true`, gera e retorna o token final (15 min)

## Variaveis de Ambiente

| Nome | Descricao |
|------|-----------|
| `JWT_SECRET` | Chave secreta para assinatura do token (min. 32 chars) — deve ser a mesma do backend |
| `CUSTOMER_API_URL` | URL base da Customer API (ex: `https://api.techswat.com`) |

Copie `.env.example` para `.env` e preencha os valores antes de executar.

## Execucao Local

```bash
npm install
cp .env.example .env   # preencha as variaveis

# gerar token JWT diretamente (util para testes de integracao)
npm run dev
npm run dev -- 52998224725   # CPF customizado

# simular invocacao completa da Lambda (como API Gateway em PRD)
node -e "require('./src/handler').handler(require('./event.json')).then(r => console.log(JSON.stringify(r, null, 2)))"

# rodar os testes unitarios
npm test
```

## Request/Response (Lambda em producao)

**Request:**
```
POST /auth
Content-Type: application/json

{
  "cpf": "529.982.247-25",
  "otp": "123456"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Respostas de erro:**

| Status | Motivo |
|--------|--------|
| `400` | CPF invalido ou mal formatado |
| `401` | OTP incorreto ou usuario inativo/nao encontrado na Customer API |
| `500` | Erro inesperado interno |

## Token JWT

O token e assinado com HS256 e expira em **15 minutos** em producao. Payload:

```json
{
  "sub": "user:52998224725",
  "scope": "user",
  "iat": 1234567890,
  "exp": 1234568790
}
```

## Deploy

O deploy e feito automaticamente via Terraform no repositorio principal (TechSwat).
