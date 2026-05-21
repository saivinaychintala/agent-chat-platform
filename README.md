# Agent Chat Platform

A full-stack AI agent chat platform with real-time messaging, session management, and WebSocket support. Built with NestJS, MongoDB, Redis, Socket.IO, React, and TypeScript.

## 🚀 Features

### Backend
- **NestJS** REST API with TypeScript
- **MongoDB** with Mongoose for data persistence
- **Redis** for caching and pub/sub
- **Socket.IO** for real-time WebSocket communication
- **JWT Authentication** with Passport
- **Bull Queue** for job scheduling
- **OpenAPI/Swagger** documentation
- Rate limiting and security middleware

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Query** for server state management
- **Socket.IO Client** for real-time updates
- **Zustand** for client state
- **Tailwind CSS** for styling
- **React Router** for navigation

## 📋 Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker and Docker Compose (for MongoDB and Redis)

## 🛠️ Quick Start

### 1. Clone and Install

```bash
cd /home/Vinay.Chintala/Personal/Github-projects/agent-chat-platform
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Infrastructure

```bash
# Start MongoDB and Redis
pnpm docker:up
```

### 4. Run Development Servers

```bash
# Run both backend and frontend
pnpm dev

# Or run separately
pnpm dev:backend  # Backend on http://localhost:3000
pnpm dev:frontend # Frontend on http://localhost:5173
```

## 🏗️ Project Structure

```
agent-chat-platform/
├── apps/
│   ├── backend/              # NestJS API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── agents/   # Agent CRUD
│   │   │   │   ├── auth/     # Authentication
│   │   │   │   ├── chat/     # Chat logic
│   │   │   │   ├── sessions/ # Session management
│   │   │   │   └── websocket/# WebSocket gateway
│   │   │   ├── common/       # Guards, decorators, filters
│   │   │   ├── config/       # Configuration
│   │   │   └── database/     # Schemas & repositories
│   │   └── package.json
│   └── frontend/             # React App
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── pages/        # Page components
│       │   ├── hooks/        # Custom hooks
│       │   ├── api/          # API clients
│       │   └── store/        # State management
│       └── package.json
├── packages/
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Shared utilities
├── docker-compose.yml
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Run both apps
pnpm dev:backend      # Run backend only
pnpm dev:frontend     # Run frontend only

# Build
pnpm build            # Build all apps
pnpm build:backend    # Build backend
pnpm build:frontend   # Build frontend

# Testing
pnpm test             # Run all tests
pnpm lint             # Lint all code

# Docker
pnpm docker:up        # Start MongoDB & Redis
pnpm docker:down      # Stop containers
pnpm docker:logs      # View logs
```

## 🗄️ Database Schema

### Users
- email, password (hashed), name, role
- Authentication and authorization

### Agents
- name, description, config (model, temperature, systemPrompt)
- Owned by users

### Sessions
- Links user + agent
- Status: active, closed, archived
- Metadata for tracking

### Messages
- Belongs to session
- Role: user, assistant, system
- Content and metadata

## 🔐 Authentication

JWT-based authentication with refresh tokens:

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` → Returns JWT token
3. **Protected Routes**: Add `Authorization: Bearer <token>` header
4. **WebSocket**: Pass token in Socket.IO auth

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Agents
- `GET /agents` - List user's agents
- `POST /agents` - Create agent
- `GET /agents/:id` - Get agent details
- `PUT /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

### Sessions
- `POST /sessions` - Create new session
- `GET /sessions` - List sessions
- `GET /sessions/:id` - Get session details
- `POST /sessions/:id/close` - Close session
- `GET /sessions/:id/messages` - Get messages

### Chat
- `POST /sessions/:id/messages` - Send message (REST)
- WebSocket events for real-time chat

## 🔌 WebSocket Events

### Client → Server
- `join_session` - Join a chat session
- `send_message` - Send a message
- `typing` - Typing indicator
- `leave_session` - Leave session

### Server → Client
- `session_history` - Initial messages
- `new_message` - New message in session
- `typing` - Someone is typing
- `error` - Error message

## 🚢 Deployment

### Docker Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run in production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. **Backend**: Deploy to Railway/Render
2. **Frontend**: Deploy to Vercel/Netlify
3. **Database**: MongoDB Atlas
4. **Cache**: Redis Cloud

## 🧪 Testing

```bash
# Backend tests
cd apps/backend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
pnpm test:cov          # Coverage

# Frontend tests
cd apps/frontend
pnpm test              # Component tests
pnpm test:e2e          # Playwright E2E
```

## 📚 Technologies

| Category | Technology |
|----------|------------|
| **Backend** | NestJS, Node.js, TypeScript |
| **Frontend** | React 18, TypeScript, Vite |
| **Database** | MongoDB, Mongoose |
| **Cache** | Redis |
| **WebSocket** | Socket.IO |
| **Auth** | JWT, Passport |
| **Queue** | Bull, BullMQ |
| **Styling** | Tailwind CSS |
| **State** | React Query, Zustand |
| **Testing** | Jest, Vitest, Playwright |
| **DevOps** | Docker, Docker Compose |

## 🤝 Contributing

This is a portfolio project. Feel free to fork and modify for your own use!

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**Vinay Chintala**
- LinkedIn: [linkedin.com/in/yourprofile]
- GitHub: [github.com/yourusername]
- Email: vinay.schintala@gmail.com

---

Built with ❤️ showcasing full-stack development skills with modern technologies.
