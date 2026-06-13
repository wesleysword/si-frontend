export interface Lead {
  id: string;
  name: string;
  contact: string;
  status: 'Novo' | 'Em Atendimento' | 'Concluído';
  createdAt: string;
  description?: string;
}