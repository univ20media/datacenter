# Editorial Dashboard (YouthMedia.Ed)

This is an internal editorial dashboard MVP built for a youth media company content team. It helps editors connect content performance data with monthly university/student seasonal issues to make data-informed content decisions.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Main app shell (Sidebar + TopNav integration)
│   ├── page.tsx           # Dashboard view (KPIs, Topic/Format performance)
│   ├── archive/           # Content Archive view
│   ├── planner/           # Recommendation & Pre-planning view
│   └── season-map/        # Seasonal keyword and events view
├── components/
│   ├── layout/            # Sidebar, TopNavigation
│   ├── dashboard/         # KPI Cards, Platform Comparison, Topic/Format Performance, etc.
│   ├── archive/           # Content Cards and Filters
│   ├── planner/           # Idea generation cards
│   └── season-map/        # Month selector, Season details UI
├── data/
│   └── mockData.ts        # Static mock data (ContentData, SeasonMap)
└── types/
    └── index.ts           # Shared TypeScript interfaces
```

## Features

1. **Dashboard (`/`)**: High-level overview of editorial performance, comparing platforms, topics, and formats, and highlighting the highest and lowest performing posts.
2. **Season Map (`/season-map`)**: A month-by-month breakdown of academic events, student emotions/concerns, and recommended topics to guide seasonal content strategy.
3. **Planner (`/planner`)**: Actionable content idea recommendations for the current month and pre-planning ideas for the next month, driven by historical performance and seasonal data.
4. **Archive (`/archive`)**: A filterable repository of all past content to analyze historical trends.

## Data Philosophy
The dashboard relies on two primary data models:
- `ContentData`: Individual post performance metrics.
- `SeasonMap`: Editorial directions tailored to the university academic calendar.
Currently, this is populated using mock data in `/src/data/mockData.ts` to ensure rapid MVP iteration before connecting to live Google Sheets APIs.

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
