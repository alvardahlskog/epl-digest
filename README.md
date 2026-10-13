# 🦁 EPL Digest — Premier League Rundown & Player Intel

A modern, fast, and responsive web application delivering matchday rundowns, standout player performances, league table shifts, and star player medical bulletins for the Premier League.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**, powered by **free public Premier League & FPL data sources** with zero API keys required.

---

## 🌟 Key Features

### 1. ⚽ Match Results & Fixture Previews
* **Completed Scores & Highlights**: Full-time match scores with home and away goalscorers (⚽) and assist providers (🎯).
* **Match MVPs**: Highlighting the player of the match with fantasy points and bonus metrics.
* **Upcoming Fixtures**: Previews of upcoming gameweek matchups.
* **Club Accent Colors**: Dynamic club branding and badge colors for all 20 Premier League teams.

### 2. 🔥 Impressive Match Performances Per Player
* **Gameweek Standout Performers**: Spotlights top individual performances across the league.
* **Granular Player Metrics**: Goals, assists, clean sheets, goalkeeper saves, fantasy bonus points, and BPS ratings.
* **Dynamic Highlight Badges**: Badges such as `Brace ⚽⚽`, `Hat-Trick 🎩⚽`, `Clean Sheet 🛡️`, `3 Bonus Pts ⭐`, and `Gameweek High Score 🔥`.
* **Position Filter Chips**: Easily view performers by `ALL`, `FWD`, `MID`, `DEF`, or `GKP`.

### 3. 📈 League Table & Position Shifts ("Movers")
* **Full League Standings**: Position, Club, Played, Won, Drawn, Lost, Goals For, Goals Against, Goal Difference, Points, and Last 5 Form (`W`, `D`, `L`).
* **Table Movers Indicators**: Visual indicators showing position changes compared to the previous gameweek:
  * `▲ +X` (Green) for climbing teams
  * `▼ -X` (Red) for falling teams
  * `─` (Gray) for unchanged positions
* **European & Relegation Zones**:
  * 🔵 UEFA Champions League (1st – 4th)
  * 🟠 UEFA Europa League (5th)
  * 🟢 UEFA Conference League (6th)
  * 🔴 Relegation Zone (18th – 20th)

### 4. 🏥 Player News & Injury Intel
* **Star Player Prioritization**: Focus on talisman and marquee players (e.g., Haaland, Saka, Salah, Palmer, De Bruyne, Son).
* **Health & Availability Status**:
  * 🚨 **Ruled Out / Injured**
  * ⚠️ **Doubtful** with exact playing probability meter (e.g. 75% or 25%)
  * 🟥 **Suspended**
  * ℹ️ **Unavailable / Transfer**
* **Detailed Medical Reports**: Descriptive notes on injuries, expected return dates, or team announcements.

### 5. ⭐ Favorites & Personalized Feed
* **Pick Favorite Clubs**: Multi-select any of the 20 Premier League teams with instant presets (such as "Big Six").
* **Pick Favorite Players**: Searchable directory of Premier League players with quick star filters.
* **Persistent Preferences**: Selections are saved locally in `localStorage` across browsing sessions.
* **"My Feed Only" Toggle**: Filter the entire rundown at the touch of a button to highlight and isolate your tracked teams and players.

---

## 🛠️ Architecture & Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Data Layer**:
  * Fantasy Premier League (FPL) public bootstrap & fixtures endpoints
  * Resilient fallback dataset for offline or rate-limited environments
  * In-memory cache for high performance and low latency

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) v18.17+ or v20+ / v24+
* `npm` or `pnpm` / `yarn`

### Installation
1. Clone the repository and navigate into the folder:
   ```bash
   git clone <repo-url>
   cd epl-digest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
epl-digest/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── rundown/
│   │   │       └── route.ts         # API endpoint serving live rundown JSON
│   │   ├── globals.css              # Tailwind CSS styles and theme tokens
│   │   ├── layout.tsx               # Root layout & page metadata
│   │   └── page.tsx                 # Home page with streaming suspense
│   ├── components/
│   │   ├── FavoritesModal.tsx       # Modal for selecting clubs and players
│   │   ├── Header.tsx               # Navigation, feed toggle, tabs, and refresh
│   │   ├── LeagueTableView.tsx      # Standings table with position shifts
│   │   ├── MatchResultsView.tsx     # Scorelines, goalscorers, and MVP badges
│   │   ├── OverviewHero.tsx         # Gameweek summary banner & quick metrics
│   │   ├── PlayerNewsView.tsx       # Injury bulletins and playing probability
│   │   ├── PlayerPerformancesView.tsx # Gameweek star performers and stats
│   │   └── RundownDashboard.tsx     # Client state orchestrator
│   ├── lib/
│   │   ├── constants.ts             # Club branding, colors, and star keywords
│   │   ├── mockData.ts              # Rich offline fallback dataset
│   │   └── rundownService.ts        # Data processing, stats & table calculation
│   └── types/
│       └── index.ts                 # TypeScript data contracts & models
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License
MIT
