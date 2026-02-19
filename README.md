<<<<<<< HEAD
# art-table-app
=======
# Art Institute of Chicago – Artwork Table

A React + TypeScript + Vite application built with PrimeReact DataTable displaying artwork data from the Art Institute of Chicago public API.

## Features

- **Server-side pagination** – fetches data per page, never all at once
- **Row selection** with checkboxes (individual + select-all on current page)
- **Persistent selection** across page navigation (stores IDs only, not row objects)
- **Custom N-row selection** via overlay panel – selects first N rows **without prefetching** any pages

## Selection Strategy

The key challenge: selecting N rows across pages without prefetching other pages.

**Solution:** Track `pendingCount` (number) + `selectedIds` (Set) + `deselectedIds` (Set).

When `pendingCount = N`, any row whose global index `(page - 1) * rowsPerPage + localIndex < N` is automatically considered selected — **lazily**, as the user navigates pages. No API calls are made beyond the current page.

Users can manually check/uncheck rows, which updates `selectedIds` and `deselectedIds` accordingly.

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment (Netlify)

1. Run `npm run build`
2. Drag the `dist/` folder into Netlify's dashboard
   — OR —
3. Connect your GitHub repo to Netlify:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Tech Stack

- **Vite** – build tool
- **React 18** + **TypeScript**
- **PrimeReact** – DataTable, OverlayPanel, Button, InputText
- **PrimeFlex** – utility CSS
- **Google Fonts** – Playfair Display + DM Sans

## API

Data from: `https://api.artic.edu/api/v1/artworks`

Fields: `id`, `title`, `place_of_origin`, `artist_display`, `inscriptions`, `date_start`, `date_end`
>>>>>>> 6a4198a (Initial commit: React Artwork Table App)
