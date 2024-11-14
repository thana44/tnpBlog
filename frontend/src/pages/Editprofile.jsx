import { Button, TextField } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useEffect, useState } from 'react'
import AvatarEdit from '../components/AvatarEdit';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { isOpenAvatarEdit } from '../redux/reduxSlice/menuSlice';
import { toast, Toaster } from 'sonner';
import { LoadingButton } from '@mui/lab';

function Editprofile() {
  const {isOpenAvatarEditTab} = useSelector((state)=> state.menu)
  const dispatch = useDispatch()
  const {profileId} = useParams()
  const navigate = useNavigate()

  const [image, setImage] = useState('')
  const [newImage, setNewImage] = useState('')
  const [username, setUsername] = useState('')
  const [discription, setDiscription] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [facebookLink, setFacebookLink] = useState('')
  const [otherLink, setOtherLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getProUpdate = async()=>{
    try{
      await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getProfileUpdate/${profileId}`,{withCredentials: true})
      .then((res)=>{
        const {profileImg, username, discription, instagramLink, facebookLink, otherLink} = res.data[0]
        setImage(profileImg)
        setUsername(username)
        setDiscription(discription)
        setInstagramLink(instagramLink)
        setFacebookLink(facebookLink)
        setOtherLink(otherLink)
      })
    }catch(err){
      const {status} = err.response
      if(status === 404){
        return navigate('/')
      }
      console.log(err)
    }
  }

  useEffect(()=>{
    getProUpdate()
  },[])

  const Open = ()=>{
    dispatch(isOpenAvatarEdit())
  }

  const updateFunction = async()=>{
    setIsLoading(true)
    try{
      await axios.put(`${import.meta.env.VITE_BACKENDHOST}/blog-api/updateProfile/${profileId}`, {newImage, username, discription, instagramLink, facebookLink, otherLink}, {withCredentials: true})
      .then((res)=>{
        const {message} = res.data
        toast.success(message)
        setTimeout(()=>{
          return navigate(`/profile/${profileId}`)
        },1000)
      })
    }catch(err){
      console.log(err)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='mt-40 bg-transparent flex pb-3 px-4 sm:px-16 md:px-20'>
      {
        isOpenAvatarEditTab && <AvatarEdit onImageChange={(e)=> setNewImage(e)}/>
      }
      <Toaster richColors/>
      <div className='bg-white w-full lg:w-[70%] lg:mx-auto shadow-md grid p-4 sm:p-8 pb-10 pt-4 rounded-md gap-4 duration-200'>
          <div className='flex justify-between items-center'>
              <h2 className='text-lg font-bold'>Edit Profile</h2>
              <div>
              <LoadingButton loading={isLoading} onClick={updateFunction} sx={{backgroundColor: '#404040'}} variant="contained">
                <CheckIcon />
              </LoadingButton>
              </div>
          </div>
          <div className='bg-white grid gap-8 sm:grid-cols-[0.8fr_1.2fr]'>
              <div className='flex justify-center items-center'>
                <div className='bg-white relative'>
                  <img className='w-24 sm:w-28 md:w-32 rounded-full object-cover' src={newImage? newImage : image}/>
                  <div className='absolute bottom-[-10px] right-0 left-0 flex justify-center'>
                        <div onClick={Open} className='bg-[#404040] rounded-full w-9 h-9 flex items-center justify-center duration-200 hover:scale-[0.95]'>
                          <CropOriginalIcon sx={{color:'white', width:'19px'}} />
                        </div>
                  </div>
                </div>
              </div>
              <div className='bg-white grid gap-5'>
                <TextField onChange={(e)=> setUsername(e.target.value)} value={username || ""} slotProps={{input: {startAdornment:<AssignmentIndIcon sx={{marginRight:'10px'}}/>}}}  fullWidth color='#404040' id="username" label="Username" variant="outlined" />
                <TextField onChange={(e)=> setDiscription(e.target.value)} value={discription || ""} slotProps={{input: {startAdornment:<BorderColorIcon sx={{marginRight:'10px'}}/>}}} fullWidth multiline maxRows={2} color='#404040' id="discription" label="Description" variant="outlined" />
                <TextField onChange={(e)=> setInstagramLink(e.target.value)} value={instagramLink || ""} slotProps={{input: {startAdornment:<InstagramIcon sx={{marginRight:'10px'}}/>}}} fullWidth multiline color='#404040' id="ig-link" label="Instagram Link" variant="outlined" />
                <TextField onChange={(e)=> setFacebookLink(e.target.value)} value={facebookLink || ""} slotProps={{input: {startAdornment:<FacebookIcon sx={{marginRight:'10px'}}/>}}} fullWidth multiline color='#404040' id="facebook-link" label="Facebook Link" variant="outlined" />
                <TextField onChange={(e)=> setOtherLink(e.target.value)} value={otherLink || ""} slotProps={{input: {startAdornment:<AttachFileIcon sx={{marginRight:'10px'}}/>}}} fullWidth multiline color='#404040' id="other-links" label="Other Links" variant="outlined" />
              </div>
          </div>
      </div>
    </div>
  )
}

export default Editprofile