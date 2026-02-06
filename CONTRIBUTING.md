# Contributing to RoastMe AI

First off, thank you for considering contributing to RoastMe AI! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, Node version, browser, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how it would be used**

### 🔨 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies** in both frontend and backend
3. **Make your changes**
4. **Test your changes thoroughly**
5. **Update documentation** if needed
6. **Commit your changes** using clear commit messages
7. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Update the README.md if you add/change functionality
- Test your changes in both development and production builds
- Keep pull requests focused on a single feature or fix

### 📝 Commit Message Guidelines

We follow conventional commits for clear git history:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add multiplayer room capacity limit
fix: resolve mood detection for emojis
docs: update setup instructions
```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/santhoshkrishnan-M/RoastMe-AI.git
   cd RoastMe-AI
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   cp .env.local.example .env.local
   # Add your Tambo API key
   ```

4. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

### Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Project Structure

```
backend/     - Express server, Socket.io, AI services
frontend/    - Next.js app, React components
shared/      - Shared types and constants
```

## Testing

- Test all features manually before submitting PR
- Ensure mood detection works correctly
- Verify multiplayer functionality
- Check responsive design on different screen sizes

## Questions?

Feel free to open an issue with the `question` label if you have any questions!

## Code of Conduct

This project follows a Code of Conduct. By participating, you are expected to uphold this code.

---

Thank you for contributing! 🚀
