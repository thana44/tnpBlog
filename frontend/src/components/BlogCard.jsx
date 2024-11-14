import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { likeBlog, unlikeBlog } from '../redux/reduxSlice/blogSlice';
import { clearUser } from '../redux/reduxSlice/userSlice';

function BlogCard({blogData, type}) {
    const {currentUser} = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    const [posted, setPosted] = useState()
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(blogData?.blogPosted){
            const date = new Date(blogData?.blogPosted)
            date.setHours(date.getHours())
            setPosted(formatDistanceToNow(date, { addSuffix: true }))
        }
    },[blogData])
    

    const likeFunction = async()=>{
        try{
            dispatch(likeBlog({id: currentUser.userId, bId: blogData.blogId, type: type}))
            await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/blogLike/${blogData?.blogId}`,{}, {withCredentials:true})
            .then((res)=>{
                console.log(res.data)
            })
        }catch(err){
            const {status} = err.response
            if(status === 401){
                dispatch(clearUser())
                return navigate('/login')
            }
        }
    }
    const unlikeFunction = async()=>{
        try{
            dispatch(unlikeBlog({id: currentUser.userId, bId: blogData.blogId, type: type}))
            await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/blogUnLike/${blogData?.blogId}`,{}, {withCredentials:true})
            .then((res)=>{
                console.log(res.data)
            })
        }catch(err){
            const {status} = err.response
            if(status === 401){
                dispatch(clearUser())
                return navigate('/login')
            }
        }
    }


  return (
    <div className='bg-white shadow-md grid p-2 rounded-md duration-200 hover:scale-[1.01]' style={{gridTemplateColumns:'1.4fr 0.6fr'}}>
        <div className='bg-white grid'>
            <Link to={`/profile/${blogData?.userId}`}>
                <div className='flex gap-2 items-center'>
                    <img className='w-10 h-10 rounded-full' src={blogData?.profileImg}/>
                    <div className='flex flex-col w-full justify-between xl:flex-row'>
                        <span className='w-32 overflow-hidden text-ellipsis'>@{blogData?.username}</span>
                        <span>&bull; <div className='hidden sm:inline'>Posted</div> {posted}</span>
                    </div>
                </div>
            </Link>
            <Link to={`/r-blog/${blogData?.blogId}`}>
                <div className='mb-3'>
                    <h2 className='font-bold line-clamp-2 text-xl'>{blogData?.blogHead}</h2>
                    <span className='line-clamp-2'>{blogData?.blogDiscription}</span>
                </div>
            </Link>
            <div className='flex gap-2 items-center'>
                <div className='flex gap-1 items-center'>
                    {
                        blogData?.likeTotal?.includes(currentUser.userId)?
                        <div onClick={unlikeFunction}><FavoriteIcon className='text-2xl text-red-700 duration-200 hover:scale-105' /></div>
                        :
                        <div onClick={likeFunction}><FavoriteBorderIcon className='text-2xl duration-200 hover:scale-105' /></div>
                    }
                    <span>{blogData?.likeTotal?.length}</span>
                </div>
                <button className='bg-yellow-200 px-4 rounded-md duration-200 hover:scale-105'>{blogData?.blogCategory}</button>
            </div>
        </div>
        <div className='bg-white flex justify-center items-center'>
            <Link to={`/r-blog/${blogData?.blogId}`}>
                <img className='w-40 h-40 object-cover duration-200 hover:scale-105' src={blogData?.blogImg}/>
            </Link>
        </div>
    </div>
  )
}

export default BlogCard