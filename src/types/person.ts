export const PERSON_AVAILABILITY_VALUES = [
  'on-call',
  'available',
  'unavailable',
] as const

export type PersonAvailability = (typeof PERSON_AVAILABILITY_VALUES)[number]

export const PERSON_AVAILABILITY_LABELS = {
  'on-call': 'On call',
  available: 'Available',
  unavailable: 'Unavailable',
} as const satisfies Record<PersonAvailability, string>

export type PersonId = string

export interface Person {
  readonly id: PersonId
  readonly name: string
  readonly initials: string
  readonly role: string
  readonly availability: PersonAvailability
}
