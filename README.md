# 🎵 Sonalysis — Music Personality Analyzer

A Spotify Wrapped-style web app that connects to your Spotify account and creates a deep personality analysis based on your listening habits. Get your listening archetype, genre DNA, mood spectrum, music alter ego, and a shareable personality card.

**Live Demo:** [Try the demo mode](http://localhost:3000/results?demo=true) (no Spotify account needed)

## What I Built

### Core Features
- **Spotify OAuth** — Secure connection to Spotify via server-side OAuth flow
- **10 Listening Archetypes** — AI-powered classification based on weighted audio feature analysis (The Inferno, The Nocturne, The Voltage, The Shapeshifter, The Classicist, The Drifter, The Shadowweaver, The Daydreamer, The Ringleader, The Oracle)
- **Genre DNA Donut Chart** — Animated SVG visualization of your macro-genre distribution
- **Mood Spectrum** — 6-axis mood analysis (Energy, Happiness, Danceability, Intensity, Exploration, Acousticness)
- **Music Alter Ego** — AI-generated persona name, title, and description based on your unique listening profile
- **One-Tap Image Share** — Canvas-rendered 1080x1920 PNG card optimized for Instagram Stories
- **Demo Mode** — Full UI experience without Spotify connection

### Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Shadcn/ui + Custom CSS animations
- **Auth**: Supabase Auth (email/password) + Spotify OAuth
- **Database**: Supabase (PostgreSQL) with RLS
- **Visualization**: Pure SVG charts + Canvas API for share export

## Quick Start

### Prerequisites
- Node.js v20+
- pnpm
- Docker (for local Supabase)
- Spotify Developer Account ([developer.spotify.com](https://developer.spotify.com/dashboard))

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Madhan2006p/Music-Personality-App.git
   cd Music-Personality-App
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start local Supabase**
   ```bash
   supabase start
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase keys (from `supabase start` output) and Spotify credentials.

5. **Create Spotify App**
   - Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Set redirect URI to `http://localhost:3000/api/spotify/callback`
   - Copy Client ID and Client Secret to `.env.local`

6. **Run migrations**
   ```bash
   supabase db reset
   ```

7. **Start dev server**
   ```bash
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/spotify/        # Spotify OAuth routes (login, callback, analyze)
│   ├── analyze/            # Analysis loading page
│   ├── results/            # Results dashboard
│   ├── auth/               # Login/signup pages
│   ├── profile/            # User profile
│   └── page.tsx            # Landing page
├── components/
│   ├── archetype-card.tsx  # Archetype display card
│   ├── genre-dna-chart.tsx # SVG donut chart
│   ├── mood-spectrum.tsx   # Mood bar charts
│   ├── alter-ego-card.tsx  # Persona card
│   ├── share-card-canvas.tsx # Canvas share export
│   ├── music-visualizer.tsx  # Background animations
│   ├── spotify-connect-button.tsx
│   └── top-items-grid.tsx  # Artist/track grids
├── lib/
│   ├── spotify/            # Spotify Web API client
│   │   ├── api.ts          # API functions
│   │   ├── config.ts       # OAuth config
│   │   └── types.ts        # TypeScript interfaces
│   ├── personality/        # Personality engine
│   │   ├── engine.ts       # Archetype classification
│   │   ├── genre-dna.ts    # Genre mapping
│   │   ├── mood-spectrum.ts # Audio feature analysis
│   │   ├── alter-ego.ts    # Persona generator
│   │   └── types.ts        # TypeScript interfaces
│   └── supabase/           # Supabase clients
├── contexts/
│   ├── auth-context.tsx
│   ├── spotify-context.tsx
│   └── subscription-context.tsx
├── supabase/
│   └── migrations/         # DB schema
└── ai-logs/                # AI development logs
```

## Personality Algorithm

The archetype classification uses a weighted scoring system across 8 dimensions:

| Dimension | Source |
|-----------|--------|
| Energy | Spotify audio features (0-1) |
| Valence | Spotify audio features (0-1) |
| Danceability | Spotify audio features (0-1) |
| Acousticness | Spotify audio features (0-1) |
| Instrumentalness | Spotify audio features (0-1) |
| Genre Diversity | Shannon entropy of macro-genre distribution |
| Popularity | Average track popularity (0-100, normalized) |
| Tempo | BPM normalized to 0-1 range |

Each archetype has a unique weight vector. The highest-scoring archetype wins.

## Issues I Ran Into

1. **Template had broken imports** — The `account/delete` API route imported a non-existent `@/lib/stripe` module. Removed the Stripe logic since this app doesn't use real payments.
2. **Missing dependencies** — `@radix-ui/react-slider` was used in the UI components but not in `package.json`. Added it.
3. **TypeScript strictness** — Supabase `User.email` is `string | undefined` but the ProfileClient expected `string`. Added fallback.
4. **Static generation vs SSR** — `next build` fails on pages that use Supabase client at build time (no running Supabase). The app works perfectly with `pnpm dev`.

## What I'd Improve With More Time

1. **Public Share URLs** — Implement the `/results/[id]` page so shared links actually work for other people
2. **Historical Comparisons** — Track how your personality changes over time with periodic re-analysis
3. **Real-time Animations** — Add Framer Motion for smoother page transitions and scroll-triggered reveals
4. **Mobile Optimization** — While the current UI is responsive, dedicated mobile layouts would improve the experience
5. **Multiple Time Ranges** — Let users compare their short-term (4 weeks) vs long-term (all time) personality
6. **Social Features** — Compare your archetype with friends, find people with similar music DNA
7. **Canvas Font Loading** — Pre-load web fonts for the share card canvas to ensure consistent rendering

## Reflection

### What was easy
- The template provided excellent auth and subscription infrastructure out of the box
- Spotify's Web API is well-documented and the audio features endpoint gives rich data for personality analysis
- Tailwind CSS 4 + Shadcn/ui made building premium-looking components fast
- The archetype weight system was intuitive to design once the dimensions were clear

### What was difficult
- **Canvas rendering** — Drawing a complex share card with Canvas API required careful coordinate math and manual text layout
- **Genre classification** — Spotify's micro-genres (1000+) needed careful mapping to macro-genres. The classification isn't perfect for edge cases
- **Template compatibility** — Pre-existing bugs in the template needed investigation and fixes before I could build on top

### What I'd change
- Would use Framer Motion from the start for animations instead of CSS keyframes — more control, better performance
- Would design the share card as a React component first, then convert to Canvas, rather than writing Canvas code directly
- Would add comprehensive error boundaries around each visualization component

---

**Built with AI assistance** — See [/ai-logs](/ai-logs) for the full development process.
