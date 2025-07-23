
export interface TimelineItem {
  id: string;
  data: string;
  item: string;
  tipo: 'trabalho' | 'educacao' | 'projeto' | 'certificacao' | 'outro';
  observacoes: string;
}

export const tipoOptions = [
  { value: 'educacao', label: 'Formação Acadêmica', color: 'purple' },
  { value: 'trabalho', label: 'Experiência Profissional', color: 'blue' },
  { value: 'certificacao', label: 'Certificação', color: 'yellow' },
  { value: 'projeto', label: 'Realização Profissional', color: 'green' },
  { value: 'outro', label: 'Outro', color: 'gray' },
] as const;
