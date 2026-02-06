# RoastMe AI - Smart Funny Personality Analyzer
## Powered by Tambo SDK

Production-grade full-stack web application with real-time mood detection, dynamic UI switching powered by Tambo SDK, and multiplayer roast battles.

## Features

- 🤖 **Tambo SDK Integration** - Official Tambo AI React SDK for intelligent chat
- 🧠 **Real-time Mood Detection** - Rule-based engine analyzing every message
- 🎨 **Dynamic UI Switching** - Tambo-powered automatic component transitions
- 💬 **Live Chat Interface** - Streaming responses with Tambo SDK
- 🔥 **AI Roast Generator** - Context-aware roasting (funny/brutal/sarcastic)
- 📊 **Personality Visualization** - Interactive radar charts
- 💡 **Life Advice Engine** - Career, discipline, focus, social guidance
- ⚡ **Sigma Mode** - For confident personalities
- 🎮 **Multiplayer Battles** - Real-time roast competitions
- 🏆 **Live Leaderboards** - Socket.io powered scoring

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- **@tambo-ai/react** - Official Tambo SDK
- TypeScript
- Tailwind CSS
- Framer Motion
- Socket.io Client
- Zustand
- Recharts

**Backend:**
- Node.js + Express
- Socket.io Server
- TypeScript
- Rule-based AI engines

## Setup Instructions

### 1. Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

Server runs on http://localhost:4000

### 2. Frontend Setup

\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` and add your Tambo API key:
\`\`\`
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

App runs on http://localhost:3000

### 3. Get Tambo API Key

Visit [Tambo AI](https://tambo.ai) to get your API key.

## Architecture

### Tambo SDK Integration
The app uses Tambo SDK for:
- Intelligent conversation management
- Message threading
- Real-time streaming responses
- Context-aware AI interactions

Located at:
- Provider: `frontend/app/layout.tsx`
- Chat Interface: `frontend/features/chat/TamboChatInterface.tsx`

### Mood Detection Engine
Location: `backend/src/services/mood/moodEngine.ts`

Rule-based system analyzing:
- Keywords and patterns
- Sentiment analysis
- Punctuation and structure
- Word length and complexity

Returns: `funny | neutral | reflective | sad | confident`

### Dynamic UI Engine
Location: `frontend/lib/tambo/tamboEngine.ts`

Maps moods to UI components with Tambo SDK:
- **Funny** → RoastPanel (playful roasts)
- **Neutral** → StrengthCard (balanced view)
- **Reflective** → WeaknessRadar (growth insights)
- **Sad** → AdviceGenerator (supportive guidance)
- **Confident** → SigmaMode (bold presentation)

### Multiplayer System
Real-time Socket.io architecture:
- Room creation with 6-digit codes
- Live player tracking
- Roast battle mechanics
- Automatic scoring and leaderboards
- Real-time state synchronization

## Project Structure

\`\`\`
roastme/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── mood/          # Mood detection
│   │   │   ├── personality/   # Trait analysis
│   │   │   ├── roast/         # Roast generation
│   │   │   ├── advice/        # Life advice
│   │   │   └── multiplayer/   # Battle system
│   │   ├── routes/            # API endpoints
│   │   ├── sockets/           # WebSocket handlers
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── app/                   # Next.js app router
│   │   ├── layout.tsx         # Tambo Provider
│   │   └── page.tsx           # Main UI
│   ├── components/            # Shared components
│   ├── features/              # Feature modules
│   │   ├── chat/              # Tambo chat interface
│   │   ├── roast/
│   │   ├── personality/
│   │   ├── radar/
│   │   ├── advice/
│   │   ├── sigma/
│   │   └── games/
│   ├── hooks/                 # Custom hooks
│   ├── lib/
│   │   ├── tambo/             # Tambo integration
│   │   └── socket/            # Socket client
│   ├── store/                 # Zustand stores
│   └── package.json
└── shared/
    ├── types/                 # TypeScript types
    └── constants/             # Shared constants
\`\`\`

## Key Features

### Real-Time Mood Analysis
Every message is analyzed instantly:
1. User sends message via Tambo SDK
2. Backend mood engine processes text
3. Mood result updates UI dynamically
4. Tambo-powered component transition

### Dynamic UI Switching
Powered by Tambo SDK:
- Smooth animated transitions
- Context-aware component selection
- Framer Motion animations
- No page reloads

### Multiplayer Roast Battles
1. Create or join room with code
2. Wait for players (2-6 players)
3. Submit roasts in real-time
4. AI judges score submissions
5. Live leaderboard updates
6. Winner announced

## API Endpoints

- `POST /api/mood/detect` - Detect mood from text
- `POST /api/roast/generate` - Generate roast
- `POST /api/personality/analyze` - Analyze personality
- `POST /api/advice/get` - Get life advice
- `GET /api/room/:code` - Get room details
- `GET /api/room/:code/leaderboard` - Get leaderboard

## WebSocket Events

- `chat:message` - Send message
- `chat:response` - Receive response
- `mood:update` - Mood changed
- `room:create` - Create room
- `room:join` - Join room
- `roast:submit` - Submit roast
- `leaderboard:update` - Score update

## Free Resources

- ✅ Tambo SDK (with API key)
- ✅ Rule-based AI (no paid APIs beyond Tambo)
- ✅ Open-source libraries only
- ✅ Free hosting compatible
- ✅ No proprietary services

## Development

Start both servers for full functionality:

\`\`\`bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
\`\`\`

## Production Deployment

1. Set environment variables
2. Build frontend: `npm run build`
3. Build backend: `npm run build`
4. Start servers in production mode

## Tambo Full-Send

For production deployment with all Tambo features:
\`\`\`bash
npx tambo full-send
\`\`\`

## Documentation

- [Tambo Integration Guide](./TAMBO_INTEGRATION.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## Contributing

This is a hackathon-ready project built with:
- Production-grade architecture
- Clean code structure
- Real-time capabilities
- Tambo SDK integration
- Free and open-source stack

## License

MIT

---

**Built with Tambo SDK** • Real-time Mood Detection • Dynamic UI • Multiplayer Battles
