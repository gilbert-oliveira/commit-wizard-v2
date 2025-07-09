import { log } from '@clack/prompts';
import { loadConfig, validateConfig } from '../config/index.ts';
import { isGitRepository, getGitStatus, getDiffStats } from '../git/index.ts';

export async function main() {
  log.info('🚀 Commit Wizard iniciado!');
  
  // Verificar se estamos em um repositório Git
  if (!isGitRepository()) {
    log.error('❌ Não foi encontrado um repositório Git neste diretório.');
    log.info('💡 Execute o comando em um diretório com repositório Git inicializado.');
    process.exit(1);
  }
  
  // Carregar e validar configuração
  log.info('⚙️  Carregando configuração...');
  const config = loadConfig();
  const configErrors = validateConfig(config);
  
  if (configErrors.length > 0) {
    log.error('❌ Erros na configuração:');
    configErrors.forEach(error => log.error(`  • ${error}`));
    process.exit(1);
  }
  
  log.success(`✅ Configuração carregada (modelo: ${config.openai.model}, idioma: ${config.language})`);
  
  // Verificar arquivos staged
  log.info('📋 Verificando arquivos staged...');
  const gitStatus = getGitStatus();
  
  if (!gitStatus.hasStaged) {
    log.warn('⚠️  Nenhum arquivo foi encontrado no stage.');
    log.info('💡 Use `git add <arquivo>` para adicionar arquivos ao stage antes de gerar o commit.');
    process.exit(0);
  }
  
  const diffStats = getDiffStats();
  log.success(`✅ Encontrados ${gitStatus.stagedFiles.length} arquivo(s) staged:`);
  gitStatus.stagedFiles.forEach(file => log.info(`  📄 ${file}`));
  log.info(`📊 Estatísticas: +${diffStats.added} -${diffStats.removed} linhas`);
  
  // TODO: Implementar geração de commit com OpenAI
  log.warn('🚧 Próximo passo: implementar geração com OpenAI...');
} 