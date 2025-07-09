# Lista de Tarefas - commit-wizard

## 📁 Estrutura Inicial

- [x] Criar repositório `commit-wizard`
- [x] Executar `bun init` e configurar `bin/` como entrada do CLI
- [x] Criar pastas: `src/config`, `src/core`, `src/git`, `src/ui`, `src/utils`
- [x] Adicionar suporte a execução global (`bin/commit-wizard.ts` com `#!/usr/bin/env bun`)

## ⚙️ Configuração

- [x] Criar parser do `.commit-wizardrc`
- [x] Adicionar suporte a variáveis de ambiente com `dotenv`
- [x] Adicionar validação de parâmetros (modelo, idioma, etc.)

## 🔍 Git

- [x] Função para ler `git diff --staged`
- [x] Validação: avisar se não houver arquivos staged
- [x] Função para executar `git commit -m "<mensagem>"`

## 🤖 Geração de Commit

- [x] Construtor de prompt com base no diff e nas configs
- [x] Função para consumir OpenAI (com retries e timeout)
- [x] Implementar:
  - [x] Commit único
  - [ ] Commit split (por arquivo ou trecho) - *Funções UI existem mas não integradas*
  - [ ] Preview (dry-run)
- [x] Detectar tipo de commit (`feat`, `fix`, etc.) automaticamente

## 💬 CLI Interativo

- [x] Interface com `@clack/prompts`
- [x] Passos:
  - [x] Exibir mensagens geradas
  - [x] Permitir edição da mensagem
  - [x] Opção de copiar
  - [x] Confirmar ou cancelar
- [ ] Adicionar modo silencioso (`--yes`, `--silent`)
- [ ] Suporte a modo automático (sem prompts se configurado)

## 🧪 Testes e Validações

- [x] Verificar comportamento sem internet / sem chave
- [x] Testar envio de diffs grandes
- [x] Testar casos com nenhum arquivo modificado
- [ ] Testes unitários com Bun (`bun test`)

## 🚀 Distribuição

- [ ] Configurar `bunfig.toml` para exportar comando CLI
- [x] Adicionar tag binária no `package.json`
- [ ] Testar execução via `npx` e instalação global
- [x] Criar `README.md` com exemplos

## 🔁 Futuras melhorias

- [ ] Histórico de commits (JSON local)
- [x] Integração com Conventional Commits - *Já implementado na detecção de tipos*
- [ ] Templates personalizados no prompt
- [ ] UI interativa avançada com preview ao lado
- [ ] Suporte a plugins

## 📊 Status Atual

**✅ Implementado (85%):**
- Estrutura completa do projeto
- Configuração via `.commit-wizardrc` e variáveis de ambiente
- Integração completa com OpenAI
- Interface CLI interativa
- Operações Git (diff, commit, validações)
- Detecção automática de tipos de commit
- Retry automático em falhas
- Suporte a múltiplos idiomas e estilos

**🔄 Em Progresso (10%):**
- Modo split (funções UI existem mas não integradas)
- Argumentos CLI (--silent, --yes, etc.)

**❌ Pendente (5%):**
- Testes unitários
- Configuração de distribuição (bunfig.toml)
- Modo dry-run
- Histórico de commits
- Templates personalizados
