import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import ProfileCard from '../components/ProfileCard'
import Selectcom from '../components/Selectcom'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { getblog, setblogfilter  } from '../redux/reduxSlice/blogSlice'
import SkeletonBlogCard from '../components/SkeletonBlogCard'

function Profile() {
    const {profileId} = useParams()
    const [category, setCategory] = useState()

    const {blogFilter} = useSelector((state)=> state.blog)
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const getBlogId = async()=>{
        setIsLoading(true)
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getBlogId/${profileId}`)
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
        getBlogId()
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[profileId])

    useEffect(()=>{
        if(category || ready){
            dispatch(setblogfilter(category))
            setReady(false)
        }
    },[category,ready])


  return (
    <div className='mt-40 bg-transparent flex flex-col-reverse pb-3 px-4 sm:px-16 md:px-20 lg:grid lg:grid-cols-[0.7fr_0.3fr] lg:gap-3'>
        <div className='bg-transparent'>
            <div className='flex justify-between items-center mt-5 lg:mt-0'>
                <h2 className='text-lg font-bold'>My Blogs</h2>
                <Selectcom type={"show"} onSelectChange={(e)=> setCategory(e)}/>
            </div>
            <div className='grid gap-2 mt-5'>
                {
                    isLoading? <>
                    <SkeletonBlogCard/>
                    <SkeletonBlogCard/>
                    <SkeletonBlogCard/>
                    </>
                    :
                    blogFilter.length > 0? blogFilter.map((blog)=>{
                        return (
                            <BlogCard key={blog.blogId} blogData={blog} type={'home'}/>
                        )
                    }) : <h2 className='text-center mt-10 text-lg text-gray-600'>Blog not found.</h2>
                }
            </div>
        </div>
        <div className='bg-transparent'>
            <ProfileCard user_id={profileId}/>
        </div>
    </div>
  )
}

export default Profile