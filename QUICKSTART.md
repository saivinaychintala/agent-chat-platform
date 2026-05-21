# Quick Start Guide

## Backend Setup Complete! ✅

The backend NestJS application is fully configured and ready to run.

### What's Been Implemented:

#### ✅ Core Infrastructure
- NestJS application with TypeScript
- MongoDB integration with Mongoose
- Redis configuration (ready for caching & queues)
- JWT Authentication with Passport
- WebSocket support with Socket.IO
- Swagger API documentation

#### ✅ Authentication Module
- User registration with password hashing (bcrypt)
- JWT-based login
- Protected routes with JWT guards
- Current user endpoint

#### ✅ Agents Module
- Full CRUD operations for AI agents
- Agent configuration (model, temperature, system prompt)
- User ownership and access control

#### ✅ Sessions Module
- Create chat sessions
- List/filter sessions (by status, agent)
- Close sessions
- Session management

#### ✅ Chat Module  
- Send messages (REST API)
- Get message history
- Mock LLM service (ready for OpenAI integration)
- Token estimation

#### ✅ WebSocket Gateway
- Real-time messaging
- Join/leave sessions
- Typing indicators
- Message broadcasting
- JWT authentication for WebSocket

---

## How to Run

### 1. Install Dependencies

```bash
cd /home/Vinay.Chintala/Personal/Github-projects/agent-chat-platform

# Install root dependencies
pnpm install

# Install backend dependencies
cd apps/backend
pnpm install
```

### 2. Setup Environment

```bash
# Copy environment file
cp apps/backend/.env.example apps/backend/.env

# Edit the .env file if needed (defaults should work for local dev)
```

### 3. Start MongoDB and Redis

```bash
# From project root
pnpm docker:up

# This will start:
# - MongoDB on localhost:27017
# - Redis on localhost:6379
```

### 4. Run the Backend

```bash
# From project root
pnpm dev:backend

# OR from backend directory
cd apps/backend
pnpm start:dev
```

The backend will start on **http://localhost:3000**

### 5. Access API Documentation

Open your browser and visit:
- **Swagger UI**: http://localhost:3000/api/docs

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (returns JWT token)
- `GET /auth/me` - Get current user (protected)

### Agents
- `GET /agents` - List your agents
- `POST /agents` - Create agent
- `GET /agents/:id` - Get agent details
- `PATCH /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent

### Sessions
- `POST /sessions` - Create new session
- `GET /sessions` - List sessions
- `GET /sessions/:id` - Get session details
- `POST /sessions/:id/close` - Close session
- `DELETE /sessions/:id` - Delete session

### Chat (REST)
- `POST /sessions/:sessionId/messages` - Send message
- `GET /sessions/:sessionId/messages` - Get messages

### WebSocket Events

**Client → Server:**
- `join_session` - Join a chat session
- `send_message` - Send a message
- `typing` - Typing indicator
- `leave_session` - Leave session

**Server → Client:**
- `session_history` - Initial messages
- `new_message` - New message in session
- `typing` - AI is typing
- `user_typing` - Another user is typing
- `error` - Error message

---

## Testing the Backend

### 1. Using Swagger UI

Visit http://localhost:3000/api/docs and test endpoints interactively.

### 2. Using curl

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'

# Login (save the token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Create an agent (use token from login)
curl -X POST http://localhost:3000/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Support Agent",
    "description": "Helps with customer support"
  }'

# Create a session
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "agentId": "AGENT_ID_HERE"
  }'

# Send a message
curl -X POST http://localhost:3000/sessions/SESSION_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Hello, how can you help me?"
  }'
```

### 3. Testing WebSocket

You can test WebSocket using the frontend (coming next) or tools like:
- Postman (WebSocket support)
- wscat: `npm install -g wscat`

```bash
# Connect to WebSocket
wscat -c ws://localhost:3000 --auth token:YOUR_JWT_TOKEN

# Once connected, send:
{ "event": "join_session", "data": { "sessionId": "SESSION_ID" } }
{ "event": "send_message", "data": { "sessionId": "SESSION_ID", "content": "Hello!" } }
```

---

## Next Steps

### ✅ Completed
1. Backend setup
2. Authentication
3. Agents CRUD
4. Sessions management
5. Chat API
6. WebSocket gateway

### 🚧 Coming Next
1. **React Frontend** - Chat UI, agent management
2. **Docker Production Setup** - Multi-stage builds
3. **Tests** - Unit and E2E tests
4. **Deployment Guide** - Railway/Render + Vercel

---

## Database Schemas

### User
- email, password (hashed), name, role, isActive

### Agent
- name, description, owner (User ref)
- config: { model, temperature, systemPrompt, maxTokens }

### Session
- agent (ref), user (ref), status, title, messageCount

### Message
- session (ref), role (user/assistant/system), content, tokens

---

## Architecture

```
Frontend (React) ←→ Backend (NestJS) ←→ MongoDB
                         ↓
                    Socket.IO ←→ Clients
                         ↓
                      Redis (Cache/Queue)
                         ↓
                    OpenAI API (Optional)
```

---

## Troubleshooting

### MongoDB Connection Error
- Make sure Docker is running: `docker ps`
- Start MongoDB: `pnpm docker:up`
- Check connection: `mongosh mongodb://localhost:27017`

### Port Already in Use
- Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`
- Or change PORT in .env file

### WebSocket Connection Failed
- Check CORS_ORIGIN in .env matches frontend URL
- Verify JWT token is valid

---

## Ready to Build Frontend?

The backend is production-ready! Next, we'll create the React frontend with:
- Login/Register UI
- Agent management dashboard
- Real-time chat interface
- Session history
- Beautiful Tailwind UI

Let me know when you're ready to continue!
