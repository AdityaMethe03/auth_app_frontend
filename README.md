# Authentication Service Frontend

React application for the multi-tenant authentication service. Users can sign in or register within a tenant, manage their profile, and access user, role, permission, or tenant administration pages when their permissions allow it.

## Stack

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS and Radix UI components
- Axios and Zustand

## Run locally

1. Install Node.js and npm.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root with the backend URLs:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:8091/authapp/api/v1
   VITE_BASE_URL=http://localhost:8091/authapp
   ```

   `VITE_API_BASE_URL` is the REST API base URL. `VITE_BASE_URL` is the backend application base used to start OAuth sign-in. Configure the backend CORS and OAuth redirect settings to match the frontend URL (`http://localhost:5173`) when needed.

4. Start the development server:

   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in a browser. The backend must be running and reachable at the configured URLs.

## Available commands

```bash
npm run dev      # Start Vite development server
npm run build    # Type-check and create the production bundle in dist/
npm run preview  # Serve the production bundle locally
npm run lint     # Run ESLint
```

## Main pages

- `/`: application home page
- `/about` and `/services`: public product information
- `/login` and `/signup`: tenant-aware authentication and registration
- `/dashboard`: signed-in user home and profile
- `/dashboard/admin/users`: user administration, shown when the user has `USER:READ`
- `/dashboard/admin/roles`: role administration, shown when the user has `ROLE:READ`
- `/dashboard/admin/tenants`: tenant administration, shown when the user has `TENANT:READ`

The frontend uses permissions returned by the backend to control navigation and page access. The backend remains responsible for enforcing authorization on API requests. Tenant context is sent with `X-G-APP-Tenant-Id` where an operation targets a tenant.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend REST API base URL, including `/api/v1` |
| `VITE_BASE_URL` | Backend base URL used for OAuth authorization redirects |

Values prefixed with `VITE_` are included in the browser bundle, so do not put secrets in frontend environment files.
