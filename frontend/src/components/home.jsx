import React, { useState } from 'react'
import { useNavigate } from 'react-router'

function Home() {
  const [loginForm, setLoginForm] = useState({})
  const navigate = useNavigate();
  

  const handleForm = (e) => {
    setLoginForm({...loginForm, [e.target.name]: e.target.value })
  }

  const submitForm = async () => {
    const promise = await fetch('http://localhost:3001/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
    const res = await promise.json()
    if (res.success) {
      navigate('/whiteboard')
    } else {
      //
    }
  }

  return (
    <>
    <div className='h-20 items-center flex'>
      <h1 className='text-3xl text-blue-400 font-medium'>Whiteboard</h1>
    </div>
    <div className='relative items-center bg-white p-10 mt-25 ml-220 mr-50 rounded-2xl hover:shadow-md'>
      <h1 className='text-center text-2xl mb-8'>Login/Register</h1>
      <div className='items-center'>
        <p className='mb-1'>Username</p>
        <input type='text' className='border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400 mb-4' name='username' onChange={handleForm} value={loginForm.username ?? ''}/>

        <p className='mb-1'>Password</p>
        <input type='text' className='border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400' name='password' onChange={handleForm} value={loginForm.password ?? ''}/>

        <button className='block bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 justify-center items-center mt-8 mx-auto' onClick={submitForm}>Submit</button>
        
      </div>
    </div>
    <div>
      <img src='https://img.freepik.com/premium-photo/poster-man-woman-front-whiteboard-with-graph_1288286-2337.jpg?uid=R204064089&ga=GA1.1.37188644.1740345148&semt=ais_hybrid&w=740' className='absolute top-40 ml-8'></img>
    </div>
    </>
  )
}

export default Home