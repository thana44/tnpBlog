import React from 'react'
import DomPurify from 'dompurify'
import { Skeleton } from '@mui/material';

function Blogdetail({blog, isLoading}) {
    const {blogHead, blogCategory, blogImg, blogContent} = blog
    const sefeContent = DomPurify.sanitize(blogContent)

  return (
    <div className='bg-transparent'>
        <div>
            <div className='grid gap-4'>
                {
                    !blogHead || isLoading?
                    <Skeleton animation={"wave"} variant="rounded" width={"100%"} height={70}/>
                    :
                    <h1 className='font-extrabold text-2xl'>{blogHead}</h1>
                }
                <div className='flex justify-center items-center'>
                    {
                        !blogCategory || isLoading?
                        <Skeleton animation={"wave"} variant="rounded" width={130} />
                        :
                        <button className='duration-200 hover:scale-105 bg-yellow-200 px-4 rounded-md'>{blogCategory}</button>
                    }
                </div>
            </div>
            <div className='my-7'>
                {
                    !blogImg || isLoading?
                    <Skeleton animation={"wave"} variant="rectangular" width={"100%"} height={300} />
                    :
                    <img className='w-full' src={blogImg}/>
                }
            </div>
        </div>
        {
            !sefeContent || isLoading?
            <div className='grid gap-3'>
                <Skeleton animation={"wave"} variant="rounded" width={"100%"} height={70}/>
                <Skeleton animation={"wave"} variant="rounded" width={"100%"}/>
                <Skeleton animation={"wave"} variant="rounded" width={"100%"}/>
                <Skeleton animation={"wave"} variant="rounded" width={"100%"} height={70}/>
                <Skeleton animation={"wave"} variant="rounded" width={"100%"}/>
            </div>
            :
            <div dangerouslySetInnerHTML={{__html: sefeContent}}/>
        }
    </div>
  )
}

export default Blogdetail