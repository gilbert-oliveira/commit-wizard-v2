import { 
  select, 
  confirm, 
  log, 
  note,
  cancel,
  isCancel 
} from '@clack/prompts';
import type { FileGroup } from '../core/smart-split.ts';

export interface SmartSplitAction {
  action: 'proceed' | 'manual' | 'cancel';
  groups?: FileGroup[];
}

/**
 * Interface para escolher entre smart split e split manual
 */
export async function chooseSplitMode(): Promise<SmartSplitAction> {
  const mode = await select({
    message: 'Como você gostaria de organizar os commits?',
    options: [
      {
        value: 'smart',
        label: '🧠 Smart Split (Recomendado)',
        hint: 'IA analisa contexto e agrupa automaticamente'
      },
      {
        value: 'manual',
        label: '✋ Split Manual',
        hint: 'Você escolhe arquivos manualmente'
      },
      {
        value: 'cancel',
        label: '❌ Cancelar',
        hint: 'Voltar ao modo normal'
      }
    ]
  });

  if (isCancel(mode)) {
    return { action: 'cancel' };
  }

  if (mode === 'manual') {
    return { action: 'manual' };
  }

  if (mode === 'smart') {
    return { action: 'proceed' };
  }

  return { action: 'cancel' };
}

/**
 * Exibe os grupos identificados pela IA
 */
export async function showSmartSplitGroups(groups: FileGroup[]): Promise<SmartSplitAction> {
  note(
    `Identificamos ${groups.length} grupo(s) lógico(s) para seus commits:\n\n` +
    groups.map((group, index) => 
      `${index + 1}. **${group.name}**\n` +
      `   📄 ${group.files.join(', ')}\n` +
      `   💡 ${group.description}\n` +
      `   🎯 Confiança: ${Math.round(group.confidence * 100)}%`
    ).join('\n\n'),
    '🧠 Análise de Contexto'
  );

  const proceed = await confirm({
    message: 'Deseja prosseguir com esta organização?'
  });

  if (isCancel(proceed)) {
    return { action: 'cancel' };
  }

  if (proceed) {
    return { action: 'proceed', groups };
  }

  // Se não quiser prosseguir, perguntar se quer fazer manual
  const manual = await confirm({
    message: 'Fazer split manual em vez disso?'
  });

  if (isCancel(manual)) {
    return { action: 'cancel' };
  }

  return { action: manual ? 'manual' : 'cancel' };
}

/**
 * Interface para editar grupos do smart split
 */
export async function editSmartSplitGroups(groups: FileGroup[]): Promise<FileGroup[]> {
  note(
    'Você pode editar os grupos antes de prosseguir:\n' +
    groups.map((group, index) => 
      `${index + 1}. ${group.name} (${group.files.length} arquivos)`
    ).join('\n'),
    '✏️  Editar Grupos'
  );

  const edit = await confirm({
    message: 'Deseja editar algum grupo?'
  });

  if (isCancel(edit) || !edit) {
    return groups;
  }

  // Por enquanto, retorna os grupos originais
  // Implementação completa de edição pode ser adicionada depois
  log.info('💡 Funcionalidade de edição será implementada em breve');
  return groups;
}

/**
 * Interface para confirmar commit de um grupo
 */
export async function confirmGroupCommit(group: FileGroup, message: string): Promise<boolean> {
  note(
    `**Grupo:** ${group.name}\n` +
    `**Arquivos:** ${group.files.join(', ')}\n` +
    `**Mensagem:** "${message}"`,
    '🚀 Confirmar Commit do Grupo'
  );

  const confirmed = await confirm({
    message: `Fazer commit para "${group.name}"?`
  });

  if (isCancel(confirmed)) {
    return false;
  }

  return confirmed;
}

/**
 * Interface para mostrar progresso do smart split
 */
export function showSmartSplitProgress(current: number, total: number, groupName: string): void {
  const progress = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(progress / 10)) + '░'.repeat(10 - Math.floor(progress / 10));
  
  log.info(`🔄 Progresso: [${bar}] ${progress}% (${current}/${total})`);
  log.info(`📋 Processando: ${groupName}`);
} 