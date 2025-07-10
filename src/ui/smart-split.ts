import { 
  select, 
  confirm, 
  log, 
  note,
  cancel,
  isCancel,
  text,
  multiselect
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

  const action = await select({
    message: 'O que você gostaria de fazer?',
    options: [
      {
        value: 'proceed',
        label: '✅ Prosseguir com esta organização',
        hint: 'Usar os grupos como sugeridos pela IA'
      },
      {
        value: 'edit',
        label: '✏️ Editar grupos',
        hint: 'Personalizar os grupos antes de commitar'
      },
      {
        value: 'manual',
        label: '✋ Fazer split manual',
        hint: 'Escolher arquivos manualmente'
      },
      {
        value: 'cancel',
        label: '❌ Cancelar',
        hint: 'Voltar ao modo normal'
      }
    ]
  });

  if (isCancel(action)) {
    return { action: 'cancel' };
  }

  if (action === 'proceed') {
    return { action: 'proceed', groups };
  }

  if (action === 'edit') {
    const editedGroups = await editSmartSplitGroups(groups);
    return { action: 'proceed', groups: editedGroups };
  }

  return { action: action as 'manual' | 'cancel' };
}

/**
 * Interface para editar grupos do smart split
 */
export async function editSmartSplitGroups(groups: FileGroup[]): Promise<FileGroup[]> {
  let editableGroups = [...groups];
  let editing = true;

  while (editing) {
    const groupOptions = editableGroups.map((group, index) => ({
      value: `group-${index}`,
      label: `${group.name} (${group.files.length} arquivos)`,
      hint: group.files.slice(0, 3).join(', ') + (group.files.length > 3 ? '...' : '')
    }));

    const action = await select({
      message: 'Selecione uma ação para editar os grupos:',
      options: [
        ...groupOptions.map(opt => ({
          ...opt,
          label: `✏️ ${opt.label}`,
          value: `edit-${opt.value}`
        })),
        {
          value: 'new-group',
          label: '➕ Criar novo grupo',
          hint: 'Adicionar um grupo personalizado'
        },
        {
          value: 'merge-groups',
          label: '🔗 Mesclar grupos',
          hint: 'Combinar dois ou mais grupos'
        },
        {
          value: 'done',
          label: '✅ Finalizar edição',
          hint: 'Prosseguir com os grupos editados'
        },
        {
          value: 'cancel',
          label: '❌ Cancelar edição',
          hint: 'Voltar aos grupos originais'
        }
      ]
    });

    if (isCancel(action)) {
      return groups; // Retorna grupos originais
    }

    if (action === 'done') {
      editing = false;
    } else if (action === 'cancel') {
      return groups; // Retorna grupos originais
    } else if (action === 'new-group') {
      const newGroup = await createNewGroup(editableGroups);
      if (newGroup) {
        editableGroups.push(newGroup);
      }
    } else if (action === 'merge-groups') {
      editableGroups = await mergeGroups(editableGroups);
    } else if ((action as string).startsWith('edit-group-')) {
      const groupIndex = parseInt((action as string).replace('edit-group-', ''));
      const groupToEdit = editableGroups[groupIndex];
      if (groupToEdit) {
        const editedGroup = await editGroup(groupToEdit, editableGroups);
        if (editedGroup) {
          editableGroups[groupIndex] = editedGroup;
        }
      }
    }

    // Remover grupos vazios
    editableGroups = editableGroups.filter(group => group.files.length > 0);
  }

  return editableGroups;
}

/**
 * Edita um grupo específico
 */
async function editGroup(group: FileGroup, allGroups: FileGroup[]): Promise<FileGroup | null> {
  const action = await select({
    message: `Editando grupo "${group.name}":`,
    options: [
      {
        value: 'rename',
        label: '📝 Renomear grupo',
        hint: 'Alterar nome e descrição'
      },
      {
        value: 'move-files',
        label: '📁 Reorganizar arquivos',
        hint: 'Mover arquivos entre grupos'
      },
      {
        value: 'remove-files',
        label: '➖ Remover arquivos',
        hint: 'Remover arquivos deste grupo'
      },
      {
        value: 'delete-group',
        label: '🗑️ Excluir grupo',
        hint: 'Remover este grupo (arquivos vão para outros grupos)'
      },
      {
        value: 'back',
        label: '↩️ Voltar',
        hint: 'Voltar ao menu principal'
      }
    ]
  });

  if (isCancel(action) || action === 'back') {
    return null;
  }

  const editedGroup = { ...group };

  if (action === 'rename') {
    const newName = await text({
      message: 'Novo nome do grupo:',
      placeholder: group.name,
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Nome não pode ser vazio';
        }
        return undefined;
      }
    });

    if (isCancel(newName)) return null;

    const newDescription = await text({
      message: 'Nova descrição do grupo:',
      placeholder: group.description
    });

    if (isCancel(newDescription)) return null;

    editedGroup.name = newName.trim();
    editedGroup.description = (newDescription || '').trim() || group.description;
  }

  if (action === 'move-files') {
    const otherGroups = allGroups.filter(g => g.id !== group.id);
    
    if (otherGroups.length === 0) {
      log.warn('⚠️ Não há outros grupos para mover arquivos');
      return editedGroup;
    }

    const filesToMove = await multiselect({
      message: 'Selecione os arquivos para mover:',
      options: group.files.map(file => ({
        value: file,
        label: file
      })),
      required: false
    }) as string[];

    if (isCancel(filesToMove) || filesToMove.length === 0) {
      return editedGroup;
    }

    const targetGroup = await select({
      message: 'Para qual grupo mover os arquivos?',
      options: otherGroups.map(g => ({
        value: g.id,
        label: g.name,
        hint: `${g.files.length} arquivos`
      }))
    });

    if (isCancel(targetGroup)) return editedGroup;

    // Mover arquivos
    editedGroup.files = group.files.filter(file => !filesToMove.includes(file));
    
    // Adicionar aos outros grupos (isso seria feito no nível superior)
    const target = allGroups.find(g => g.id === targetGroup);
    if (target) {
      target.files = [...target.files, ...filesToMove];
    }
  }

  if (action === 'remove-files') {
    const filesToRemove = await multiselect({
      message: 'Selecione os arquivos para remover do grupo:',
      options: group.files.map(file => ({
        value: file,
        label: file
      })),
      required: false
    });

    if (isCancel(filesToRemove)) return editedGroup;

    editedGroup.files = group.files.filter(file => !filesToRemove.includes(file));

    if (filesToRemove.length > 0) {
      log.warn(`⚠️ ${filesToRemove.length} arquivo(s) removido(s). Eles precisarão ser adicionados a outro grupo.`);
    }
  }

  if (action === 'delete-group') {
    const confirmDelete = await confirm({
      message: `Tem certeza que deseja excluir o grupo "${group.name}"?`
    });

    if (isCancel(confirmDelete) || !confirmDelete) return editedGroup;

    log.warn(`🗑️ Grupo "${group.name}" será excluído. Arquivos serão redistribuídos.`);
    return { ...editedGroup, files: [] }; // Esvaziar grupo para exclusão
  }

  return editedGroup;
}

/**
 * Cria um novo grupo
 */
async function createNewGroup(existingGroups: FileGroup[]): Promise<FileGroup | null> {
  const name = await text({
    message: 'Nome do novo grupo:',
    placeholder: 'Ex: Correção de bugs',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Nome não pode ser vazio';
      }
      if (existingGroups.some(g => g.name === value.trim())) {
        return 'Já existe um grupo com este nome';
      }
      return undefined;
    }
  });

  if (isCancel(name)) return null;

  const description = await text({
    message: 'Descrição do grupo:',
    placeholder: 'Ex: Correções de validação e interface'
  });

  if (isCancel(description)) return null;

  return {
    id: `custom-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    description: description?.trim() || 'Grupo personalizado',
    files: [],
    diff: '',
    confidence: 1.0 // Máxima confiança para grupos criados pelo usuário
  };
}

/**
 * Mescla grupos
 */
async function mergeGroups(groups: FileGroup[]): Promise<FileGroup[]> {
  if (groups.length < 2) {
    log.warn('⚠️ É necessário ter pelo menos 2 grupos para mesclar');
    return groups;
  }

  const groupsToMerge = await multiselect({
    message: 'Selecione os grupos para mesclar (mínimo 2 grupos):',
    options: groups.map(group => ({
      value: group.id,
      label: `${group.name} (${group.files.length} arquivos)`,
      hint: group.description
    })),
    required: false
  }) as string[];

  if (isCancel(groupsToMerge) || groupsToMerge.length < 2) {
    if (groupsToMerge.length < 2 && groupsToMerge.length > 0) {
      log.warn('⚠️ Selecione pelo menos 2 grupos para mesclar');
    }
    return groups;
  }

  const selectedGroups = groups.filter(g => groupsToMerge.includes(g.id));
  const otherGroups = groups.filter(g => !groupsToMerge.includes(g.id));

  const newName = await text({
    message: 'Nome do grupo mesclado:',
    placeholder: selectedGroups[0]?.name || 'Grupo mesclado',
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Nome não pode ser vazio';
      }
      return undefined;
    }
  });

  if (isCancel(newName)) return groups;

  const newDescription = await text({
    message: 'Descrição do grupo mesclado:',
    placeholder: selectedGroups.map(g => g.description).join('; ')
  });

  if (isCancel(newDescription)) return groups;

  const mergedGroup: FileGroup = {
    id: `merged-${Math.random().toString(36).substr(2, 9)}`,
    name: newName.trim(),
    description: (newDescription || '').trim() || 'Grupo mesclado',
    files: selectedGroups.flatMap(g => g.files),
    diff: '',
    confidence: Math.max(...selectedGroups.map(g => g.confidence))
  };

  return [...otherGroups, mergedGroup];
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