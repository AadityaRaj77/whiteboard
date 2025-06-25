// import './App.css'
import Home from "@/home.jsx";
import Whiteboard from "@/whiteboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import API from "./api.js";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/whiteboard",
      element: <Whiteboard />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
