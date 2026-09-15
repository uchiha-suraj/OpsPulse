export type PersistenceOperation = 'read' | 'write'

export class DemoDataPersistenceError extends Error {
  readonly operation: PersistenceOperation

  constructor(operation: PersistenceOperation, cause: unknown) {
    super(`Failed to ${operation} OpsPulse demo data`, { cause })

    this.name = 'DemoDataPersistenceError'
    this.operation = operation
  }
}
