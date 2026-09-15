import type {
  ActiveIncidentStatus,
  IncidentSeverity,
  IncidentStatus,
  RelatedLinkKind,
  TimelineActor,
  TimelineEventType,
} from '@/types/incident'
import type { PersonId } from '@/types/person'
import type { ServiceId } from '@/types/service'
import type { SeedTimeOffset } from '../seedTime'

export interface IncidentTimelineEventSeedDefinition {
  readonly type: TimelineEventType
  readonly message: string
  readonly actor: TimelineActor
  readonly occurredAtOffset: SeedTimeOffset
  readonly resultingStatus: IncidentStatus | null
}

export interface IncidentInternalNoteSeedDefinition {
  readonly content: string
  readonly authorId: PersonId
  readonly createdAtOffset: SeedTimeOffset
}

export interface IncidentRelatedLinkSeedDefinition {
  readonly label: string
  readonly url: string
  readonly kind: RelatedLinkKind
}

interface IncidentSeedDefinitionBase {
  readonly id: string
  readonly title: string
  readonly description: string | null
  readonly severity: IncidentSeverity
  readonly affectedServiceIds: readonly ServiceId[]
  readonly region: string | null
  readonly commanderId: PersonId
  readonly responderIds: readonly PersonId[]
  readonly createdById: PersonId
  readonly startedAtOffset: SeedTimeOffset
  readonly acknowledgedAtOffset: SeedTimeOffset | null
  readonly createdAtOffset: SeedTimeOffset
  readonly updatedAtOffset: SeedTimeOffset
  readonly labels: readonly string[]
  readonly relatedLinks?: readonly IncidentRelatedLinkSeedDefinition[]
  readonly timelineEvents?: readonly IncidentTimelineEventSeedDefinition[]
  readonly internalNotes?: readonly IncidentInternalNoteSeedDefinition[]
}

export interface ActiveIncidentSeedDefinition extends IncidentSeedDefinitionBase {
  readonly status: ActiveIncidentStatus
}

export interface ResolvedIncidentSeedDefinition extends IncidentSeedDefinitionBase {
  readonly status: 'resolved'
  readonly resolution: {
    readonly summary: string
    readonly rootCause: string | null
    readonly resolvedById: PersonId
    readonly resolvedAtOffset: SeedTimeOffset
  }
}

export type IncidentSeedDefinition =
  ActiveIncidentSeedDefinition | ResolvedIncidentSeedDefinition

const SHOWCASE_INCIDENT_SEED_DEFINITIONS = [
  {
    id: 'INC-2041',
    title: 'Elevated payment failures in the EU region',
    description:
      'Customers in the EU region are experiencing a high rate of declined payment attempts. The Payments API error rate increased from 0.3% to 8.2% after the v2.14.1 deployment to eu-west-1.',
    severity: 'sev1',
    status: 'investigating',
    affectedServiceIds: ['service-payments-api', 'service-customer-dashboard'],
    region: 'eu-west-1',
    commanderId: 'person-ananya-rao',
    responderIds: [
      'person-marco-ruiz',
      'person-jamie-lin',
      'person-priya-shah',
      'person-daniel-kim',
    ],
    createdById: 'person-ananya-rao',
    startedAtOffset: { minutes: 27 },
    acknowledgedAtOffset: { minutes: 22 },
    createdAtOffset: { minutes: 24 },
    updatedAtOffset: { minutes: 2 },
    labels: ['payments', 'checkout', 'p1'],
    relatedLinks: [
      {
        label: 'Payments alert',
        url: 'https://app.datadoghq.com/monitors/2041',
        kind: 'datadog',
      },
      {
        label: 'Payments API dashboard',
        url: 'https://grafana.example.com/d/payments-api',
        kind: 'grafana',
      },
      {
        label: '#incident-2041',
        url: 'https://slack.com/app_redirect?channel=incident-2041',
        kind: 'slack',
      },
      {
        label: 'Payments rollback runbook',
        url: 'https://docs.example.com/runbooks/payments-rollback',
        kind: 'runbook',
      },
    ],
    timelineEvents: [
      {
        type: 'timeline-update',
        message:
          'Datadog detected that the Payments API error rate exceeded 5%.',
        actor: {
          kind: 'system',
          label: 'Datadog',
        },
        occurredAtOffset: { minutes: 27 },
        resultingStatus: null,
      },
      {
        type: 'incident-created',
        message: 'Incident declared as SEV-1 and investigation started.',
        actor: {
          kind: 'person',
          personId: 'person-ananya-rao',
        },
        occurredAtOffset: { minutes: 24 },
        resultingStatus: 'investigating',
      },
      {
        type: 'timeline-update',
        message: 'Rolling back Payments API v2.14.1 to v2.14.0 in eu-west-1.',
        actor: {
          kind: 'person',
          personId: 'person-marco-ruiz',
        },
        occurredAtOffset: { minutes: 8 },
        resultingStatus: null,
      },
      {
        type: 'timeline-update',
        message:
          'Payment error rates are recovering while the rollback is verified.',
        actor: {
          kind: 'system',
          label: 'Service health monitor',
        },
        occurredAtOffset: { minutes: 2 },
        resultingStatus: null,
      },
    ],
    internalNotes: [
      {
        content:
          'The likely cause is the v2.14.1 fee-calculation change. Confirm with the Payments team before documenting the final root cause.',
        authorId: 'person-ananya-rao',
        createdAtOffset: { minutes: 5 },
      },
    ],
  },
  {
    id: 'INC-2040',
    title: 'Customer dashboard latency affecting APAC users',
    description:
      'Customers in the APAC region experienced slow dashboard navigation after elevated cache-miss rates increased requests to the reporting API.',
    severity: 'sev3',
    status: 'monitoring',
    affectedServiceIds: ['service-customer-dashboard'],
    region: 'ap-southeast-1',
    commanderId: 'person-daniel-kim',
    responderIds: ['person-sara-park', 'person-jamie-lin'],
    createdById: 'person-daniel-kim',
    startedAtOffset: { hours: 1, minutes: 35 },
    acknowledgedAtOffset: { hours: 1, minutes: 26 },
    createdAtOffset: { hours: 1, minutes: 30 },
    updatedAtOffset: { minutes: 12 },
    labels: ['dashboard', 'latency', 'apac'],
    relatedLinks: [
      {
        label: 'Customer Dashboard performance',
        url: 'https://grafana.example.com/d/customer-dashboard',
        kind: 'grafana',
      },
    ],
    timelineEvents: [
      {
        type: 'incident-created',
        message:
          'Incident created after dashboard latency exceeded the customer-impact threshold.',
        actor: {
          kind: 'person',
          personId: 'person-daniel-kim',
        },
        occurredAtOffset: { hours: 1, minutes: 30 },
        resultingStatus: 'investigating',
      },
      {
        type: 'timeline-update',
        message:
          'Elevated cache-miss rates were identified on the APAC reporting path.',
        actor: {
          kind: 'system',
          label: 'Grafana',
        },
        occurredAtOffset: { minutes: 55 },
        resultingStatus: null,
      },
      {
        type: 'status-changed',
        message:
          'Cache configuration was restored and the incident moved to monitoring.',
        actor: {
          kind: 'person',
          personId: 'person-daniel-kim',
        },
        occurredAtOffset: { minutes: 12 },
        resultingStatus: 'monitoring',
      },
    ],
  },
  {
    id: 'INC-2039',
    title: 'Notification delivery delays for EU customers',
    description:
      'Email and push notifications for EU customers were delayed after provider rate limiting caused the outbound delivery queue to grow.',
    severity: 'sev2',
    status: 'monitoring',
    affectedServiceIds: ['service-notifications'],
    region: 'eu-central-1',
    commanderId: 'person-marco-ruiz',
    responderIds: ['person-sara-park', 'person-omar-hassan'],
    createdById: 'person-sara-park',
    startedAtOffset: { hours: 3, minutes: 10 },
    acknowledgedAtOffset: { hours: 3, minutes: 4 },
    createdAtOffset: { hours: 3, minutes: 8 },
    updatedAtOffset: { minutes: 38 },
    labels: ['notifications', 'delivery', 'eu'],
    relatedLinks: [
      {
        label: 'Notification delivery alert',
        url: 'https://app.datadoghq.com/monitors/2039',
        kind: 'datadog',
      },
      {
        label: '#incident-2039',
        url: 'https://slack.com/app_redirect?channel=incident-2039',
        kind: 'slack',
      },
    ],
    timelineEvents: [
      {
        type: 'incident-created',
        message:
          'Incident created after notification delivery latency exceeded the EU threshold.',
        actor: {
          kind: 'person',
          personId: 'person-sara-park',
        },
        occurredAtOffset: { hours: 3, minutes: 8 },
        resultingStatus: 'investigating',
      },
      {
        type: 'status-changed',
        message:
          'Provider rate limiting was identified as the cause of the delivery backlog.',
        actor: {
          kind: 'person',
          personId: 'person-marco-ruiz',
        },
        occurredAtOffset: { hours: 2, minutes: 35 },
        resultingStatus: 'identified',
      },
      {
        type: 'timeline-update',
        message:
          'The outbound queue is draining after traffic was redistributed.',
        actor: {
          kind: 'system',
          label: 'Notification queue monitor',
        },
        occurredAtOffset: { hours: 1, minutes: 5 },
        resultingStatus: null,
      },
      {
        type: 'status-changed',
        message:
          'Delivery latency returned to the expected range and monitoring began.',
        actor: {
          kind: 'person',
          personId: 'person-marco-ruiz',
        },
        occurredAtOffset: { minutes: 38 },
        resultingStatus: 'monitoring',
      },
    ],
    internalNotes: [
      {
        content:
          'Keep the provider support case open until the queue remains stable for one hour.',
        authorId: 'person-sara-park',
        createdAtOffset: { minutes: 50 },
      },
    ],
  },
  {
    id: 'INC-2036',
    title: 'Analytics pipeline lag above threshold',
    description:
      'Event processing lag increased after an unbalanced partition concentrated ingestion traffic on a single consumer group.',
    severity: 'sev3',
    status: 'resolved',
    affectedServiceIds: ['service-analytics-pipeline'],
    region: 'us-east-1',
    commanderId: 'person-jamie-lin',
    responderIds: ['person-omar-hassan', 'person-ananya-rao'],
    createdById: 'person-jamie-lin',
    startedAtOffset: { hours: 3, minutes: 41 },
    acknowledgedAtOffset: { hours: 3, minutes: 34 },
    createdAtOffset: { hours: 3, minutes: 38 },
    updatedAtOffset: { hours: 3 },
    labels: ['analytics', 'pipeline', 'lag'],
    relatedLinks: [
      {
        label: 'Analytics pipeline dashboard',
        url: 'https://grafana.example.com/d/analytics-pipeline',
        kind: 'grafana',
      },
    ],
    resolution: {
      summary:
        'Consumer capacity was rebalanced and processing lag returned below the alert threshold.',
      rootCause:
        'An uneven partition assignment overloaded one ingestion consumer group.',
      resolvedById: 'person-jamie-lin',
      resolvedAtOffset: { hours: 3 },
    },
  },
  {
    id: 'INC-2031',
    title: 'Customer dashboard intermittent 500 errors',
    description:
      'Some dashboard requests returned HTTP 500 responses when cached reporting data exceeded the worker memory limit.',
    severity: 'sev3',
    status: 'resolved',
    affectedServiceIds: ['service-customer-dashboard'],
    region: 'us-east-1',
    commanderId: 'person-sara-park',
    responderIds: ['person-daniel-kim', 'person-jamie-lin'],
    createdById: 'person-sara-park',
    startedAtOffset: { hours: 7, minutes: 5 },
    acknowledgedAtOffset: { hours: 6, minutes: 58 },
    createdAtOffset: { hours: 7, minutes: 2 },
    updatedAtOffset: { hours: 6 },
    labels: ['dashboard', 'http-500', 'cache'],
    internalNotes: [
      {
        content:
          'Add a regression test for reports that approach the worker memory limit.',
        authorId: 'person-daniel-kim',
        createdAtOffset: { hours: 6, minutes: 20 },
      },
    ],
    resolution: {
      summary:
        'The affected reporting workers were restarted with corrected cache limits.',
      rootCause:
        'A cache configuration change allowed reporting payloads to exceed the worker memory limit.',
      resolvedById: 'person-sara-park',
      resolvedAtOffset: { hours: 6 },
    },
  },
  {
    id: 'INC-2028',
    title: 'Auth token refresh failing for mobile clients',
    description:
      'A subset of mobile clients could not refresh expired access tokens after a signing-key configuration change.',
    severity: 'sev2',
    status: 'identified',
    affectedServiceIds: ['service-authentication'],
    region: null,
    commanderId: 'person-priya-shah',
    responderIds: ['person-jamie-lin', 'person-daniel-kim'],
    createdById: 'person-priya-shah',
    startedAtOffset: { hours: 2, minutes: 20 },
    acknowledgedAtOffset: { hours: 2, minutes: 15 },
    createdAtOffset: { hours: 2, minutes: 18 },
    updatedAtOffset: { hours: 1 },
    labels: ['authentication', 'mobile', 'tokens'],
    relatedLinks: [
      {
        label: 'Signing-key rotation runbook',
        url: 'https://docs.example.com/runbooks/signing-key-rotation',
        kind: 'runbook',
      },
    ],
    timelineEvents: [
      {
        type: 'incident-created',
        message:
          'Incident created after mobile token-refresh failures exceeded the alert threshold.',
        actor: {
          kind: 'person',
          personId: 'person-priya-shah',
        },
        occurredAtOffset: { hours: 2, minutes: 18 },
        resultingStatus: 'investigating',
      },
      {
        type: 'status-changed',
        message:
          'The signing-key configuration change was identified as the source of the failures.',
        actor: {
          kind: 'person',
          personId: 'person-priya-shah',
        },
        occurredAtOffset: { hours: 1 },
        resultingStatus: 'identified',
      },
    ],
  },
  {
    id: 'INC-2022',
    title: 'Payment webhook retries exceeding threshold',
    description:
      'Webhook deliveries accumulated after an external merchant endpoint repeatedly returned timeout responses.',
    severity: 'sev4',
    status: 'resolved',
    affectedServiceIds: ['service-payments-api'],
    region: 'us-east-1',
    commanderId: 'person-marco-ruiz',
    responderIds: ['person-omar-hassan'],
    createdById: 'person-marco-ruiz',
    startedAtOffset: { days: 7, minutes: 28 },
    acknowledgedAtOffset: { days: 7, minutes: 23 },
    createdAtOffset: { days: 7, minutes: 26 },
    updatedAtOffset: { days: 7 },
    labels: ['payments', 'webhooks', 'retries'],
    relatedLinks: [
      {
        label: 'INC-2022 follow-up',
        url: 'https://docs.example.com/incidents/INC-2022',
        kind: 'other',
      },
    ],
    resolution: {
      summary:
        'Webhook concurrency was limited and the retry queue drained successfully.',
      rootCause:
        'Repeated merchant endpoint timeouts caused retry workers to exceed their normal concurrency.',
      resolvedById: 'person-marco-ruiz',
      resolvedAtOffset: { days: 7 },
    },
  },
] as const satisfies readonly IncidentSeedDefinition[]

const MINUTES_PER_DAY = 24 * 60

interface HistoricalIncidentDescriptor {
  readonly id: string
  readonly title: string
  readonly severity: IncidentSeverity
  readonly serviceId: ServiceId
  readonly region: string | null
  readonly resolvedMinutesAgo: number
  readonly durationMinutes: number
}

interface HistoricalResponseTeam {
  readonly commanderId: PersonId
  readonly responderId: PersonId
}

const HISTORICAL_RESPONSE_TEAMS = [
  {
    commanderId: 'person-ananya-rao',
    responderId: 'person-marco-ruiz',
  },
  {
    commanderId: 'person-marco-ruiz',
    responderId: 'person-sara-park',
  },
  {
    commanderId: 'person-jamie-lin',
    responderId: 'person-omar-hassan',
  },
  {
    commanderId: 'person-sara-park',
    responderId: 'person-elena-garcia',
  },
  {
    commanderId: 'person-priya-shah',
    responderId: 'person-daniel-kim',
  },
  {
    commanderId: 'person-daniel-kim',
    responderId: 'person-jamie-lin',
  },
  {
    commanderId: 'person-omar-hassan',
    responderId: 'person-ananya-rao',
  },
  {
    commanderId: 'person-elena-garcia',
    responderId: 'person-sara-park',
  },
] as const satisfies readonly HistoricalResponseTeam[]

const HISTORICAL_INCIDENT_DESCRIPTORS = [
  {
    id: 'INC-2038',
    title: 'Search indexing delays for incident records',
    severity: 'sev3',
    serviceId: 'service-analytics-pipeline',
    region: 'us-east-1',
    resolvedMinutesAgo: 45,
    durationMinutes: 18,
  },
  {
    id: 'INC-2037',
    title: 'Checkout tax calculation timeouts',
    severity: 'sev2',
    serviceId: 'service-payments-api',
    region: 'eu-west-1',
    resolvedMinutesAgo: 90,
    durationMinutes: 32,
  },
  {
    id: 'INC-2035',
    title: 'Session validation error spike',
    severity: 'sev2',
    serviceId: 'service-authentication',
    region: null,
    resolvedMinutesAgo: 150,
    durationMinutes: 27,
  },
  {
    id: 'INC-2034',
    title: 'Push notification retry backlog',
    severity: 'sev3',
    serviceId: 'service-notifications',
    region: 'eu-central-1',
    resolvedMinutesAgo: 240,
    durationMinutes: 46,
  },
  {
    id: 'INC-2033',
    title: 'Analytics export jobs stalled',
    severity: 'sev3',
    serviceId: 'service-analytics-pipeline',
    region: 'us-west-2',
    resolvedMinutesAgo: 330,
    durationMinutes: 54,
  },
  {
    id: 'INC-2032',
    title: 'Customer dashboard blank states',
    severity: 'sev2',
    serviceId: 'service-customer-dashboard',
    region: 'ap-southeast-1',
    resolvedMinutesAgo: 420,
    durationMinutes: 38,
  },
  {
    id: 'INC-2030',
    title: 'Payment webhook signature failures',
    severity: 'sev2',
    serviceId: 'service-payments-api',
    region: 'us-east-1',
    resolvedMinutesAgo: 540,
    durationMinutes: 49,
  },
  {
    id: 'INC-2029',
    title: 'Elevated login latency',
    severity: 'sev3',
    serviceId: 'service-authentication',
    region: 'eu-west-1',
    resolvedMinutesAgo: 660,
    durationMinutes: 35,
  },
  {
    id: 'INC-2027',
    title: 'Email template rendering failures',
    severity: 'sev3',
    serviceId: 'service-notifications',
    region: 'us-east-1',
    resolvedMinutesAgo: 780,
    durationMinutes: 29,
  },
  {
    id: 'INC-2026',
    title: 'Reporting API connection exhaustion',
    severity: 'sev2',
    serviceId: 'service-customer-dashboard',
    region: 'us-east-1',
    resolvedMinutesAgo: 1020,
    durationMinutes: 61,
  },
  {
    id: 'INC-2025',
    title: 'Delayed settlement status updates',
    severity: 'sev3',
    serviceId: 'service-payments-api',
    region: 'eu-west-1',
    resolvedMinutesAgo: 2 * MINUTES_PER_DAY,
    durationMinutes: 42,
  },
  {
    id: 'INC-2024',
    title: 'Authentication cache inconsistency',
    severity: 'sev3',
    serviceId: 'service-authentication',
    region: 'us-east-1',
    resolvedMinutesAgo: 3 * MINUTES_PER_DAY,
    durationMinutes: 33,
  },
  {
    id: 'INC-2023',
    title: 'Mobile dashboard asset failures',
    severity: 'sev4',
    serviceId: 'service-customer-dashboard',
    region: 'ap-southeast-1',
    resolvedMinutesAgo: 4 * MINUTES_PER_DAY,
    durationMinutes: 24,
  },
  {
    id: 'INC-2021',
    title: 'Notification preference synchronization delays',
    severity: 'sev4',
    serviceId: 'service-notifications',
    region: 'eu-central-1',
    resolvedMinutesAgo: 5 * MINUTES_PER_DAY,
    durationMinutes: 31,
  },
  {
    id: 'INC-2020',
    title: 'Analytics ingestion duplicates',
    severity: 'sev3',
    serviceId: 'service-analytics-pipeline',
    region: 'us-west-2',
    resolvedMinutesAgo: 6 * MINUTES_PER_DAY,
    durationMinutes: 57,
  },
  {
    id: 'INC-2019',
    title: 'Payment reconciliation queue backlog',
    severity: 'sev2',
    serviceId: 'service-payments-api',
    region: 'us-east-1',
    resolvedMinutesAgo: 8 * MINUTES_PER_DAY,
    durationMinutes: 74,
  },
  {
    id: 'INC-2018',
    title: 'OAuth callback failures in the US region',
    severity: 'sev2',
    serviceId: 'service-authentication',
    region: 'us-east-1',
    resolvedMinutesAgo: 10 * MINUTES_PER_DAY,
    durationMinutes: 44,
  },
  {
    id: 'INC-2017',
    title: 'Dashboard permission data remained stale',
    severity: 'sev3',
    serviceId: 'service-customer-dashboard',
    region: 'us-west-2',
    resolvedMinutesAgo: 12 * MINUTES_PER_DAY,
    durationMinutes: 52,
  },
  {
    id: 'INC-2016',
    title: 'SMS delivery provider degradation',
    severity: 'sev2',
    serviceId: 'service-notifications',
    region: 'ap-southeast-1',
    resolvedMinutesAgo: 14 * MINUTES_PER_DAY,
    durationMinutes: 68,
  },
  {
    id: 'INC-2015',
    title: 'Event pipeline partition imbalance',
    severity: 'sev2',
    serviceId: 'service-analytics-pipeline',
    region: 'eu-west-1',
    resolvedMinutesAgo: 16 * MINUTES_PER_DAY,
    durationMinutes: 81,
  },
  {
    id: 'INC-2014',
    title: 'Payment refund processing delays',
    severity: 'sev3',
    serviceId: 'service-payments-api',
    region: 'us-east-1',
    resolvedMinutesAgo: 18 * MINUTES_PER_DAY,
    durationMinutes: 47,
  },
  {
    id: 'INC-2013',
    title: 'Token revocation propagation lag',
    severity: 'sev3',
    serviceId: 'service-authentication',
    region: 'eu-central-1',
    resolvedMinutesAgo: 20 * MINUTES_PER_DAY,
    durationMinutes: 39,
  },
  {
    id: 'INC-2012',
    title: 'Dashboard report download failures',
    severity: 'sev4',
    serviceId: 'service-customer-dashboard',
    region: 'us-east-1',
    resolvedMinutesAgo: 23 * MINUTES_PER_DAY,
    durationMinutes: 26,
  },
  {
    id: 'INC-2011',
    title: 'Notification dead-letter queue growth',
    severity: 'sev3',
    serviceId: 'service-notifications',
    region: 'eu-west-1',
    resolvedMinutesAgo: 26 * MINUTES_PER_DAY,
    durationMinutes: 63,
  },
  {
    id: 'INC-2010',
    title: 'Analytics retention job timeout',
    severity: 'sev4',
    serviceId: 'service-analytics-pipeline',
    region: 'us-west-2',
    resolvedMinutesAgo: 29 * MINUTES_PER_DAY,
    durationMinutes: 36,
  },
] as const satisfies readonly HistoricalIncidentDescriptor[]

function createHistoricalIncidentDefinition(
  descriptor: HistoricalIncidentDescriptor,
  index: number,
): ResolvedIncidentSeedDefinition {
  const responseTeam = HISTORICAL_RESPONSE_TEAMS.at(
    index % HISTORICAL_RESPONSE_TEAMS.length,
  )

  if (!responseTeam) {
    throw new RangeError('Historical incident response team was not found')
  }

  const startedMinutesAgo =
    descriptor.resolvedMinutesAgo + descriptor.durationMinutes

  return {
    id: descriptor.id,
    title: descriptor.title,
    description:
      'Automated monitoring detected degraded behaviour. Responders restored normal service and verified recovery before resolving the incident.',
    severity: descriptor.severity,
    status: 'resolved',
    affectedServiceIds: [descriptor.serviceId],
    region: descriptor.region,
    commanderId: responseTeam.commanderId,
    responderIds: [responseTeam.responderId],
    createdById: responseTeam.commanderId,
    startedAtOffset: { minutes: startedMinutesAgo },
    acknowledgedAtOffset:
      descriptor.severity === 'sev4'
        ? null
        : { minutes: startedMinutesAgo - 5 },
    createdAtOffset: { minutes: startedMinutesAgo - 2 },
    updatedAtOffset: { minutes: descriptor.resolvedMinutesAgo },
    labels: [
      'historical',
      'resolved',
      descriptor.serviceId.replace('service-', ''),
    ],
    resolution: {
      summary:
        'The remediation was applied and service health returned to the expected range.',
      rootCause:
        index % 5 === 0
          ? null
          : 'A configuration or capacity issue caused the service to exceed its normal operating threshold.',
      resolvedById: responseTeam.commanderId,
      resolvedAtOffset: { minutes: descriptor.resolvedMinutesAgo },
    },
  }
}

export const INCIDENT_SEED_DEFINITIONS = [
  ...SHOWCASE_INCIDENT_SEED_DEFINITIONS,
  ...HISTORICAL_INCIDENT_DESCRIPTORS.map(createHistoricalIncidentDefinition),
] as const satisfies readonly IncidentSeedDefinition[]
