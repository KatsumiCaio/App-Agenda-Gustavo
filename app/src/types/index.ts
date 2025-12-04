export interface Tatuagem {
  id: string;
  cliente: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  valor: number;
  status: 'agendado' | 'concluído' | 'cancelado';
  telefone?: string;
  observacoes?: string;
  imagem?: string;
}

export interface ViewType {
  type: 'dia' | 'semana' | 'mes';
  label: string;
}
