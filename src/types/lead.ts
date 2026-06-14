export interface Interaction {
  id: string;
  content: string;
  createdAt: string;
  leadId: string;
}

export interface Attachment {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  createdAt: string;
  leadId: string;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  status: 'Baixa' | 'Média' | 'Alta';
  priority?: 'Baixa' | 'Média' | 'Alta' | string;
  description?: string;
  createdAt: string;
  interactions?: Interaction[]; 
  attachments?: Attachment[];
}