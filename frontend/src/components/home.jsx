import React from 'react'

function Home() {
  return (
    <>
    <div className='bg-white shadow-lg h-20 items-center flex justify-center'>
      <h1 className='text-center text-3xl text-blue-400 font-medium'>Whiteboard</h1>
    </div>
    <div className='justify-center items-center bg-white p-10 mt-25 ml-100 mr-100 rounded-2xl hover:shadow-md'>
      <h1 className='text-center text-2xl mb-8'>Login/Register</h1>
      <div className='items-center'>
        <p className='mb-1'>Username</p>
        <input type='text' className='border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400 mb-4'/>
        <p className='mb-1'>Password</p>
        <input type='text' className='border-2 border-blue-300 rounded-md p-2 w-1/1 focus:outline-none focus:border-blue-400'/>
        <button className='block bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 justify-center items-center mt-8 mx-auto'>Submit</button>
        
      </div>
      
    </div>
    </>
  )
}

export default Home