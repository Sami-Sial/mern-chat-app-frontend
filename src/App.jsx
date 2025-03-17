import "./app.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import ChatProvider from "./context/ChatProvider.jsx";

import HomePage from "./pages/HomePage";
import ChatsPage from "./pages/ChatsPage";
import PageNotFound from "./pages/PageNotFound";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/chats", element: <ChatsPage /> },
  { path: "*", element: <PageNotFound /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
