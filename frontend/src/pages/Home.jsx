import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import Selectcom from '../components/Selectcom'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { getblog, setblogfilter } from '../redux/reduxSlice/blogSlice'
import SkeletonBlogCard from '../components/SkeletonBlogCard'

function Home() {
    const {blogFilter} = useSelector((state)=> state.blog)
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getAllBlog = async()=>{
        setIsLoading(true)
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getAllBlog`,{withCredentials: true})
            .then((res)=>{
                dispatch(getblog(res.data))
                setReady(true)
            })
        }catch(err){
            console.log(err)
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        getAllBlog()
    },[])

    const [category, setCategory] = useState()

    useEffect(()=>{
        if(category && ready){
            dispatch(setblogfilter(category))
        }
    },[category, ready])


  return (
    <div className='mt-40 bg-transparent grid pb-3 px-4 w-full mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]'>
        <div>
            <div className='bg-transparent flex justify-between items-center'>
                <h2 className='font-bold text-lg'>Home</h2>
                <div className=''>
                    <Selectcom type={"show"} onSelectChange={(e)=> setCategory(e)}/>
                </div>
            </div>
            <div className='grid gap-2 mt-2'>
                {
                    isLoading? <>
                    <SkeletonBlogCard/>
                    <SkeletonBlogCard/>
                    <SkeletonBlogCard/>
                    </>
                    :
                    blogFilter?.length > 0? blogFilter.map((blog)=>{
                        return (
                            <BlogCard key={blog.blogId} blogData={blog} type={'home'}/>
                    )
                    }) : <h2 className='text-center mt-10 text-lg text-gray-600'>Blog not found.</h2>
                }
            </div>
        </div>
    </div>
  )
}

export default Home