# People Explorer - Client (Vue 3)

Vue 3 app that:

- Fetches 10 random people from https://randomuser.me/
- Displays list with filters (name + country)
- Shows profile details screen with editable name
- Supports Save/Delete/Update via the backend API

## Prerequisites

- Node.js 18+
- pnpm

## Run the Server first

Make sure the backend server is running on `http://localhost:3001`.

## Install & Run

```bash
pnpm install
pnpm dev
```

Client runs on: http://localhost:5173

## Notes

The client uses a Vite proxy, so API calls go to /api/\* and are proxied to http://localhost:3001.

## Build & Preview

pnpm build
pnpm preview
