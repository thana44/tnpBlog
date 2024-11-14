import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar-edit'
import CloseIcon from '@mui/icons-material/Close';
import {toast, Toaster} from "sonner"
import { useDispatch } from 'react-redux';
import { isOpenAvatarEdit } from '../redux/reduxSlice/menuSlice';

function AvatarEdit({onImageChange}) {
    const [preview, setPreview] = useState(null)
    const dispatch = useDispatch()
    
    const onBeforeFileLoad = (elem) =>{
        if(elem.target.files[0].type !== "image/png" && elem.target.files[0].type !== "image/jpeg" && elem.target.files[0].type !== "image/jpg"){
            elem.target.value = ""
            return toast.error('Upload only images.')
        }
        if(elem.target.files[0].size > 5000000){
            elem.target.value = ""
            return toast.error("File is too big!")
        }
    }

    const closeAvatarEdit = ()=>{
        dispatch(isOpenAvatarEdit())
    }

    const sendImg = ()=>{
        try{
            if(preview){
                onImageChange(preview)
                toast.success("Cropped image completed.")
                setTimeout(()=>{
                    return dispatch(isOpenAvatarEdit())
                },1000)
            }else{
                toast.warning("Please select an image. ")
            }
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='bg-[rgba(0,0,0,0.62)] backdrop-blur-sm flex justify-center items-center fixed z-30 w-full min-h-screen top-0 left-0'>
        <Toaster richColors/>
        <div className='bg-white shadow-md overflow-hidden relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[40%] flex flex-col justify-center items-center p-2 rounded-md duration-200'>
            <div className='flex justify-end w-full mb-4'>
                <div onClick={closeAvatarEdit} className='bg-gray-200 p-2 rounded-full h-7 w-7 flex justify-center items-center text-center duration-200 hover:scale-105 hover:bg-gray-400'>
                    <CloseIcon/>
                </div>
            </div>
            <Avatar
                width={300}
                height={300}
                onClose={()=> setPreview(null)}
                onCrop={(view)=> setPreview(view)}
                onBeforeFileLoad={onBeforeFileLoad}
                mimeTypes={'image/*'}
            />
            <div className='my-4'>
                <button onClick={sendImg} className='bg-green-500 p-2 duration-200 px-7 rounded-md text-white hover:bg-green-600'>Crop</button>
            </div>
        </div>
    </div>
  )
}

export default AvatarEdit