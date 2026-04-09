# Marketing Hub by YK

A full-stack modern web application for marketing team management, combining collaboration and productivity features.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Zustand.
- **State Management**: Zustand (with Persistence).
- **Internationalization**: Custom i18n supporting English, Arabic (RTL), and Kurdish.
- **Icons**: Lucide React.
- **Charts**: Recharts.
- **Auth**: Mock JWT-based system with Admin/User RBAC.

## Features
- **Modern Dashboard**: Overview of marketing metrics with interactive charts.
- **Ads Management**: Inline editable spreadsheet for tracking ad spend and performance.
- **Task Management**: Kanban-style board with priority and status tracking.
- **Content Management**: Grid view for posts, reels, stories, and scripts.
- **Inventory Tracking**: Manage equipment and marketing assets.
- **Dark Mode**: High-contrast modern dark UI (default) with light mode toggle.
- **Multilingual**: Full RTL support for Arabic and Kurdish.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials
- **Admin**: `admin@yk.com` / `password`
- **User**: `user@yk.com` / `password`

## Project Structure
- `/src/app`: Next.js 16 routes and layouts.
- `/src/components`: Reusable UI and module-specific components.
- `/src/store`: Zustand stores for global state.
- `/src/hooks`: Custom hooks for translations and RBAC.
- `/src/constants`: Translation dictionaries and static data.
