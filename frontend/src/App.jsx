import { useState, useEffect, useRef } from 'react'
import './App.css'
import Home from './components/home'
import Whiteboard from './components/Whiteboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "/whiteboard",
      element: <Whiteboard/>
    }
  ])
  return (
    <>
    <RouterProvider router={router}>

    </RouterProvider>
    </>
  )
}

export default App
