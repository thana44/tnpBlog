import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import CommentCard from './CommentCard';
import { useDispatch, useSelector } from 'react-redux';
import { addNewComment, getAllComment, isOpenComment } from '../redux/reduxSlice/commentSlice';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {toast, Toaster} from 'sonner'
import { plusCommentTotal } from '../redux/reduxSlice/blogSlice';
import { clearUser } from '../redux/reduxSlice/userSlice';

function Commentcon() {
    const open = useSelector((state)=> state.comment.isOpenTab)
    const {allComment} = useSelector((state)=> state.comment)
    const {currentUser} = useSelector((state)=> state.user)
    const dispatch = useDispatch()
    const {blogId} = useParams()
    const [comment, setComment] = useState('')
    const navigate = useNavigate()

    // console.log(comment, 'test id blog')

    const closeComment = ()=>{
      try{
        dispatch(isOpenComment())
      }catch(err){
        console.log(err)
      }
    }

    const getCommentFunction = async()=>{
      try{
        await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getComment?blogId=${blogId}`,{withCredentials: true})
        .then((res)=>{
          dispatch(getAllComment(res.data))
        })
      }catch(err){
        console.log(err)
      }
    }

    useEffect(()=>{
      getCommentFunction()
    },[blogId])

    // console.log(allComment, 'test')

    const addCommentFunction = async()=>{
      try{
        setComment('')
        await axios.post(`${import.meta.env.VITE_BACKENDHOST}/blog-api/addComment?blogId=${blogId}`,{comment}, {withCredentials: true})
        .then((res)=>{
          console.log(res.data)
          dispatch(addNewComment(res.data[0]))
          dispatch(plusCommentTotal())
          toast.success("Sucessfully added comment.")
        })
      }catch(err){
        const {message} = err.response?.data
        toast.warning(message)
        const {status} = err.response
        if(status === 401){
          setTimeout(()=>{
            dispatch(clearUser())
            return navigate('/login')
          },1000)
        }
      }
    }

  return (
    <div className={'bg-white w-full fixed '+(open? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]')+' h-full duration-700 right-0 sm:top-0 sm:w-[30%] min-w-[350px] z-50 shadow-2xl overflow-y-auto overflow-x-hidden'}>
      <Toaster className='sm:hidden' richColors position='top-center'/>
      <Toaster className='hidden sm:block' richColors position='bottom-left'/>
        <div className='bg-transparent h-full p-3 overflow-y-auto'>
          <div className='border-b-2 border-slate-800 pb-2 flex justify-between'>
            <h2 className='text-lg font-bold'>Comments | {allComment?.length}</h2>
            <button onClick={closeComment} className='bg-gray-100 flex justify-center items-center w-7 h-7 rounded-full duration-150 hover:scale-105 hover:opacity-80'>
              <CloseIcon/>
            </button>
          </div>
          <div className='bg-transparent mb-[100px]'>
            {
              allComment && allComment?.length !== 0? allComment.map((comment)=>{
                return (
                    <CommentCard key={comment.commentId} commentData={comment}/>
                )
              }) : <h2 className='text-center mt-10 text-lg text-gray-600'>No comment.</h2>
            }
          </div>
        </div>
        <div className='bg-gray-100 w-full min-h-16 absolute bottom-0 flex justify-center items-center gap-3 p-3'>
          <div>
            <img className='w-14 object-cover rounded-full' src={currentUser?.profileImg}/>
          </div>
        <TextField
                    onChange={(e)=> setComment(e.target.value)}
                    value={comment || ''}
                    color='#404040'
                    fullWidth
                    id="outlined-multiline-flexible"
                    placeholder='add comment...'
                    multiline
                    maxRows={2}
           />
          <div>
            <button onClick={addCommentFunction} className='bg-slate-700 text-white p-3 rounded-lg duration-200 hover:bg-transparent hover:text-slate-700 border-gray-700 hover:border-[1px]'>Submit</button>
          </div>
        </div>
    </div>
  )
}

export default Commentcon