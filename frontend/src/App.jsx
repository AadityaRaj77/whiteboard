// import './App.css'
import Home from "@/components/Home.jsx";
import Whiteboard from "@/components/Whiteboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
