import React, { useRef, useState } from 'react'
import Editor from '../components/Editor'
import { Button, TextField } from '@mui/material'
import Selectcom from '../components/Selectcom'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/system';
import axios from "axios"
import { Toaster, toast } from 'sonner';
import {useNavigate} from 'react-router-dom'
import { LoadingButton } from '@mui/lab';

function Write() {
    const fileRef = useRef(null)

      const [content, setContent] = useState()
      const [blogImage, setBlogImage] = useState()
      const [category, setCategory] = useState()
      const [heading, setHeading] = useState()
      const [description, setDescription] = useState()
      const [isLoading, setIsLoading] = useState(false)

      const navigate = useNavigate()

      const setFiletoBase = async(file)=>{
        try{
            if(file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg"){
                return toast.error('Upload only images.')
            }
            if(file.size > 5000000){
                return toast.error("File is too big!")
            }
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = ()=>{
                setBlogImage(reader.result)
            }
        }catch(err){
            console.log(err)
        }
      }

      const handleSelectChange = (value) => {
        setCategory(value); // อัปเดตค่าที่ได้รับจากลูก
      };

    //   console.log(blogImage)

      const createBlogFunction = async()=>{
        setIsLoading(true)
        try{
            await axios.post(`${import.meta.env.VITE_BACKENDHOST}/blog-api/createBlog`, {blogImage, heading, description, category, content}, {withCredentials: true})
            .then((res)=>{
                const {message} = res.data
                toast.success(message)
                setTimeout(()=>{
                    return navigate('/')
                },1500)
            })
        }catch(err){
            console.log(err)
            const {status} = err.response
            const {message} = err.response.data
            if(status === 413){
                return toast.error("The file size is too large.")
            }
            if(status === 400){
                return toast.warning(message)
            }
            if(status === 401){
                toast.warning("Please login to create a post.")
                setTimeout(() =>{
                    return navigate('/login')
                },2000)
            }
        }finally{
            setIsLoading(false)
        }
      }

  return (
    <div className='mt-40 bg-transparent pb-3 px-4 sm:px-16 md:px-20'>
        <Toaster richColors/>
        <div className='flex flex-col justify-center items-center gap-5 bg-transparent'>
            <div className='w-full lg:w-9/12'>
                <h2 className='text-xl font-bold mb-2'>Write your post</h2>
            </div>
            <div className='w-full lg:w-9/12 bg-transparent'>
                <TextField
                    onChange={(e)=> setHeading(e.target.value)}
                    color='#404040'
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Blog Heading"
                    multiline
                    maxRows={4}
                />
            </div>
            <div className='bg-transparent mb-5 grid gap-2 w-full sm:grid-cols-70-30 lg:w-9/12'>
                <TextField
                    onChange={(e)=> setDescription(e.target.value)}
                    color='#404040'
                    id="outlined-multiline-flexible"
                    label="A short description"
                    multiline
                    maxRows={2}
                />
                <div className='flex items-center gap-2 justify-between bg-transparent'>
                    <div className='flex sm:ml-2'>
                        <input onChange={(e)=> setFiletoBase(e.target.files[0])} type='file' accept='image/*' hidden ref={fileRef}/>
                        <Button onClick={()=> fileRef.current.click()} sx={{color: '#404040'}}>
                            <AddPhotoAlternateIcon/>
                        </Button>
                    </div>
                    <Selectcom onSelectChange={handleSelectChange}/>
                </div>
            </div>
            {
                blogImage && (
                    <div className='w-full lg:w-9/12 bg-white p-5 relative shadow-md'>
                        <div onClick={()=> setBlogImage('')} className='absolute px-2 py-1 right-0 top-0 duration-200 bg-red-700 text-white  hover:bg-red-500 hover:cursor-pointer'>X</div>
                        <img className='w-full' src={blogImage}/>
                    </div>
                )
            }
            <div className='bg-transparent grid gap-5 w-full lg:w-9/12'>
                <h2 className='text-lg font-bold'>Write your post content</h2>
                <div className='min-h-72 grid mb-12'>
                    <Editor value={content} onChange={setContent}/>
                </div>
                <LoadingButton loading={isLoading} sx={{color:'white', backgroundColor:'#404040'}} onClick={createBlogFunction} variant="contained">
                    Create
                </LoadingButton>
            </div>
        </div>
    </div>
  )
}

export default Write