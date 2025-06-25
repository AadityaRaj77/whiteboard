// import './App.css'
import Home from "/src/components/Home.jsx";
import Whiteboard from "/src/components/Whiteboard.jsx";
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
