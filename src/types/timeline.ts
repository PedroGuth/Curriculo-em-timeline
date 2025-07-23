
export interface TimelineItem {
  id: string;
  data: string;
  item: string;
  tipo: 'trabalho' | 'educacao' | 'projeto' | 'certificacao' | 'outro';
  observacoes: string;
}

export const tipoOptions = [
  { value: 'trabalho', label: 'Trabalho', color: 'blue' },
  { value: 'educacao', label: 'Educação', color: 'purple' },
  { value: 'projeto', label: 'Projeto', color: 'green' },
  { value: 'certificacao', label: 'Certificação', color: 'yellow' },
  { value: 'outro', label: 'Outro', color: 'gray' },
] as const;
