import type { DemoData } from '../data/demoData'
import { createDemoDataSeed } from '../data/createDemoDataSeed'
import { parseDemoData } from './demoDataSchema'
import { DemoDataPersistenceError } from './persistenceError'

export const DEMO_DATA_STORAGE_KEY = 'opspulse:demo-data'

export type DemoDataUpdater = (currentData: DemoData) => DemoData

export interface DemoDataRepository {
  readonly load: () => DemoData
  readonly save: (data: DemoData) => DemoData
  readonly update: (updater: DemoDataUpdater) => DemoData
  readonly reset: () => DemoData
}

export interface DemoDataRepositoryDependencies {
  readonly getStorage: () => Storage
  readonly now: () => Date
  readonly warn: (message: string, error: unknown) => void
}

export function createDemoDataRepository(
  dependencies: DemoDataRepositoryDependencies,
): DemoDataRepository {
  function readStoredValue(): string | null {
    try {
      return dependencies.getStorage().getItem(DEMO_DATA_STORAGE_KEY)
    } catch (error: unknown) {
      throw new DemoDataPersistenceError('read', error)
    }
  }

  function writeStoredData(data: DemoData): void {
    try {
      const serializedData = JSON.stringify(data)

      dependencies.getStorage().setItem(DEMO_DATA_STORAGE_KEY, serializedData)
    } catch (error: unknown) {
      throw new DemoDataPersistenceError('write', error)
    }
  }

  function save(data: DemoData): DemoData {
    const validatedData = parseDemoData(data)

    writeStoredData(validatedData)

    return validatedData
  }

  function reset(): DemoData {
    return save(createDemoDataSeed(dependencies.now()))
  }

  function load(): DemoData {
    const storedValue = readStoredValue()

    if (storedValue === null) {
      return reset()
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue)

      return parseDemoData(parsedValue)
    } catch (error: unknown) {
      dependencies.warn(
        'Stored OpsPulse demo data is invalid and will be reset.',
        error,
      )

      return reset()
    }
  }

  function update(updater: DemoDataUpdater): DemoData {
    const currentData = load()
    const nextData = updater(currentData)

    return save(nextData)
  }

  return {
    load,
    save,
    update,
    reset,
  }
}

export const demoDataRepository = createDemoDataRepository({
  getStorage: () => window.localStorage,
  now: () => new Date(),
  warn: (message, error) => {
    console.warn(message, error)
  },
})
