// src/api/mock.ts

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers' // Assuming your handlers are in a separate file

// This configures a Service Worker with the given request handlers.
// The "export" keyword makes this worker available to be imported in other files, like your main.tsx.
export const worker = setupWorker(...handlers)