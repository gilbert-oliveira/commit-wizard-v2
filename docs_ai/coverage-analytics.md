# Coverage Analytics - Codecov

## 🎯 Visão Geral

O sistema de Coverage Analytics do commit-wizard fornece análises avançadas de cobertura de código usando a API do Codecov com CODECOV_TOKEN. Este sistema permite monitoramento contínuo, tendências históricas e insights detalhados sobre a qualidade do código.

## 🚀 Funcionalidades

### 📊 Analytics Avançados
- **Relatórios detalhados**: Cobertura por arquivo, função e linha
- **Tendências históricas**: Análise de evolução da cobertura ao longo do tempo
- **Comparação de branches**: Análise comparativa entre diferentes branches
- **Recomendações inteligentes**: Sugestões baseadas na cobertura atual

### 🔄 Integração Automática
- **GitHub Actions**: Workflow dedicado para analytics
- **Notificações**: Alertas automáticos para cobertura baixa
- **Relatórios**: Geração automática de relatórios JSON
- **Artefatos**: Upload de relatórios como artifacts

### 📈 Monitoramento Contínuo
- **Execução diária**: Analytics executados automaticamente às 6h UTC
- **Workflow manual**: Execução sob demanda via GitHub Actions
- **Múltiplos tipos**: Relatórios, tendências, comparações e análises completas

## 🛠️ Configuração

### 1. Configurar CODECOV_TOKEN

```bash
# Adicionar ao .env
CODECOV_TOKEN=seu_token_aqui

# Ou exportar no terminal
export CODECOV_TOKEN=seu_token_aqui
```

### 2. Executar Setup Automático

```bash
# Executar script de configuração
./scripts/setup-coverage-analytics.sh
```

### 3. Verificar Configuração

```bash
# Testar analytics
bun run coverage:analytics

# Verificar cobertura
bun run test:coverage
```

## 📋 Comandos Disponíveis

### Relatórios Básicos
```bash
# Relatório de cobertura
bun run coverage:report [branch]

# Verificar tendências
bun run coverage:trends

# Comparar branches
bun run coverage:compare [branch1] [branch2]

# Relatório completo
bun run coverage:full [branch]
```

### Analytics Avançados
```bash
# Executar script diretamente
bun run scripts/coverage-analytics.ts report main
bun run scripts/coverage-analytics.ts trends
bun run scripts/coverage-analytics.ts compare main develop
bun run scripts/coverage-analytics.ts full
```

## 🔧 Workflow GitHub Actions

### Trigger Automático
- **Schedule**: Diariamente às 6h UTC
- **Manual**: Via GitHub Actions UI

### Jobs Executados
1. **coverage-analytics**: Gera relatórios e analytics
2. **coverage-trends**: Analisa tendências históricas
3. **coverage-notification**: Envia notificações baseadas na cobertura

### Inputs Disponíveis
- `branch`: Branch para análise (padrão: main)
- `report_type`: Tipo de relatório (report, trends, compare, full)

## 📊 Estrutura de Dados

### CoverageData
```typescript
interface CoverageData {
  total: number;        // Total de linhas
  covered: number;      // Linhas cobertas
  missed: number;       // Linhas não cobertas
  percentage: number;   // Percentual de cobertura
  files: FileCoverage[]; // Cobertura por arquivo
}
```

### FileCoverage
```typescript
interface FileCoverage {
  name: string;         // Nome do arquivo
  total: number;        // Total de linhas
  covered: number;      // Linhas cobertas
  missed: number;       // Linhas não cobertas
  percentage: number;   // Percentual de cobertura
  lines: LineCoverage[]; // Cobertura por linha
}
```

## 🎯 Métricas e Thresholds

### Thresholds Padrão
- **Cobertura Total**: 80% (mínimo)
- **Cobertura por Arquivo**: 80% (recomendado)
- **Threshold de Falha**: 5% (redução máxima permitida)

### Status de Cobertura
- 🟢 **Excelente**: ≥ 90%
- 🟡 **Boa**: 80-89%
- 🔴 **Baixa**: < 80%
- ⚠️ **Crítica**: < 50%

## 📈 Relatórios Gerados

### Relatório JSON
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "branch": "main",
  "summary": {
    "total": 1500,
    "covered": 1200,
    "missed": 300,
    "percentage": 80.0
  },
  "files": [
    {
      "name": "src/core/openai.ts",
      "percentage": 85.5,
      "covered": 171,
      "total": 200
    }
  ]
}
```

### Relatório Console
```
📊 Gerando relatório de analytics de cobertura...

🎯 RESUMO DE COBERTURA
==================================================
📈 Cobertura Total: 85.50%
📊 Linhas Cobertas: 1200
❌ Linhas Não Cobertas: 300
📋 Total de Linhas: 1500

📁 ANÁLISE POR ARQUIVO
==================================================
🟢 src/core/openai.ts: 85.5% (171/200)
🟡 src/config/index.ts: 75.2% (94/125)
🔴 src/utils/args.ts: 45.8% (23/50)

💡 RECOMENDAÇÕES
==================================================
🔴 Cobertura abaixo do ideal (80%)
   → Adicione testes para arquivos com baixa cobertura
   → Foque em arquivos com 0% de cobertura primeiro
```

## 🔔 Notificações

### Alertas Automáticos
- **Cobertura Baixa**: Issue criada automaticamente
- **Tendência Negativa**: Notificação em PRs
- **Sucesso**: Comentário positivo em PRs

### Configuração de Notificações
```yaml
# .codecov.yml
notifications:
  slack:
    url: $CODECOV_SLACK_WEBHOOK
    channel: "#coverage"
  webhook:
    url: $CODECOV_WEBHOOK_URL
```

## 🛡️ Segurança

### Tokens e Autenticação
- **CODECOV_TOKEN**: Token de upload do repositório
- **Autenticação**: Bearer token para API v2
- **Segurança**: Tokens armazenados como secrets

### Configurações de Segurança
```yaml
# .codecov.yml
security:
  require_auth: true
  allow_anonymous: false
```

## 📊 Dashboard e Visualizações

### Links Úteis
- **Dashboard**: https://codecov.io/gh/[owner]/[repo]
- **Analytics**: https://codecov.io/gh/[owner]/[repo]/analytics
- **Settings**: https://codecov.io/gh/[owner]/[repo]/settings

### Métricas Disponíveis
- Cobertura total por branch
- Cobertura por arquivo
- Tendências históricas
- Comparação entre branches
- Análise de impacto de mudanças

## 🔧 Troubleshooting

### Problemas Comuns

**Token não encontrado:**
```bash
# Verificar se o token está configurado
echo $CODECOV_TOKEN

# Configurar token
export CODECOV_TOKEN=seu_token_aqui
```

**Erro de API:**
```bash
# Verificar permissões do token
curl -H "Authorization: Bearer $CODECOV_TOKEN" \
     https://codecov.io/api/v2/gh/[owner]/[repo]/reports/latest
```

**Workflow falha:**
```bash
# Verificar logs do GitHub Actions
# Acessar: https://github.com/[owner]/[repo]/actions
```

### Logs de Debug
```bash
# Executar com verbose
bun run coverage:analytics --verbose

# Verificar configuração
cat .codecov.yml

# Testar conexão
bun run scripts/coverage-analytics.ts
```

## 🚀 Próximas Melhorias

### Planejadas
- [ ] Integração com Slack para notificações
- [ ] Dashboard customizado
- [ ] Análise de impacto de mudanças
- [ ] Relatórios em PDF
- [ ] Integração com SonarQube

### Em Desenvolvimento
- [ ] Métricas de qualidade de código
- [ ] Análise de complexidade ciclomática
- [ ] Recomendações baseadas em ML
- [ ] Integração com IDEs

## 📚 Referências

- [Codecov API v2](https://docs.codecov.io/reference)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Bun Testing](https://bun.sh/docs/cli/test)
- [c8 Coverage](https://github.com/bcoe/c8)

## 🤝 Contribuição

Para contribuir com o Coverage Analytics:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes
5. Execute `bun run coverage:analytics`
6. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](../LICENSE) para detalhes. 