import React from 'react'
import { useNavigate } from 'react-router-dom'

function Notfound() {
    const navigate = useNavigate()

  return (
    <div className="mt-40 flex flex-col items-center gap-7 h-[400px] justify-center pb-3 px-4 w-full mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]">
        <div className='flex gap-4 items-center'>
            <h2 className='text-2xl font-bold'>404</h2>
            <span className='text-lg text-gray-600'>This page could not be found.</span>
        </div>
        <div>
            <button onClick={()=> navigate('/')} className='bg-gray-800 p-2 rounded-lg duration-200 text-white px-4 hover:bg-gray-600 hover:scale-95'>Back to Home</button>
        </div>
    </div>
  )
}

export default Notfound