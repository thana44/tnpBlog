import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard'
import Postedby from '../components/Postedby'
import Blogdetail from '../components/Blogdetail'
import Commentcon from '../components/Commentcon'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { getReadBlogData, getblogRecom } from '../redux/reduxSlice/blogSlice'
import SkeletonBlogCard from '../components/SkeletonBlogCard'


function Read() {
    const test = false
    const {blogId} = useParams()
    const {readBlogData, blogRecom} = useSelector((state)=> state.blog)
    const dispatch = useDispatch()
    const [blog, setBlog] = useState([])
    const [next, setNext] = useState(false)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingBlogId, setIsLoadingBlogId] = useState(false)

    const getBlogId = async()=>{
        setIsLoadingBlogId(true)
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/readBlog/${blogId}`)
            .then((res)=>{
                setBlog(res.data[0])
                dispatch(getReadBlogData(res.data[0]))
                setNext(true)
            })
        }catch(err){
            const {status} = err.response
            if(status === 404){
                return navigate('/')
            }
            console.log(err)
        }finally{
            setIsLoadingBlogId(false)
        }
    }

    const getBlogRecom = async()=>{
        setIsLoading(true)
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getBlogRecom?blogId=${blogId}&category=${blog.blogCategory}`)
            .then((res)=>{
                console.log(res.data)
                dispatch(getblogRecom(res.data))
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
    },[blogId])

    useEffect(()=>{
        if(next){
            getBlogRecom()
            setNext(false)
        }
    },[next, blogId])


  return (
    <div className='mt-40 bg-transparent grid pb-3 px-4 sm:px-16 md:px-20'>
        <Commentcon/>
        <div className='bg-transparent grid lg:grid-cols-65-35 lg:gap-3'>
            <div className='bg-transparent'>
                <div>
                    <Blogdetail blog={readBlogData || blog} isLoading={isLoadingBlogId}/>
                </div>
                <div className='grid gap-4 mt-10'>
                    <h2 className='font-bold text-2xl'>Posted By</h2>
                    <Postedby blog={readBlogData || blog} isLoading={isLoadingBlogId}/>
                </div>
            </div>
            <div className='grid gap-4 mt-10 bg-transparent lg:mt-0 lg:flex lg:flex-col'>
                <h2 className='font-bold text-2xl'>Recommended Blogs</h2>
                <div className='grid gap-2'>
                    {
                        isLoading || isLoadingBlogId? <>
                        <SkeletonBlogCard/>
                        <SkeletonBlogCard/>
                        <SkeletonBlogCard/>
                        </>
                        :
                        blogRecom && blogRecom.length !== 0? blogRecom.map((blog)=>{
                            return (
                                <BlogCard key={blog.blogId} blogData={blog} type={'recom'}/>
                            )
                        }) : <h2 className='text-center mt-10 text-lg text-gray-600'>Blog not found.</h2>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Read