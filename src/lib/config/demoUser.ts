import type { Person } from '@/types/person'

export const DEMO_USER = {
  id: 'person-ananya-rao',
  name: 'Ananya Rao',
  initials: 'AR',
  role: 'SRE / Incident Responder',
  availability: 'on-call',
} as const satisfies Person
