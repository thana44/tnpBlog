import React, { useEffect, useState } from 'react'
import Selectcom from '../components/Selectcom'
import BlogCard from '../components/BlogCard'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { deleteBlog, getblog, setblogfilter  } from '../redux/reduxSlice/blogSlice'
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Swal from 'sweetalert2'
import SkeletonBlogCard from '../components/SkeletonBlogCard'

function GetblogUpdate() {
    const [category, setCategory] = useState('')
    const {profileId} = useParams()

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
        }finally {
            setIsLoading(false)
        }
    }

    const deleteBlogFunction = async(blogId)=>{
        try{
            dispatch(deleteBlog({blogId}))
            await axios.delete(`${import.meta.env.VITE_BACKENDHOST}/blog-api/blogDelete?blogId=${blogId}`,{withCredentials:true})
            .then((res)=>{
                console.log(res.data)
            })
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getBlogId()
    },[profileId])

    useEffect(()=>{
        if(category && ready){
            dispatch(setblogfilter(category))
        }
    },[category,ready])

    const confirmLog = (blogId)=>{
        try{
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "gray",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                console.log(result,'test')
                if (result.isConfirmed) {
                    deleteBlogFunction(blogId)
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your blog has been deleted.",
                    icon: "success"
                  });
                }
              });
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='mt-40 bg-transparent grid pb-3 px-4 w-full mx-auto sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%]'>
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
                    blogFilter.length > 0? blogFilter.map((blog, index)=>{
                        return (
                            <div key={index || blog.blogId} className='grid gap-2 sm:grid-cols-[auto_0.15fr]'>
                                <BlogCard blogData={blog} type={'home'}/>
                                <div className='bg-white shadow-md grid p-2 rounded-md'>
                                    <div className='mx-auto gap-2 flex sm:justify-around sm:flex-col'>
                                        <Link to={`/edit-blog/${blog.blogId}`}>
                                            <button className='bg-green-700 text-sm text-white p-1 px-2 rounded-md duration-200 hover:bg-green-400 hover:text-gray-700'>
                                                <CreateIcon/>
                                            </button>
                                        </Link>
                                        <button onClick={()=>confirmLog(blog.blogId)} className='bg-red-700 text-sm text-white p-1 px-2 rounded-md duration-200 hover:bg-red-400 hover:text-gray-700'>
                                            <DeleteForeverIcon/>
                                        </button>
                                    </div>
                                </div>
                                <hr className='border-[2px] border-gray-300 w-[70%] mx-auto rounded-md my-3 shadow-md'/>
                            </div>
                        )
                    }) : <h2 className='text-center mt-10 text-lg text-gray-600'>Blog not found.</h2>
                }
            </div>
        </div>
    </div>
  )
}

export default GetblogUpdate