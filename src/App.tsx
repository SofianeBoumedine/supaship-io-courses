import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import AllPosts from './AllPosts'
import Welcome from './Welcome'
import MessageBoard from './MessageBoard'
import PostView from './PostView'
import NavBar from './NavBar'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts/>,
          },
          {
            path: "post/:postId",
            element: <PostView />,
          }
        ],
      },
      {
        path: "bienvenue",
        element: <Welcome />,
        children: [],
      }
    ],
  }
])



function App() {
  return <RouterProvider router={router} />
}

export default App

function Layout() {
  return <>
    <NavBar />
    <Outlet />
  </>;
}