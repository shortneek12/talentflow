import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { worker } from './api/mock.ts'

// This function starts the mock service worker, but only in the development environment.
// This is crucial so that the mock API doesn't run in a production build.
async function enableMocking() {
  // `import.meta.env.MODE` is the standard way to access environment variables in Vite.
  if (import.meta.env.MODE === 'development') {
    return worker.start()
  }
}

// We call the mocking function and wait for its promise to resolve.
// The React application is rendered *inside* the .then() block.
// This ensures that the mock API is ready to intercept any network requests
// that might happen when the application first loads.
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})