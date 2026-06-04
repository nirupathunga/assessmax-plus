export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  projectsCount: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  date: string;
  drawingType: string;
  value: number; // in INR
  status: 'Success' | 'Pending' | 'Failed';
  floorsCount?: number;
}

export interface DrawingTypeCard {
  id: string;
  title: string;
  description: string;
}

export type ViewType = 'dashboard' | 'clients' | 'projects' | 'invoices' | 'settings' | 'new-estimation';
