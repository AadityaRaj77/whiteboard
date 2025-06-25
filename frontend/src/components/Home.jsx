import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../App.css";
import API from "../api.js";

function Home() {
  const [loginForm, setLoginForm] = useState({});
  const navigate = useNavigate();

  const handleForm = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    const promise = await fetch("http://localhost:3001/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });
    const res = await promise.json();
    if (res.success) {
      navigate("/whiteboard");
    } else {
      //
    }
  };

  return (
    <div className="body h-screen">
      <div className="flex justify-center">
        <span className="text-4xl text-blue-400 mt-15 text-center">
          Collaborative Whiteboard
        </span>
      </div>
      <div
        className="
    mt-25
    justify-self-center
    w-2/3
    lg:w-1/3
    p-8
    rounded-lg
    backdrop-blur-[20px]
    bg-white/50
    shadow-[0_1px_12px_rgba(0,0,0,0.25)]
    border
    border-white/30
  "
      >
        <h1 className="text-center text-2xl mb-8">Login/Register</h1>
        <div className="items-center">
          <p className="mb-1">Username</p>
          <input
            type="text"
            className="border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400 mb-4"
            name="username"
            onChange={handleForm}
            value={loginForm.username ?? ""}
          />

          <p className="mb-1">Password</p>
          <input
            type="text"
            className="border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400"
            name="password"
            onChange={handleForm}
            value={loginForm.password ?? ""}
          />

          <button
            className="cursor-pointer block bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 justify-center items-center mt-8 mx-auto"
            onClick={submitForm}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

/*container justify-self-center content-center bg-white w-1/3 p-8 mt-25 rounded-2xl hover:shadow-md*/
