# Lista de Tarefas - commit-wizard

## 📁 Estrutura Inicial

- [ ] Criar repositório `commit-wizard`
- [ ] Executar `bun init` e configurar `bin/` como entrada do CLI
- [ ] Criar pastas: `src/config`, `src/core`, `src/git`, `src/ui`, `src/utils`
- [ ] Adicionar suporte a execução global (`bin/commit-wizard.ts` com `#!/usr/bin/env bun`)

## ⚙️ Configuração

- [ ] Criar parser do `.commit-wizardrc`
- [ ] Adicionar suporte a variáveis de ambiente com `dotenv`
- [ ] Adicionar validação de parâmetros (modelo, idioma, etc.)

## 🔍 Git

- [ ] Função para ler `git diff --staged`
- [ ] Validação: avisar se não houver arquivos staged
- [ ] Função para executar `git commit -m "<mensagem>"`

## 🤖 Geração de Commit

- [ ] Construtor de prompt com base no diff e nas configs
- [ ] Função para consumir OpenAI (com retries e timeout)
- [ ] Implementar:
  - [ ] Commit único
  - [ ] Commit split (por arquivo ou trecho)
  - [ ] Preview (dry-run)
- [ ] Detectar tipo de commit (`feat`, `fix`, etc.) automaticamente

## 💬 CLI Interativo

- [ ] Interface com `@clack/prompts`
- [ ] Passos:
  - [ ] Exibir mensagens geradas
  - [ ] Permitir edição da mensagem
  - [ ] Opção de copiar
  - [ ] Confirmar ou cancelar
- [ ] Adicionar modo silencioso (`--yes`, `--silent`)
- [ ] Suporte a modo automático (sem prompts se configurado)

## 🧪 Testes e Validações

- [ ] Verificar comportamento sem internet / sem chave
- [ ] Testar envio de diffs grandes
- [ ] Testar casos com nenhum arquivo modificado
- [ ] Testes unitários com Bun (`bun test`)

## 🚀 Distribuição

- [ ] Configurar `bunfig.toml` para exportar comando CLI
- [ ] Adicionar tag binária no `package.json`
- [ ] Testar execução via `npx` e instalação global
- [ ] Criar `README.md` com exemplos

## 🔁 Futuras melhorias

- [ ] Histórico de commits (JSON local)
- [ ] Integração com Conventional Commits
- [ ] Templates personalizados no prompt
- [ ] UI interativa avançada com preview ao lado
- [ ] Suporte a plugins
