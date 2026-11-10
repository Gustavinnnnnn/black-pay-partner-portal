# Publicar na Vercel

O projeto já tem o `vercel.json`. Ele cuida de: build (`bun run build`), Node 22,
saída gerada pelo Nitro (`.vercel/output`) e servidores na região de São Paulo (`gru1`).

## 1. Enviar o código

Suba a pasta do projeto para um repositório no GitHub e importe esse repositório
na Vercel (Add New Project → Import Git Repository).

## 2. Variáveis de ambiente (obrigatório)

Em **Project Settings → Environment Variables**, adicione as quatro abaixo. Os valores
são os mesmos que estão no arquivo `.env` do projeto — esse arquivo não deve ser
enviado para o GitHub.

| Nome | Onde é usado |
| --- | --- |
| `VITE_SUPABASE_URL` | navegador |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | navegador |
| `SUPABASE_URL` | servidor (envio de candidaturas) |
| `SUPABASE_PUBLISHABLE_KEY` | servidor (envio de candidaturas) |

Deixe todas marcadas para **Production** e **Preview**.

## 3. Autorizar o endereço

Depois do primeiro deploy, abra o endereço da Vercel e use-o nos provedores de
acesso (Google/Lovable) como URL de redirecionamento permitida, senão o primeiro
login dá "Unsupported provider".

## 4. Criar o administrador

1. Acesse `https://SEU-ENDERECO.vercel.app/auth`
2. Clique em **"Primeiro acesso? Criar conta de administrador"** e confirme o e-mail.
3. A primeira conta vira administradora. As seguintes entram em **"Acesso restrito"**.

## 5. Conferir se deu certo

- `/` carrega com os dois cards (Gerente e Suporte).
- Enviar uma candidatura mostra **"CANDIDATURA RECEBIDA!"** e o registro aparece no painel.
- `/admin` abre com contadores, tabela, busca, filtros, exportação CSV e o botão **Chamar**.

## Se aparecer erro no build

- **"nitro isn't installed"** → rode `bun install` e confirme que `nitro` está em
  `devDependencies` do `package.json`.
- **Site abre em branco** → faltam as variáveis `VITE_...` no passo 2.
- **Envio de candidatura falha** → faltam `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY`.

## Atualizar depois de mexer no código

Cada push no ramo principal publica sozinho. Se preferir pelo terminal:

```bash
bunx vercel --prod
```
