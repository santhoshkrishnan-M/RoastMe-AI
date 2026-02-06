# Tambo SDK Integration Guide

## Quick Start

The RoastMe AI project is fully integrated with Tambo SDK for intelligent conversation management.

## Installation

Already included in `package.json`:
```json
"@tambo-ai/react": "^0.1.0",
"@tambo-ai/core": "^0.1.0"
```

## Setup

### 1. Get Tambo API Key

Visit [Tambo AI](https://tambo.ai) and get your API key.

### 2. Configure Environment

Add to `frontend/.env.local`:
```
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

### 3. Provider Setup

Already configured in `app/layout.tsx`:
```tsx
import { TamboProvider } from '@tambo-ai/react';

export default function RootLayout({ children }) {
  return (
    <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}>
      {children}
    </TamboProvider>
  );
}
```

## Usage

### Chat Interface

The `TamboChatInterface` component uses Tambo SDK:

```tsx
import { useTambo } from '@tambo-ai/react';

const { messages, sendMessage, isLoading } = useTambo();
```

### Features Powered by Tambo

1. **Message Threading** - Automatic conversation context
2. **Streaming Responses** - Real-time AI replies
3. **Context Awareness** - Intelligent conversation flow
4. **Error Handling** - Built-in retry logic

## Integration Points

### Chat System
- Location: `frontend/features/chat/TamboChatInterface.tsx`
- Uses: `useTambo()` hook
- Features: Real-time messaging, mood detection integration

### Mood Detection Integration
When user sends message:
1. Tambo SDK handles AI conversation
2. Message text analyzed by mood engine
3. UI switches based on detected mood
4. Smooth animation transitions

### Custom Hook
Location: `frontend/lib/tambo/tamboEngine.ts`
Exports both Tambo SDK and custom mood logic.

## Advanced Usage

### Custom Message Handling

```tsx
const handleSubmit = async (text: string) => {
  await sendMessage(text);
  // Trigger mood detection
  detectMoodFromMessage(text);
};
```

### Real-Time Updates

The system listens to Tambo messages and triggers:
- Mood analysis
- UI component switching
- State updates
- Animations

## Architecture

```
User Input
    ↓
Tambo SDK (conversation)
    ↓
Mood Detection (backend)
    ↓
UI Switching (Tambo Engine)
    ↓
Animated Transition
```

## Commands

Install dependencies:
```bash
npm install
```

Run with Tambo:
```bash
npm run dev
```

## Troubleshooting

**Missing API Key:**
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_TAMBO_API_KEY` is set
- Restart dev server

**Connection Issues:**
- Ensure backend is running on port 4000
- Check Socket.io connection
- Verify API key is valid

## Full-Send Mode

To use Tambo's full capabilities:
```bash
npx tambo full-send
```

This activates all Tambo features for production deployment.

## Documentation

- [Tambo AI Docs](https://docs.tambo.ai)
- [React SDK Reference](https://docs.tambo.ai/react)
- [API Reference](https://docs.tambo.ai/api)

## Support

For Tambo SDK issues, visit [Tambo Support](https://tambo.ai/support)
