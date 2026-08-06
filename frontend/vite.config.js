import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/chats":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/user/signup":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/user/login":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/user/all-users":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/chats/group":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/chats/group/add_user":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/chats/group/rename":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/chats/group/remove_user":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/message":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/generate-token/":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
      "/api/message/file/upload":
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app",
    },
  },
  plugins: [react()],
});
