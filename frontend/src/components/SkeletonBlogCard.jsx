import React from 'react'
import { Skeleton } from '@mui/material';

function SkeletonBlogCard() {
  return (
    <div className='bg-white shadow-md grid p-2 rounded-md duration-200 hover:scale-[1.01]' style={{gridTemplateColumns:'1.4fr 0.6fr'}}>
        <div className='bg-white grid'>

                <div className='flex gap-2 items-center'>
                    <Skeleton animation={"wave"} variant="circular" width={50} height={40}/>
                    <div className='flex flex-col gap-1 w-full justify-between xl:flex-row'>
                        <Skeleton animation={"wave"} variant="rounded" width={128} />
                        <Skeleton animation={"wave"} variant="rounded" width={128} />
                    </div>
                </div>

                <div className='mb-3 mt-3'>
                    <Skeleton animation={"wave"} variant="rectangular" width={"90%"} height={70} />
                </div>

            <div className='flex gap-2 items-center'>
                <div className='flex gap-1 items-center'>
                    <Skeleton animation={"wave"} variant="rounded" width={100} />
                </div>
                <button className='bg-yellow-200 px-4 rounded-md duration-200 hover:scale-105'></button>
            </div>
        </div>
        <div className='bg-white flex justify-center items-center'>
                <Skeleton animation={"wave"} variant="rectangular" width={"80%"} height={160} />
        </div>
    </div>
  )
}

export default SkeletonBlogCard