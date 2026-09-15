const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const MILLISECONDS_PER_MINUTE = 60_000

export interface SeedTimeOffset {
  readonly days?: number
  readonly hours?: number
  readonly minutes?: number
}

export function getSeedTimestamp(
  anchorTime: Date,
  offset: SeedTimeOffset = {},
): string {
  const anchorMilliseconds = anchorTime.getTime()
  const days = offset.days ?? 0
  const hours = offset.hours ?? 0
  const minutes = offset.minutes ?? 0
  const offsetValues = [days, hours, minutes]

  if (!Number.isFinite(anchorMilliseconds)) {
    throw new RangeError('Seed anchor time must be a valid date')
  }

  if (offsetValues.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new RangeError('Seed time offsets must be non-negative numbers')
  }

  const totalMinutes =
    days * HOURS_PER_DAY * MINUTES_PER_HOUR + hours * MINUTES_PER_HOUR + minutes

  return new Date(
    anchorMilliseconds - totalMinutes * MILLISECONDS_PER_MINUTE,
  ).toISOString()
}
