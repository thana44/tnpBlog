import React, { useEffect, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { FaRegComment } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { isOpenComment } from "../redux/reduxSlice/commentSlice";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { likeBlog, unlikeBlog } from "../redux/reduxSlice/blogSlice";
import { clearUser } from "../redux/reduxSlice/userSlice";
import { Skeleton } from '@mui/material';

function Postedby({blog, isLoading}) {
  const {userId, username, profileImg, blogPosted, likeTotal, commentTotal} = blog
  const dispatch = useDispatch()
  const [timeAgo, setTimeAgo] = useState()
  const {currentUser} = useSelector((state)=> state.user)
  const {blogId} = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(blogPosted){
      const date = new Date(blogPosted)
      date.setHours(date.getHours())
      setTimeAgo(formatDistanceToNow(date, { addSuffix: true }))
    }
  },[blogPosted])


  const commentOpen = ()=>{
    try{
      if(!currentUser?.userId){
        return navigate('/login')
      }
      dispatch(isOpenComment())
    }catch(err){
      console.log(err)
    }
  }

  const likeFunction = async()=>{
    try{
      dispatch(likeBlog({id:currentUser?.userId, type: 'read'}))
      await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/blogLike/${blogId}`,{}, {withCredentials:true})
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
      dispatch(unlikeBlog({id:currentUser?.userId, type: 'read'}))
      await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/blogUnLike/${blogId}`,{}, {withCredentials:true})
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
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {
              !profileImg || isLoading?
              <Skeleton animation={"wave"} variant="circular" width={40} height={40}/>
              :
              <img
                className="w-10 h-10 rounded-full"
                src={profileImg}
              />
          }
          {
              !username || isLoading?
              <Skeleton animation={"wave"} variant="rounded" width={100} />
              :
            <span>@{username}</span>
          }
        </div>
        <div>
          {
              !timeAgo || isLoading?
              <Skeleton animation={"wave"} variant="rounded" width={130} />
              :
            <span>&bull; {timeAgo}</span>
          }
        </div>
      </div>
      {
          isLoading?
          <Skeleton animation={"wave"} variant="rounded" width={130} />
          :
        <div className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            {
              likeTotal?.includes(currentUser?.userId)?
              <div onClick={unlikeFunction} className="duration-200 hover:scale-105 text-2xl bg-blue-200 w-7 h-7 rounded-full flex justify-center items-center">
                    <FavoriteIcon className='text-red-700'/>
              </div>
              :
              <div onClick={likeFunction} className="duration-200 hover:scale-105 text-2xl bg-blue-200 w-7 h-7 rounded-full flex justify-center items-center">
                    <FavoriteBorderIcon />
              </div>
            }

            <span>{likeTotal?.length}</span>
          </div>
          <div onClick={commentOpen} className="flex gap-2 items-center">
            <div className="duration-200 hover:scale-105 text-xl bg-blue-200 w-7 h-7 rounded-full flex justify-center items-center">
              <FaRegComment />
            </div>
            <span>{commentTotal}</span>
          </div>
        </div>
      }
    </div>
  );
}

export default Postedby;
