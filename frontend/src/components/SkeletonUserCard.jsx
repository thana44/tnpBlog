import React from 'react'
import { Skeleton } from '@mui/material';

function SkeletonUserCard() {
  return (
    <div className='bg-white shadow-md flex items-center justify-between p-2 hover:scale-[1.01] rounded-md duration-200'>
    <div className='flex items-center gap-2'>
        <Skeleton animation={"wave"} variant="circular" width={50} height={40}/>
        <div className='flex flex-col w-full justify-between xl:flex-row'>
            <Skeleton animation={"wave"} variant="rounded" width={128} />
        </div>
    </div>
    <div>
        <Skeleton animation={"wave"} variant="rounded" width={128} />
    </div>
</div>
  )
}

export default SkeletonUserCard