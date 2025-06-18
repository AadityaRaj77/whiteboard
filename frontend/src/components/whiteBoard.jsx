import React from 'react';

function Whiteboard() {
  //const
  return (
    <>
    <div className='relative w-full h-dvh bg-amber-100'>
      <canvas className='w-full h-dvh bg-amber-100'></canvas>
    </div>
    <div className='absolute flex bg-amber-300 top-150 p-4 ml-120 gap-4 justify-center rounded-full items-center'>
      <button className='bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500'><img src='https://cdn-icons-png.flaticon.com/128/481/481874.png' className="w-8 h-8 filter invert"></img></button>
      <button className='bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500'><img src='https://cdn-icons-png.flaticon.com/128/9051/9051443.png' className="w-8 h-8 filter invert"></img></button>
      <button className='bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500'><img src='https://cdn-icons-png.flaticon.com/128/1828/1828487.png' className="w-8 h-8 filter invert"></img></button>
      <button className='bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500'><img src='https://cdn-icons-png.flaticon.com/128/4043/4043845.png' className="w-8 h-8 filter invert"></img></button>
      <button className='bg-blue-400 text-white p-3 rounded-full size-15 hover:bg-blue-500'><img src='https://cdn-icons-png.flaticon.com/128/3502/3502539.png' className="w-8 h-8 filter invert"></img></button>
    </div>
    <div className='absolute bg-amber-300 top-10 ml-4 p-4 gap-4 justify-center rounded-full items-center'>
      <div className='text-white'>
        <h1>Fill</h1>

      </div>
      <div>
        <h1>Thickness</h1>

      </div>
      <div>
        <h1>Typography</h1>

      </div>
    </div>
    </>
  )
}

export default Whiteboard