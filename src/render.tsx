import { StrictMode } from 'react'
import RouteView from '@routes'
import { createRoot } from 'react-dom/client'

export default function renderApp() {
  const rootEl = document.getElementById('root')
  const AppInstance = (
    <StrictMode>
      <RouteView />
    </StrictMode>
  )

  const root = createRoot(rootEl!)
  root.render(AppInstance)
}
