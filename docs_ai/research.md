# Roteiro Research com IA – Projeto commit-wizard

Este arquivo guia o uso da IA para construir o `commit-wizard` com eficiência, usando a técnica de **Research Driven Development**: quebrar em perguntas e investigar com apoio da IA.

---

## 🧩 1. Entendendo o Domínio

### Perguntas:

- Qual é o objetivo do `commit-wizard`?
- Como gerar mensagens de commit usando a OpenAI?
- Como funciona o comando `git diff --staged`?
- Quais são os limites de uso da API da OpenAI (tokens, formatos, tempo)?
- Quais opções de commit existem? (único, por arquivo, por alteração lógica)

---

## 🔌 2. Ferramentas e Integrações

### Perguntas:

- Quais bibliotecas são boas para prompts CLI com Bun? (ex: clack, prompts, inquirer)
- Qual forma leve de executar comandos Git via código? (`child_process`, `simple-git`, etc)
- Como copiar para a área de transferência via terminal? (ex: `clipboardy`)
- Como armazenar configurações no projeto? (`.rc`, `json`, `env`, etc)
- Como tratar tokens sensíveis (ex: chave OpenAI) com segurança?

---

## 🧠 3. Construção Guiada

### Subetapas:

#### 3.1 Leitura de diff do Git

- Gere uma função que leia o `git diff --staged`
- Faça a função retornar o diff limpo, pronto para enviar à OpenAI

#### 3.2 Integração com OpenAI

- Como enviar uma mensagem para a OpenAI com `fetch`?
- Como construir um prompt com base no diff e nas configs?
- Como receber uma resposta formatada e limpa?

#### 3.3 CLI Interativo

- Gere um CLI com Bun usando `#!/usr/bin/env bun`
- Crie prompts com opções: editar, copiar, commitar, cancelar
- Adicione suporte a `--auto`, `--split`, `--silent`

#### 3.4 Execução do commit

- Como executar `git commit -m "mensagem"` via código?
- Como evitar commit se o usuário cancelar?
- Como aplicar commit múltiplo no modo `--split`?

---

## 🧠 4. Experiências avançadas

### Perguntas:

- Como detectar o tipo do commit baseado no conteúdo? (feat, fix, etc)
- Como permitir configuração via `.commit-wizardrc`?
- Como armazenar o histórico dos commits gerados?
- Como integrar o wizard como pre-commit hook com `husky` ou `lefthook`?
- Como suportar múltiplos idiomas com fallback?
- Como garantir que o diff enviado à OpenAI não ultrapasse o limite de tokens?

---

## 🧪 5. Testes e Robustez

### Perguntas:

- Como simular falta de conexão com a internet?
- O que fazer se a chave da OpenAI estiver inválida?
- Como testar commits sem arquivos staged?
- Como evitar travamentos em diffs grandes?

---

## Dica de Prompt final

> "Considere que estou construindo um CLI chamado commit-wizard com Bun. Ele usa a OpenAI para gerar mensagens de commit com base no git diff dos arquivos staged. Quero que a mensagem seja interativa, editável e possa ser copiada. Pode me ajudar a gerar a função que faz X?"
