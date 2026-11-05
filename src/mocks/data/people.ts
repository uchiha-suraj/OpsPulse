import type { Person } from '@/types/person'
import { DEMO_USER } from '@/lib/config/demoUser'

export const PEOPLE_SEED = [
  DEMO_USER,
  {
    id: 'person-marco-ruiz',
    name: 'Marco Ruiz',
    initials: 'MR',
    role: 'Senior Backend Engineer',
    availability: 'on-call',
  },
  {
    id: 'person-jamie-lin',
    name: 'Jamie Lin',
    initials: 'JL',
    role: 'Platform Engineer',
    availability: 'on-call',
  },
  {
    id: 'person-sara-park',
    name: 'Sara Park',
    initials: 'SP',
    role: 'Site Reliability Engineer',
    availability: 'on-call',
  },
  {
    id: 'person-priya-shah',
    name: 'Priya Shah',
    initials: 'PS',
    role: 'Staff Software Engineer',
    availability: 'available',
  },
  {
    id: 'person-daniel-kim',
    name: 'Daniel Kim',
    initials: 'DK',
    role: 'Frontend Engineer',
    availability: 'available',
  },
  {
    id: 'person-elena-garcia',
    name: 'Elena Garcia',
    initials: 'EG',
    role: 'Backend Engineer',
    availability: 'unavailable',
  },
  {
    id: 'person-omar-hassan',
    name: 'Omar Hassan',
    initials: 'OH',
    role: 'Data Platform Engineer',
    availability: 'available',
  },
] as const satisfies readonly Person[]
