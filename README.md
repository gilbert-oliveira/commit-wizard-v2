# ��‍♂️ Commit Wizard

Um CLI inteligente para gerar mensagens de commit usando IA, baseado no `git diff --staged`.

## ✨ Funcionalidades

- 🤖 **Geração Inteligente**: Usa OpenAI para criar mensagens de commit contextuais
- 🌍 **Múltiplos Idiomas**: Suporte para português, inglês, espanhol e francês
- 🎨 **Estilos de Commit**: Conventional, Simple e Detailed
- 🧠 **Smart Split**: Agrupamento inteligente de arquivos por contexto usando IA
- ✋ **Split Manual**: Commits separados por arquivo
- 🔄 **Modo Interativo**: Interface amigável com preview e edição
- ⚡ **Modo Automático**: Commit direto sem prompts
- 🔍 **Dry Run**: Visualizar mensagem sem fazer commit
- ⚙️ **Configurável**: Arquivo `.commit-wizardrc` para personalização

## 🚀 Instalação

```bash
# Instalar globalmente
npm install -g commit-wizard

# Ou usar com npx
npx commit-wizard

# Ou instalar localmente
npm install commit-wizard --save-dev
```

## 📖 Uso

### Básico
```bash
# Modo interativo
commit-wizard

# Commit automático
commit-wizard --yes

# Modo silencioso
commit-wizard --silent
```

### Smart Split (Recomendado)
```bash
# Smart split interativo
commit-wizard --smart-split

# Smart split automático
commit-wizard --smart-split --yes

# Visualizar organização sem fazer commit
commit-wizard --smart-split --dry-run
```

### Split Manual
```bash
# Split manual por arquivo
commit-wizard --split

# Split automático
commit-wizard --split --yes
```

### Outras Opções
```bash
# Modo totalmente automático
commit-wizard --auto

# Apenas visualizar mensagem
commit-wizard --dry-run

# Mostrar ajuda
commit-wizard --help
```

## 🧠 Smart Split

O **Smart Split** é uma funcionalidade avançada que usa IA para analisar o contexto das mudanças e agrupar arquivos relacionados em commits lógicos.

### Como Funciona

1. **Análise de Contexto**: A IA analisa todos os arquivos modificados e o diff geral
2. **Agrupamento Inteligente**: Identifica relacionamentos lógicos entre as mudanças
3. **Commits Organizados**: Cria commits separados para cada grupo de funcionalidade

### Exemplo

```bash
$ commit-wizard --smart-split

🧠 Modo Smart Split ativado - Agrupando arquivos por contexto
🤖 Analisando contexto das mudanças...
✅ 3 grupo(s) identificado(s):
  1. Sistema de Autenticação (2 arquivo(s))
     📄 src/auth/login.ts, src/auth/register.ts
  2. Componentes de UI (3 arquivo(s))
     📄 src/components/Button.tsx, src/components/Input.tsx, src/components/Modal.tsx
  3. Configuração de API (1 arquivo(s))
     📄 src/config/api.ts
```

### Vantagens

- **Histórico Limpo**: Commits organizados por funcionalidade
- **Code Review Eficiente**: Pull requests mais focados
- **Debugging Melhorado**: Identificação rápida de commits problemáticos

## ⚙️ Configuração

### Arquivo `.commit-wizardrc`

```json
{
  "openai": {
    "model": "gpt-4o",
    "maxTokens": 150,
    "temperature": 0.7
  },
  "language": "pt",
  "commitStyle": "conventional",
  "splitCommits": false,
  "dryRun": false,
  "prompt": {
    "includeFileNames": true,
    "includeDiffStats": true,
    "customInstructions": ""
  }
}
```

### Variáveis de Ambiente

```bash
export OPENAI_API_KEY="sua-chave-aqui"
```

## 📋 Opções de Linha de Comando

| Opção | Descrição |
|-------|-----------|
| `--yes`, `-y` | Confirmar automaticamente sem prompts |
| `--silent`, `-s` | Modo silencioso (sem logs detalhados) |
| `--auto`, `-a` | Modo automático (--yes + --silent) |
| `--split` | Split manual (commits separados por arquivo) |
| `--smart-split` | Smart split (IA agrupa por contexto) |
| `--dry-run`, `-n` | Visualizar mensagem sem fazer commit |
| `--help`, `-h` | Mostrar ajuda |
| `--version`, `-v` | Mostrar versão |

## 🎯 Exemplos de Uso

### Desenvolvimento Normal
```bash
# Adicionar arquivos
git add .

# Gerar commit inteligente
commit-wizard
```

### Feature Completa
```bash
# Adicionar todos os arquivos da feature
git add .

# Smart split para organizar commits
commit-wizard --smart-split
```

### Correção Rápida
```bash
# Adicionar arquivos da correção
git add src/fix.ts

# Commit automático
commit-wizard --yes
```

### Preview Antes do Commit
```bash
# Ver como ficaria a mensagem
commit-wizard --dry-run
```

## 🔧 Desenvolvimento

```bash
# Clonar repositório
git clone https://github.com/user/commit-wizard.git
cd commit-wizard

# Instalar dependências
npm install

# Executar testes
npm test

# Build do projeto
npm run build

# Instalar localmente
npm link
```

## 📚 Documentação

- [Guia de Configuração](docs_ai/configuration.md)
- [Smart Split](docs_ai/smart-split.md)
- [Estilos de Commit](docs_ai/commit-styles.md)
- [Troubleshooting](docs_ai/troubleshooting.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [OpenAI](https://openai.com/) pela API de IA
- [Clack](https://github.com/natemoo-re/clack) pela interface CLI
- [Bun](https://bun.sh/) pelo runtime JavaScript
