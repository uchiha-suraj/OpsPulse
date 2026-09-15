import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

function renderApplication() {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

async function prepareApplication() {
  try {
    const { worker } = await import('@/mocks/browser')

    await worker.start()
  } catch (error: unknown) {
    console.error('Failed to start the mock API worker.', error)
  }
}

void prepareApplication().then(renderApplication)