import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App'
import './index.css'
import { tokenDiagnostics } from './utils/tokenDiagnostics'

// Make diagnostics available in development
if (process.env.NODE_ENV === 'development') {
  (window as any).tokenDiagnostics = tokenDiagnostics;
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
