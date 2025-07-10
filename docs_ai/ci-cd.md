# CI/CD Pipeline - commit-wizard

## 🚀 Visão Geral

O projeto commit-wizard possui um pipeline de CI/CD completo implementado com GitHub Actions, garantindo qualidade, segurança e entrega contínua.

## 📋 Workflows Implementados

### 1. Pipeline Principal (`ci.yml`)

**Triggers:**
- Push para `main` e `develop`
- Pull Requests para `main` e `develop`
- Releases publicados

**Jobs:**
- **test**: Testes unitários, cobertura e build
- **lint**: Verificação de formatação e tipos TypeScript
- **integration**: Testes de integração e Smart Split
- **build-test**: Teste de instalação e verificação de build
- **publish**: Publicação automática no NPM (apenas em releases)
- **release**: Criação de assets para GitHub Releases

### 2. Segurança e Análise (`security.yml`)

**Triggers:**
- Push para `main` e `develop`
- Pull Requests para `main` e `develop`
- Agendado: Toda segunda-feira às 2h

**Jobs:**
- **dependency-review**: Análise de dependências em PRs
- **codeql**: Análise de segurança com CodeQL
- **security-audit**: Auditoria de vulnerabilidades
- **code-quality**: Análise de qualidade de código
- **performance**: Testes de performance

### 3. Deploy e Testes (`deploy.yml`)

**Triggers:**
- Push para `main`
- Pull Requests para `main`

**Jobs:**
- **test-dev**: Testes em ambiente de desenvolvimento
- **test-staging**: Testes em ambiente de staging
- **deploy-prod**: Deploy para produção (apenas main)
- **compatibility**: Testes de compatibilidade multi-plataforma
- **performance-test**: Testes de performance

### 4. Proteções de Branch (`branch-protection.yml`)

Configura automaticamente proteções no branch `main`:
- Status checks obrigatórios
- Code review obrigatório
- Proteção contra force push
- Proteção contra deleção

## 🔧 Configurações

### Dependabot (`dependabot.yml`)

**Atualizações automáticas:**
- Dependências do Bun: Semanal (segunda-feira)
- GitHub Actions: Mensal (primeiro dia)

**Configurações:**
- Máximo 10 PRs abertos para dependências
- Máximo 5 PRs para GitHub Actions
- Ignora atualizações major de dependências críticas
- Labels automáticos: `dependencies`, `automated`

### CodeQL (`codeql-config.yml`)

**Análise de segurança:**
- Consultas de segurança padrão e estendidas
- Foco em JavaScript/TypeScript
- Ignora arquivos de build e dependências
- Filtra consultas experimentais

## 📦 Scripts de Release

### Release Automático (`scripts/release.sh`)

**Uso:**
```bash
./scripts/release.sh [patch|minor|major]
```

**Funcionalidades:**
- Validação de branch e mudanças não commitadas
- Execução de testes e build
- Atualização automática de versão
- Criação de tag e push
- Criação de release no GitHub (se gh CLI disponível)
- Instruções de rollback

**Tipos de release:**
- `patch`: 1.0.0 → 1.0.1 (correções)
- `minor`: 1.0.0 → 1.1.0 (novas funcionalidades)
- `major`: 1.0.0 → 2.0.0 (breaking changes)

## 🛡️ Segurança

### Análise de Dependências
- Verificação automática de vulnerabilidades
- Alertas para dependências desatualizadas
- Análise de dependências em PRs

### CodeQL
- Análise estática de código
- Detecção de vulnerabilidades de segurança
- Relatórios detalhados

### Auditoria
- `bun audit` automático
- Verificação de dependências desatualizadas
- Análise de complexidade de código

## 📊 Métricas e Qualidade

### Cobertura de Testes
- Testes unitários obrigatórios
- Testes de integração
- Testes de compatibilidade multi-plataforma

### Performance
- Medição de tempo de build (< 30s)
- Medição de tempo de testes (< 60s)
- Verificação de tamanho de bundle

### Qualidade de Código
- Formatação automática
- Verificação de tipos TypeScript
- Análise de complexidade ciclomática

## 🔄 Fluxo de Trabalho

### Desenvolvimento
1. Criar branch a partir de `develop`
2. Desenvolver funcionalidade
3. Executar testes localmente: `bun test`
4. Fazer commit seguindo conventional commits
5. Criar Pull Request

### CI/CD Automático
1. **Push/PR** → Dispara workflows
2. **Testes** → Validação de qualidade
3. **Segurança** → Análise de vulnerabilidades
4. **Build** → Geração de artefatos
5. **Deploy** → Testes em ambientes

### Release
1. **Merge para main** → Deploy automático
2. **Tag de release** → Publicação no NPM
3. **GitHub Release** → Assets disponíveis

## 🚨 Troubleshooting

### Problemas Comuns

**Build falha:**
```bash
# Verificar dependências
bun install

# Limpar cache
rm -rf node_modules .bun
bun install

# Verificar TypeScript
bun run tsc --noEmit
```

**Testes falham:**
```bash
# Executar testes específicos
bun test tests/unit.test.ts

# Executar com verbose
bun test --reporter=verbose

# Verificar cobertura
bun test --coverage
```

**Release falha:**
```bash
# Verificar permissões
chmod +x scripts/release.sh

# Verificar git status
git status

# Verificar branch
git branch --show-current
```

### Logs e Debug

**GitHub Actions:**
- Acesse: `https://github.com/user/commit-wizard/actions`
- Clique no workflow específico
- Verifique os logs detalhados

**Local:**
```bash
# Executar workflow localmente
bun run ci:test
bun run ci:build
bun run ci:lint
```

## 📈 Melhorias Futuras

### Planejadas
- [ ] Cache de dependências otimizado
- [ ] Testes paralelos
- [ ] Análise de performance mais detalhada
- [ ] Integração com SonarQube
- [ ] Deploy canário
- [ ] Rollback automático

### Monitoramento
- [ ] Métricas de tempo de build
- [ ] Taxa de sucesso de deploys
- [ ] Alertas de falhas
- [ ] Dashboard de qualidade

## 🔗 Links Úteis

- [GitHub Actions](https://github.com/user/commit-wizard/actions)
- [Releases](https://github.com/user/commit-wizard/releases)
- [Issues](https://github.com/user/commit-wizard/issues)
- [Pull Requests](https://github.com/user/commit-wizard/pulls)
- [Security](https://github.com/user/commit-wizard/security)

## 📝 Notas

- Todos os workflows usam Bun 1.0.0
- Node.js 18+ é suportado
- Testes são executados em Ubuntu, macOS e Windows
- Releases são publicados automaticamente no NPM
- Assets são criados para GitHub Releases 