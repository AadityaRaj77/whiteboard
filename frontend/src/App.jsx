// import './App.css'
import Home from "@/components/home.jsx";
import Whiteboard from "@/components/whiteboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import API from "./api.js";

fetch("http://localhost:3001/api/room");
fetch(`${API}/api/room`);
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
