# 💬 ChatApp — Frontend

> Real-time chat application built with React, Socket.io Client, and Tailwind CSS. Supports private & group messaging, media sharing, voice messages, emoji reactions, and live presence indicators.

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                  # Static assets (icons, sounds, images)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── chat/
│   │   │   ├── ChatWindow.jsx       # Main chat view
│   │   │   ├── MessageBubble.jsx    # Individual message component
│   │   │   ├── MessageInput.jsx     # Input bar (text, emoji, media, voice)
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── MediaPreview.jsx     # Preview before sending
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ConversationList.jsx
│   │   │   └── UserSearch.jsx
│   │   ├── group/
│   │   │   ├── CreateGroup.jsx
│   │   │   └── GroupInfo.jsx
│   │   ├── notifications/
│   │   │   └── NotificationToast.jsx
│   │   └── shared/
│   │       ├── Avatar.jsx           # Online status badge
│   │       ├── Modal.jsx
│   │       └── Loader.jsx
│   ├── context/
│   │   ├── AuthContext.jsx          # JWT auth state
│   │   ├── SocketContext.jsx        # Socket.io connection
│   │   └── ChatContext.jsx          # Active chats, messages
│   ├── hooks/
│   │   ├── useSocket.js
│   │   ├── useVoiceRecorder.js      # MediaRecorder API wrapper
│   │   ├── useNotifications.js
│   │   └── useOnlineStatus.js
│   ├── pages/
│   │   ├── ChatPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/
│   │   ├── api.js                   # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── messageService.js
│   │   └── uploadService.js
│   ├── store/                       # Redux Toolkit (optional) or Zustand
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   └── chatSlice.js
│   ├── utils/
│   │   ├── formatTime.js
│   │   ├── fileHelpers.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Real-time | Socket.io Client |
| HTTP Client | Axios |
| State Management | Context API + useReducer (or Redux Toolkit) |
| Routing | React Router v6 |
| Emoji Picker | emoji-mart |
| Voice Recording | Web MediaRecorder API |
| Notifications | Browser Notification API |
| Media Preview | react-player / native `<video>` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x or yarn
- Backend server running (see backend README)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/chatapp.git
cd chatapp/frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> All Vite environment variables must be prefixed with `VITE_`.

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # Preview production build locally
```

---

## ✨ Features

### 1. User Authentication (JWT)
- Register and login with email/password
- JWT token stored in `localStorage` (or `httpOnly` cookie for production)
- Protected routes using a custom `<PrivateRoute>` component
- Auto-logout on token expiry with Axios interceptor

### 2. Real-time Messaging with Socket.io
- Instant message delivery via WebSocket
- Message events: `send_message`, `receive_message`, `message_delivered`, `message_read`
- Socket connection established on login and torn down on logout

### 3. Private & Group Chat
- One-on-one private conversations
- Create groups with a name, avatar, and multiple members
- Group admin controls: add/remove members, update group info
- Conversation list sorted by latest activity

### 4. Media Sharing
- Send images, videos, and files via file input
- Preview modal before sending
- Progress bar during upload
- Supports: `.jpg`, `.png`, `.gif`, `.mp4`, `.pdf`, `.zip`, and more
- Files uploaded to backend (Multer + Cloudinary or local disk)

### 5. Online / Offline Status Indicators
- Green dot on avatar when user is online
- "Last seen" timestamp when offline
- Status updates broadcast to all relevant conversations via Socket.io

### 6. Typing Indicators
- "User is typing..." shown when the other party is composing
- Debounced `typing` and `stop_typing` socket events to avoid spam

### 7. Message Notifications
- Browser Push Notifications when the tab is not focused
- In-app toast notification for new messages in inactive conversations
- Notification badge on conversation list items

### 8. Voice Message Recording & Sending
- Hold-to-record button using the Web **MediaRecorder API**
- Audio recorded as `.webm` or `.ogg` blob
- Playback via native `<audio>` element with custom controls
- Upload flow same as media files

### 9. Emoji Support
- Emoji picker powered by **emoji-mart**
- Click emoji to insert at cursor position in message input
- Emoji reactions on messages (👍 ❤️ 😂 etc.)

---

## 🔌 Socket Events Reference (Client Side)

| Event | Direction | Description |
|---|---|---|
| `connection` | Emit on login | Authenticate socket with JWT |
| `join_room` | Emit | Join a private/group room |
| `send_message` | Emit | Send a new message |
| `receive_message` | On | Receive incoming message |
| `typing` | Emit | User started typing |
| `stop_typing` | Emit | User stopped typing |
| `user_typing` | On | Someone else is typing |
| `user_stop_typing` | On | Someone stopped typing |
| `user_online` | On | A contact came online |
| `user_offline` | On | A contact went offline |
| `message_read` | Emit | Mark messages as read |
| `notification` | On | New message notification |

---

## 🗂️ API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/conversations` | Get all conversations |
| POST | `/api/conversations` | Start new private chat |
| POST | `/api/conversations/group` | Create group chat |
| GET | `/api/messages/:conversationId` | Fetch message history |
| POST | `/api/messages` | Send text message |
| POST | `/api/messages/upload` | Upload media / voice |

---

## 🔐 Authentication Flow

```
User submits login form
        │
        ▼
POST /api/auth/login
        │
        ▼
JWT token received → stored in localStorage
        │
        ▼
Axios sets Authorization header globally
        │
        ▼
Socket.io connects with token as auth param
        │
        ▼
Protected routes render Chat UI
```

---

## 🎨 UI / UX Details

- Fully responsive: mobile-first layout with a collapsible sidebar
- Dark mode support via Tailwind's `dark:` classes
- Message bubbles: sent messages aligned right (blue), received left (gray)
- Timestamps shown on hover
- Read receipts: single tick (sent), double tick (delivered), blue double tick (read)
- Smooth scroll-to-bottom on new messages

---

## 🧪 Running Tests

```bash
npm run test           # Run unit tests (Vitest)
npm run test:coverage  # Coverage report
```

---

## 🛠️ Useful Scripts

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build to dist/
npm run preview    # Serve production build
npm run lint       # ESLint check
npm run format     # Prettier format
```

---

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "socket.io-client": "^4.x",
  "axios": "^1.x",
  "@emoji-mart/react": "^1.x",
  "@emoji-mart/data": "^1.x",
  "tailwindcss": "^3.x",
  "zustand": "^4.x",
  "react-hot-toast": "^2.x",
  "react-player": "^2.x"
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

### Netlify

```bash
npm run build
# Drag and drop dist/ to Netlify dashboard
```

Add a `_redirects` file to `public/`:
```
/*  /index.html  200
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.
