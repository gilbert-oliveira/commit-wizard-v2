# Plano de Ação: commit-wizard

## 🎯 Objetivo

Criar um pacote CLI com Bun.js chamado `commit-wizard`, disponível via `npx` ou instalação global. Ele deve gerar mensagens de commit inteligentes usando a API da OpenAI com base no `git diff`, oferecendo personalização, interatividade e suporte a diferentes estilos de commit.

---

## ⚙️ Funcionalidades Principais

### 🧠 Integração com OpenAI

- Enviar `git diff --staged` como prompt.
- Configurar modelo (ex: `gpt-4o`, `gpt-3.5`), idioma, temperatura e max_tokens.
- Resposta adaptada ao tipo de commit: único ou múltiplo (split).

### ✍️ Modos de Commit

- Commit único (todos os arquivos).
- Commit separado por arquivo ou bloco (split).
- Dry run (simular sem executar).

### 🗂️ Configuração

- `.commit-wizardrc` com:
  - Idioma (`pt`, `en`, etc.)
  - Modelo OpenAI
  - max_tokens
  - Temperatura
  - Auto commit
  - Estilo de commit (convencional, simples, etc.)

### 🧑‍💻 Interação via CLI

- Preview da mensagem gerada.
- Editar antes de commitar.
- Copiar para clipboard.
- Cancelar ou confirmar.

### 💡 Funcionalidades Adicionais

- Sugestão automática de tipo de commit (`feat`, `fix`, etc.).
- Histórico de commits gerados.
- Modo silencioso para automações (`--silent`).
- Integração com hooks (ex: `husky`, `lefthook`).
- Mensagens multilíngues.
- Validação de diffs e chave da OpenAI.

---

## 📦 Tecnologias

- **Bun.js**: Gerenciador e runtime do CLI.
- **OpenAI API**: Geração de texto.
- **Git**: Coleta de alterações staged.
- **@clack/prompts**: Interface amigável via terminal.
- **clipboardy**: Copiar mensagens para a área de transferência.
- **simple-git**: API para Git (se necessário).
- **dotenv**: Para chave da OpenAI.

---

## 🧱 Estrutura Recomendada

```
commit-wizard/
│
├── bin/
│   └── commit-wizard.ts         # Entry point CLI
│
├── src/
│   ├── config/                  # Leitura do .commit-wizardrc
│   ├── core/                    # Lógica principal de geração e envio
│   ├── git/                     # Funções git (diff, commit)
│   ├── ui/                      # CLI interativo (prompts, edição)
│   └── utils/                   # Funções auxiliares
│
├── .commit-wizardrc            # Exemplo de configuração
├── bunfig.toml
├── package.json
└── README.md
```
