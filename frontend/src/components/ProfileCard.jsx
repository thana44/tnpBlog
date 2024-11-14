import React, { useEffect, useState } from 'react'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import {format} from 'date-fns';
import {enUS} from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

function ProfileCard({user_id}) {

    const [userProfile, setUserProfile] = useState([])
    const [joined, setJoined] = useState('')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const getProfile = async()=>{
        setIsLoading(true)
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/getProfile/${user_id}`,{withCredentials: true})
            .then((res)=>{
                setUserProfile(res.data[0])
                setJoined(
                    format(new Date(res.data[0].joined), "d MMMM yyyy",{
                        locale: enUS
                    })
                )
            })
        }catch(err){
            const {status} = err.response
            if(status === 404){
                return navigate('/')
            }
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        getProfile()
    },[user_id])


  return (
    <div className='bg-white shadow-md grid p-2 rounded-md duration-200'>
        <div className='bg-transparent flex items-center gap-2 flex-col justify-center my-3'>
            {
                isLoading?
                <Skeleton animation={"wave"} variant="circular" width={64} height={64}/>
                :
                <img className='w-16 h-16 object-cover rounded-full' src={userProfile?.profileImg}/>
            }
            {
                isLoading?
                <Skeleton animation={"wave"} variant="rounded" width={110} />
                :
                <span className='text-base font-bold'>@{userProfile?.username}</span>
            }
        </div>
        <div className='bg-transparent mb-3'>
            {
                isLoading?
                <Skeleton animation={"wave"} variant="rounded" width={130} />
                :
                <span>{userProfile?.blogCount} Blogs | {userProfile?.viewCount} Reads</span>
            }
        </div>
        <div className='bg-transparent grid gap-1'>
            {
                isLoading?
                <Skeleton animation={"wave"} variant="rounded" width={"100%"} height={30} />
                :
                <p>{userProfile?.discription}</p>
            }
            <div className='flex gap-2 items-center'>
                {
                    isLoading?
                    <Skeleton animation={"wave"} variant="rounded" width={130} />
                    :
                    <div>
                        {
                            userProfile?.instagramLink && <a target="_blank" href={userProfile?.instagramLink}><InstagramIcon/></a>
                        }
                        {
                            userProfile?.facebookLink && <a target="_blank" href={userProfile?.facebookLink}><FacebookIcon/></a>
                        }
                        {
                            userProfile?.otherLink && <a target="_blank" href={userProfile?.otherLink}><AttachFileIcon/></a>
                        }
                    </div>
                }
                
            </div>
            {
                isLoading?
                <Skeleton animation={"wave"} variant="rounded" width={"70%"} />
                :
                <span>Joined {joined}</span>
            }
        </div>
    </div>
  )
}

export default ProfileCard