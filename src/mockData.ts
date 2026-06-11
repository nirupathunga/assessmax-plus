import { Client, Project, DrawingTypeCard } from './types';

export const mockClients: Client[] = [
  { id: 'c-1', name: 'Demo Architect Corp', contact: '9876543210', email: 'partner@demoarchitects.com', projectsCount: 0 },
  { id: 'c-2', name: 'Skyline Builders Ltd', contact: '9123456789', email: 'info@skylinebuilders.com', projectsCount: 0 },
  { id: 'c-3', name: 'Govt. Works Division (PWD)', contact: '9000888777', email: 'contact@pwdworks.gov.in', projectsCount: 0 }
];

export const mockProjects: Project[] = [];

export const mockDrawingTypes: DrawingTypeCard[] = [
  { id: 'foundation', title: 'Foundation', description: 'Foundation and footing concrete reinforcement structure.' },
  { id: 'plinth-beam', title: 'Plinth Beam', description: 'Ground tie-beam layouts and reinforcement details.' },
  { id: 'floor-beam', title: 'Floor Beam', description: 'Slab support beams and structural bending plans.' },
  { id: 'floor-slab', title: 'Floor Slab', description: 'Reinforcement, depth dimensions, and concrete grade.' },
  { id: 'columns', title: 'Columns', description: 'Vertical column design, steel schedule, and coordinates.' },
  { id: 'superstructure', title: 'Plan', description: 'Internal rooms, partitions, and architectural layout plans.' },
  { id: 'lintel-beam', title: 'Elevation', description: 'External front, side, and rear perspective elevations.' },
  { id: 'staircase', title: 'Staircase', description: 'Staircase layouts, concrete waist slabs, and thread reinforcement.' }
];

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}
