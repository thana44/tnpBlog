import React from 'react'
import '../index.css'

function LoadingSpin() {
  return (
    <div className='mt-40 flex flex-col gap-7 items-center justify-center pb-3 px-4 w-full h-[400px] mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]'>
        <div className='spinner'></div>
        <div className='text-lg text-gray-700 font-bold'>Please wait a moment.</div>
    </div>
  )
}

export default LoadingSpin