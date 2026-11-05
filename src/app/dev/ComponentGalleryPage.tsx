import { useState, type PropsWithChildren } from 'react'

import { Moon, SearchX, Settings, Sun } from 'lucide-react'

import { useThemeStore } from '@/app/stores/themeStore'
import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { EmptyState } from '@/components/ui/EmptyState'
import { IconButton } from '@/components/ui/IconButton'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Textarea } from '@/components/ui/Textarea'
import { Tooltip } from '@/components/ui/Tooltip'

const severityOptions = [
  { value: 'sev1', label: 'SEV-1 · Critical' },
  { value: 'sev2', label: 'SEV-2 · High' },
  { value: 'sev3', label: 'SEV-3 · Medium' },
  { value: 'sev4', label: 'SEV-4 · Low' },
] as const

function GallerySection({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  return (
    <Card className="p-4">
      <h2 className="mb-4 text-heading-sm font-semibold">{title}</h2>

      {children}
    </Card>
  )
}

export function ComponentGalleryPage() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const [checkboxValue, setCheckboxValue] = useState<boolean | 'indeterminate'>(
    false,
  )
  const [severity, setSeverity] = useState('sev2')

  return (
    <main className="min-h-screen bg-canvas p-6 text-foreground">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg font-semibold">
            OpsPulse component gallery
          </h1>
          <p className="text-body-lg text-foreground-secondary">
            Development-only visual and keyboard verification
          </p>
        </div>

        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun aria-hidden="true" className="size-4" />
          ) : (
            <Moon aria-hidden="true" className="size-4" />
          )}
          Switch to {theme === 'dark' ? 'light' : 'dark'}
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <GallerySection title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button isLoading loadingText="Creating…">
              Create incident
            </Button>
            <Button disabled>Disabled</Button>

            <Tooltip content="Open settings">
              <IconButton label="Open settings" icon={<Settings />} />
            </Tooltip>
          </div>
        </GallerySection>

        <GallerySection title="Badges and avatars">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="critical">Critical</Badge>
            <Badge tone="info">Info</Badge>

            <Avatar name="Aisha Khan" />
            <Avatar name="Marco Ruiz" size="small" />
          </div>
        </GallerySection>

        <GallerySection title="Text controls">
          <div className="grid gap-4">
            <Input
              label="Incident title"
              placeholder="e.g. Elevated payment failures"
            />

            <Input label="Invalid title" error="Title is required" />

            <Input
              label="Disabled title"
              value="Incident title"
              disabled
              readOnly
            />

            <Textarea
              label="Incident description"
              placeholder="Describe the customer impact"
              description="Include affected regions and services."
            />
          </div>
        </GallerySection>

        <GallerySection title="Selection controls">
          <div className="grid gap-4">
            <Checkbox
              label="Payments API"
              checked={checkboxValue}
              onCheckedChange={setCheckboxValue}
            />

            <Button
              variant="secondary"
              onClick={() => {
                setCheckboxValue('indeterminate')
              }}
            >
              Set indeterminate
            </Button>

            <Select
              label="Severity"
              value={severity}
              onValueChange={setSeverity}
              options={severityOptions}
            />
          </div>
        </GallerySection>

        <GallerySection title="Alerts">
          <div className="grid gap-3">
            <Alert tone="info" title="Information">
              Incident metrics were updated recently.
            </Alert>

            <Alert tone="success" title="Update saved">
              The incident status was updated.
            </Alert>

            <Alert tone="warning" title="Connection delayed">
              Live information may be temporarily stale.
            </Alert>

            <Alert tone="critical" title="Update failed">
              Your changes were not saved.
            </Alert>
          </div>
        </GallerySection>

        <GallerySection title="Loading and empty states">
          <div className="grid gap-6">
            <div
              aria-busy="true"
              aria-label="Loading dashboard data"
              className="grid gap-3"
            >
              <Skeleton shape="title" />
              <Skeleton className="w-full" />
              <Skeleton shape="block" className="w-full" />
            </div>

            <EmptyState
              icon={<SearchX />}
              title="No incidents found"
              description="Try changing or clearing the active filters."
              action={<Button variant="secondary">Clear filters</Button>}
            />
          </div>
        </GallerySection>
      </div>
    </main>
  )
}
