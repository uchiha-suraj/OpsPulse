import { createIncidentsSeed } from './incidents/createIncidentsSeed'
import { DEMO_DATA_VERSION, type DemoData } from './demoData'
import { PEOPLE_SEED } from './people'
import { createServicesSeed } from './services'
import { getSeedTimestamp } from './seedTime'
import { validateDemoData } from './validateDemoData'

export function createDemoDataSeed(anchorTime: Date = new Date()): DemoData {
  const demoData: DemoData = {
    version: DEMO_DATA_VERSION,
    seededAt: getSeedTimestamp(anchorTime),
    people: PEOPLE_SEED.map((person) => ({ ...person })),
    services: createServicesSeed(anchorTime),
    incidents: createIncidentsSeed(anchorTime),
  }

  validateDemoData(demoData)

  return demoData
}
