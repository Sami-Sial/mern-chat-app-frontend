# Talk-A-Tive (Chat Site)

Welcome to **Talk-A-Tive**, a full-stack, real-time web and mobile chat application built with the MERN stack (MongoDB, Express, React, Node.js), Socket.io, and Capacitor.

## ✨ Features
- **Real-Time Messaging**: Lightning-fast message delivery using WebSockets (Socket.io).
- **Group Chats**: Create groups, add/remove members, and chat seamlessly.
- **Media Sharing**: Send and receive images, videos, and audio clips.
- **Typing Indicators**: See when someone is typing in real-time.
- **Online/Offline Status**: Know instantly if a user is currently online.
- **Responsive UI**: A highly polished, WhatsApp-web inspired layout with mobile responsiveness.
- **Mobile Apps (iOS & Android)**: Built natively using Capacitor.

## 🚀 Tech Stack
- **Frontend**: React.js (Vite), Material-UI (MUI), Context API, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Real-Time**: Socket.io.
- **Mobile Build**: Capacitor.
- **Cloud/Deployment**: Vercel (Frontend), Fly.io (Backend), Cloudinary (Media Storage).

## 🛠️ Local Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd chat-site
```

### 2. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd mern-chat-app-backend
npm install
```
Create a `.env` file in the `mern-chat-app-backend` folder (see Environment Variables section below).
Start the backend server:
```bash
npm run dev
# or
npm start
```

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd mern-chat-app-frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## 🔐 Environment Variables

You must create a `.env` file in the `mern-chat-app-backend` directory with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_nodemailer_email
EMAIL_PASS=your_nodemailer_password
```
*(If the frontend needs specific variables, ensure you create a `.env` in `mern-chat-app-frontend` prefixed with `VITE_`)*

## 📱 Mobile App Build (Capacitor)
This project is configured to be compiled into native iOS and Android apps using Capacitor.

1. **Build the web project first**:
   ```bash
   cd mern-chat-app-frontend
   npm run build
   ```
2. **Initialize Mobile Project** (First time only):
   ```bash
   cd ../mobile
   npm install
   npx cap add android
   npx cap add ios
   ```
3. **Sync changes**: Every time you update the web app and run `npm run build`, sync those changes to the native projects:
   ```bash
   cd mobile
   npx cap sync
   ```
4. **Open in Android Studio / Xcode**:
   ```bash
   npx cap open android
   # or
   npx cap open ios
   ```

## 🔄 CI/CD & Deployment

### Frontend (Vercel)
The frontend (`mern-chat-app-frontend`) is already deployed to Vercel. Connect your GitHub repository to Vercel and point the build settings to this folder.

### Backend (Fly.io)
The backend is configured for automated deployment to Fly.io via GitHub Actions.
1. The `fly.toml`, `Dockerfile`, and `.dockerignore` are located in `mern-chat-app-backend`.
2. Add your Fly.io API token to your GitHub Repository Secrets as `FLY_API_TOKEN`.
3. Every push to the `main` branch will automatically deploy the backend.

### Mobile Build Pipeline
There is an automated GitHub Action (`mobile-build.yml`) that builds the web frontend, syncs it to the Capacitor Android project, builds the APK using Gradle, and uploads the generated `app-debug.apk` as a GitHub artifact.
*Note: Ensure the Android platform has been added (`npx cap add android`) and pushed to the repository for the CI to work.*
