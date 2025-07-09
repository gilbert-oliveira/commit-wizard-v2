import { log } from '@clack/prompts';
import { loadConfig, validateConfig } from '../config/index.ts';
import { isGitRepository, getGitStatus, getDiffStats, executeCommit } from '../git/index.ts';
import { generateWithRetry } from './openai.ts';
import { 
  showCommitPreview, 
  editCommitMessage, 
  copyToClipboard, 
  confirmCommit, 
  showCommitResult,
  showCancellation 
} from '../ui/index.ts';

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
  
  // Gerar mensagem de commit com OpenAI
  log.info('🤖 Gerando mensagem de commit com IA...');
  
  const result = await generateWithRetry(
    gitStatus.diff,
    config,
    gitStatus.stagedFiles
  );
  
  if (!result.success) {
    log.error(`❌ Erro ao gerar commit: ${result.error}`);
    process.exit(1);
  }
  
  if (!result.suggestion) {
    log.error('❌ Nenhuma sugestão foi gerada');
    process.exit(1);
  }
  
  log.success('✨ Mensagem de commit gerada!');
  
  // Interface interativa
  while (true) {
    const uiAction = await showCommitPreview(result.suggestion, config);
    
    switch (uiAction.action) {
      case 'commit':
        // Commit direto com mensagem gerada
        const commitResult = executeCommit(result.suggestion.message);
        showCommitResult(commitResult.success, commitResult.hash, commitResult.error);
        return;
        
      case 'edit':
        // Editar mensagem
        const editAction = await editCommitMessage(result.suggestion.message);
        if (editAction.action === 'cancel') {
          showCancellation();
          return;
        }
        if (editAction.action === 'commit' && editAction.message) {
          const editCommitResult = executeCommit(editAction.message);
          showCommitResult(editCommitResult.success, editCommitResult.hash, editCommitResult.error);
          return;
        }
        break;
        
      case 'copy':
        // Copiar para clipboard
        await copyToClipboard(result.suggestion.message);
        log.info('🎯 Você pode usar a mensagem copiada com: git commit -m "mensagem"');
        return;
        
      case 'cancel':
        // Cancelar operação
        showCancellation();
        return;
    }
  }
} 