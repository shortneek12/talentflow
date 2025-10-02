// src/api/handlers.ts

import { http, HttpResponse } from 'msw'

// Define all your mock API routes in this array.
// The "export" keyword makes it available for your mock.ts file to import.
export const handlers = [
  // Example: Intercepts GET requests to "/user"
  http.get('/user', () => {
    // Respond with a mock JSON object
    return HttpResponse.json({
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),

  // ...add all your other handlers here
]