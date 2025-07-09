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
  - [x] Commit split (por arquivo ou trecho) - *✅ Implementado e integrado*
  - [x] Preview (dry-run) - *✅ Implementado via --dry-run*
- [x] Detectar tipo de commit (`feat`, `fix`, etc.) automaticamente

## 💬 CLI Interativo

- [x] Interface com `@clack/prompts`
- [x] Passos:
  - [x] Exibir mensagens geradas
  - [x] Permitir edição da mensagem
  - [x] Opção de copiar
  - [x] Confirmar ou cancelar
- [x] Adicionar modo silencioso (`--yes`, `--silent`) - *✅ Implementado*
- [x] Suporte a modo automático (sem prompts se configurado) - *✅ Implementado via --auto*

## 🧪 Testes e Validações

- [x] Verificar comportamento sem internet / sem chave
- [x] Testar envio de diffs grandes
- [x] Testar casos com nenhum arquivo modificado
- [x] Testes unitários com Bun (`bun test`) - *✅ 24 testes implementados*

## 🚀 Distribuição

- [x] Configurar `bunfig.toml` para exportar comando CLI - *✅ Implementado*
- [x] Adicionar tag binária no `package.json`
- [x] Testar execução via `npx` e instalação global - *✅ Testado com bun link*
- [x] Criar `README.md` com exemplos

## 🔁 Futuras melhorias

- [ ] Histórico de commits (JSON local)
- [x] Integração com Conventional Commits - *Já implementado na detecção de tipos*
- [ ] Templates personalizados no prompt
- [ ] UI interativa avançada com preview ao lado
- [ ] Suporte a plugins

## 📊 Status Final

**✅ Implementado (95%):**
- ✅ Estrutura completa do projeto
- ✅ Configuração via `.commit-wizardrc` e variáveis de ambiente
- ✅ Integração completa com OpenAI
- ✅ Interface CLI interativa
- ✅ Operações Git (diff, commit, validações)
- ✅ Detecção automática de tipos de commit
- ✅ Retry automático em falhas
- ✅ Suporte a múltiplos idiomas e estilos
- ✅ **Argumentos CLI (--silent, --yes, --auto, --split, --dry-run)**
- ✅ **Modo split integrado no fluxo principal**
- ✅ **24 testes unitários implementados**
- ✅ **Configuração de distribuição completa**

**🔄 Funcionalidades Avançadas (5%):**
- Histórico de commits
- Templates personalizados
- Suporte a plugins
- UI avançada

## 🎉 Próximos Passos Implementados

1. ✅ **Argumentos CLI** - Implementado suporte completo a:
   - `--silent` / `-s`: Modo silencioso
   - `--yes` / `-y`: Confirmação automática
   - `--auto` / `-a`: Modo automático (silent + yes)
   - `--split`: Commits separados por arquivo
   - `--dry-run` / `-n`: Visualizar sem commitar
   - `--help` / `-h`: Ajuda
   - `--version` / `-v`: Versão

2. ✅ **Modo Split** - Integrado no fluxo principal:
   - Seleção interativa de arquivos
   - Commits separados por arquivo
   - Suporte a modo automático
   - Tratamento de erros

3. ✅ **Testes Unitários** - 24 testes implementados:
   - Testes de configuração
   - Testes de argumentos CLI
   - Testes de funções OpenAI
   - Cobertura de casos edge

4. ✅ **Distribuição** - Configuração completa:
   - `bunfig.toml` configurado
   - `package.json` otimizado para distribuição
   - Arquivo LICENSE criado
   - Build e instalação local testados

O projeto está agora **95% completo** e pronto para uso em produção! 🚀
