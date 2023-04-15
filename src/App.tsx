import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AllPosts from "./AllPosts";
import Welcome, { welcomeLoader } from "./Welcome";
import MessageBoard from "./MessageBoard";
import PostView from "./PostView";
import NavBar from "./NavBar";
import { SupashipUserInfo, useSession } from "./use-session";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {path:"", element: <MessageBoard />},
      {
        path: "message-board",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />,
          },
          {
            path: "post/:postId",
            element: <PostView />,
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
]);

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
});

function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  const supashipUserInfo = useSession();
  return (
    <>
      <UserContext.Provider value={supashipUserInfo}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}
export default App;
