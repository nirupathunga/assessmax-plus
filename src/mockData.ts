import { Client, Project, DrawingTypeCard } from './types';

export const mockClients: Client[] = [
  { id: 'c-1', name: 'Internal Project', contact: 'Internal Architect Team', email: 'internal@assessmax.com', projectsCount: 0 },
  { id: 'c-2', name: 'External Client Partners', contact: 'Lead Supervisor', email: 'external.supervisor@assessmax.com', projectsCount: 0 }
];

export const mockProjects: Project[] = [];

export const mockDrawingTypes: DrawingTypeCard[] = [
  { id: 'foundation', title: 'Foundation', description: 'Foundation and footing concrete reinforcement structure.' },
  { id: 'plinth-beam', title: 'Plinth Beam', description: 'Ground tie-beam layouts and reinforcement details.' },
  { id: 'floor-beam', title: 'Floor Beam', description: 'Slab support beams and structural bending plans.' },
  { id: 'floor-slab', title: 'Floor Slab', description: 'Reinforcement, depth dimensions, and concrete grade.' },
  { id: 'columns', title: 'Columns', description: 'Vertical column design, steel schedule, and coordinates.' },
  { id: 'plan', title: 'Plan', description: 'Internal rooms, partitions, and architectural layout plans.' },
  { id: 'elevation', title: 'Elevation', description: 'External front, side, and rear perspective elevations.' }
];

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}
