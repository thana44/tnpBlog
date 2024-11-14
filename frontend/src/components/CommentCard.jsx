import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { format, formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, unlikeComment } from '../redux/reduxSlice/commentSlice';
import { clearUser } from '../redux/reduxSlice/userSlice';
import { useNavigate } from 'react-router-dom';

function CommentCard({commentData}) {
    console.log(commentData, 'this is comment data')
    const date = new Date(commentData?.dateComment)
    date.setHours(date.getHours() + 7)
    const posted = formatDistanceToNow(date, { addSuffix: true })
    const {currentUser} = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const likeCommentFuction = async()=>{
        try{
            dispatch(likeComment({userId: currentUser?.userId, commentId: commentData?.commentId}))
            await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/commentLike/${commentData?.commentId}`, {}, {withCredentials: true})
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
    const unlikeCommentFuction = async()=>{
        try{
            dispatch(unlikeComment({userId: currentUser?.userId, commentId: commentData?.commentId}))
            await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/commentUnLike/${commentData?.commentId}`, {}, {withCredentials: true})
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
    <div className='flex my-3'>
        <div className='bg-transparent w-[500px] max-w-[40px]'>
            <img className='w-8 rounded-full' src={commentData?.profileImg}/>
        </div>
        <div className=''>
            <div className='flex gap-2 text-sm text-gray-700'>
                <span className='bg-transparent max-w-[150px] overflow-hidden text-ellipsis'>@{commentData?.username}</span>
                <span>&bull; {posted}</span>
            </div>
            <div>
                <p>
                    {commentData?.comment}
                </p>
            </div>
            <div className='mt-2 flex items-center gap-1'>
                {
                    commentData?.likeCommentTotal?.includes(currentUser?.userId)?
                    <button onClick={unlikeCommentFuction} className='text-xl text-red-700 duration-200 hover:scale-105'>
                        <FavoriteIcon/>
                    </button>
                    :
                    <button onClick={likeCommentFuction} className='text-xl duration-200 hover:scale-105'>
                        <FavoriteBorderIcon/>
                    </button>
                }
                <span className='text-sm text-gray-800'>{commentData?.likeCommentTotal?.length}</span>
            </div>
        </div>
    </div>
  )
}

export default CommentCard