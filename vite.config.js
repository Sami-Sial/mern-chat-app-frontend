import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/chats": "http://localhost:8080",
      "/api/user/signup": "http://localhost:8080",
      "/api/user/login": "http://localhost:8080",
      "/api/user/all-users": "http://localhost:8080",
      "/api/chats/group": "http://localhost:8080",
      "/api/chats/group/add_user": "http://localhost:8080",
      "/api/chats/group/rename": "http://localhost:8080",
      "/api/chats/group/remove_user": "http://localhost:8080",
      "/api/message": "http://localhost:8080",
      "/api/generate-token/": "http://localhost:8080",
      "/api/message/file/upload": "http://localhost:8080",
    },
  },
  plugins: [react()],
});
