# 🔥 RoastMe AI - Smart Funny Personality Analyzer

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

### Powered by Tambo SDK 🚀

*Production-grade full-stack web application with real-time mood detection, dynamic UI switching powered by Tambo SDK, and multiplayer roast battles.*

[Features](#features) • [Quick Start](#setup-instructions) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📸 Screenshots

> *Coming soon - Add your screenshots here!*

## ✨ Features

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

## 📚 Documentation

- [Tambo Integration Guide](./TAMBO_INTEGRATION.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting a Pull Request.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔒 Security

Found a security vulnerability? Please read our [Security Policy](./SECURITY.md) for responsible disclosure guidelines.

## 🙏 Acknowledgments

- [Tambo AI](https://tambo.ai) for the amazing SDK
- All contributors who help improve this project
- The open-source community

## 📞 Support

- 📫 Open an [issue](https://github.com/santhoshkrishnan-M/RoastMe-AI/issues) for bug reports or feature requests
- ⭐ Star this repository if you find it helpful
- 🔄 Fork and contribute to make it better

## 🎯 Project Status

![CI Status](https://img.shields.io/badge/build-passing-brightgreen)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

---

<div align="center">

**Built with ❤️ and Tambo SDK** • Real-time Mood Detection • Dynamic UI • Multiplayer Battles

[Report Bug](https://github.com/santhoshkrishnan-M/RoastMe-AI/issues) • [Request Feature](https://github.com/santhoshkrishnan-M/RoastMe-AI/issues) • [Contribute](./CONTRIBUTING.md)

</div>
