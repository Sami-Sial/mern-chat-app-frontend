import "./app.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatProvider from "./context/ChatProvider.jsx";

import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ResetPassword from "./pages/ResetPassword";

import ChatsPage from "./pages/ChatsPage";
import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
    ],
  },
  { path: "/chats", element: <ChatsPage /> },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  return (
    <>
      <ChatProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChatProvider>
    </>
  );
}

export default App;
