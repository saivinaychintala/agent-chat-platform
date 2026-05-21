# 🚀 Agent Chat Platform - Quick Demo Guide

## 🎯 Quick Access

**🌐 Open Application:** http://localhost:5173

---

## 🔐 Login Credentials

```
Email:    demo@example.com
Password: Demo123456
```

---

## 📝 Demo Flow (5 Minutes)

### 1️⃣ **Login** (30 seconds)
1. Go to http://localhost:5173
2. Enter email: `demo@example.com`
3. Enter password: `Demo123456`
4. Click "Sign in"

### 2️⃣ **Dashboard** (30 seconds)
- View "Your AI Agents" section
- See the existing "Code Assistant" agent
- Or click "Create Agent" to make a new one

### 3️⃣ **Create New Agent** (1 minute) - Optional
1. Click "Create Agent" button
2. Fill in details:
   - **Name:** e.g., "Marketing Assistant"
   - **Description:** e.g., "Helps with marketing content"
   - **System Prompt:** (auto-filled)
3. Click "Create Agent"

### 4️⃣ **Start Chat** (30 seconds)
1. Click "Start Chat" on any agent card
2. Wait for chat interface to load

### 5️⃣ **Test Conversation** (2-3 minutes)
**Try these sample messages:**

```
1. "Hello! Can you help me with React?"
   → AI responds with helpful message

2. "Explain TypeScript interfaces"
   → AI provides explanation

3. "What's the difference between REST and GraphQL?"
   → AI compares the two

4. "How do I use MongoDB with Node.js?"
   → AI explains integration
```

---

## ✨ Key Features to Show

### ✅ Real-Time Updates
- Messages appear instantly
- Typing indicators (hover over input)
- Message timestamps

### ✅ Agent Management
- Create multiple agents
- Each with unique configuration
- Switch between agents easily

### ✅ Chat History
- All messages saved to MongoDB
- Persistent across sessions
- Scroll through conversation

### ✅ Modern UI/UX
- Clean, responsive design
- Smooth animations
- Loading states
- Error handling

---

## 🎨 UI Components to Highlight

### Login Page
- Email validation
- Password field with visibility toggle
- "Create account" link
- Demo message hint

### Dashboard
- Agent cards with details:
  - Agent name and model
  - Description
  - System prompt preview
  - Action buttons (Chat, Delete)
- Empty state with CTA
- Header with user info and logout

### Chat Interface
- Agent name in header
- Message bubbles (user vs AI)
- Timestamps
- Message input with send button
- "Back to Dashboard" navigation
- Empty state for new conversations

---

## 🔧 Technical Features (For Tech Demo)

### Backend (NestJS)
```bash
# View API Documentation
http://localhost:3000/api/docs

# Key Endpoints:
POST   /auth/register     → Register user
POST   /auth/login        → Login user
GET    /auth/me           → Get current user
POST   /agents            → Create agent
GET    /agents            → List agents
POST   /sessions          → Create session
POST   /sessions/:id/messages → Send message
GET    /sessions/:id/messages → Get messages
```

### WebSocket Events
```javascript
// Client → Server
'join_session'   → Join a chat session
'send_message'   → Send a message
'typing'         → User is typing

// Server → Client
'message'        → New message received
'user_typing'    → Another user is typing
'error'          → Error occurred
```

### Database Collections
```
✅ users      → User accounts
✅ agents     → AI agent configurations
✅ sessions   → Chat sessions
✅ messages   → Chat messages
```

---

## 📊 Demo Statistics

- **Total API Endpoints:** 14 REST endpoints
- **WebSocket Events:** 6 events
- **Database Models:** 4 schemas
- **Frontend Pages:** 4 pages (Login, Register, Dashboard, Chat)
- **UI Components:** 15+ reusable components
- **Lines of Code:** ~3,500 total

---

## 🎬 Quick Demo Script (For Presentation)

### 1. **Introduction** (30s)
> "This is a full-stack AI agent chat platform built with NestJS, React, MongoDB, Redis, and Socket.IO. It demonstrates modern web development practices including real-time communication, JWT authentication, and clean architecture."

### 2. **Login** (30s)
> "Let me log in with our demo account. The authentication uses JWT tokens with bcrypt password hashing."

### 3. **Dashboard** (1m)
> "Here's the dashboard where users can manage their AI agents. Each agent has its own configuration, model settings, and system prompt. We've already created a 'Code Assistant' agent."

### 4. **Chat** (2m)
> "Let me start a chat with this agent. The chat interface is real-time using WebSocket. Watch as I send a message... and the AI responds instantly. All messages are persisted to MongoDB and the conversation history is maintained."

### 5. **Technical Highlights** (1m)
> "Some key technical features:
> - Full TypeScript for type safety
> - Modular NestJS architecture with dependency injection
> - React with Zustand for state management
> - Real-time WebSocket with Socket.IO
> - MongoDB for persistence, Redis for caching
> - Comprehensive API documentation with Swagger
> - Responsive UI with Tailwind CSS"

---

## 🐛 Troubleshooting

### If backend isn't running:
```bash
cd /home/Vinay.Chintala/Personal/Github-projects/agent-chat-platform
pnpm --filter backend start:dev
```

### If frontend isn't running:
```bash
cd /home/Vinay.Chintala/Personal/Github-projects/agent-chat-platform
pnpm --filter frontend dev
```

### If services aren't responding:
1. Check MongoDB: `systemctl status mongod`
2. Check Redis: `ps aux | grep redis`
3. Check ports: `lsof -ti:3000,5173,6379,27017`

---

## 📚 Additional Resources

- **Full Documentation:** `README.md`
- **Setup Guide:** `QUICKSTART.md`
- **Architecture Details:** `FINAL_SUMMARY.md`
- **Testing Summary:** `TESTING_COMPLETE.md`
- **API Docs:** http://localhost:3000/api/docs

---

## 🎉 Ready to Demo!

**Everything is set up and tested. Just open the browser and follow the flow!**

**Browser:** http://localhost:5173  
**Login:** demo@example.com / Demo123456

---

**Good luck with your demo! 🚀**
