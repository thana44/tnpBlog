import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Navmenu from './Navmenu';
import { useDispatch, useSelector } from 'react-redux';
import { isOpenMenu } from '../redux/reduxSlice/menuSlice';
import { useEffect } from 'react'
import axios from 'axios'
import { getCurrentUser } from '../redux/reduxSlice/userSlice'

function Nav() {
    const dispatch = useDispatch()
    const crrUser = useSelector((state)=> state.user.currentUser)
    // console.log(crrUser)
    const location = useLocation()

    const openMenu = ()=>{
        dispatch(isOpenMenu())
    }

    const getCurrUser = async()=>{
        try{
            await axios.get(`${import.meta.env.VITE_BACKENDHOST}/login-success`,{withCredentials: true})
            .then((currUser)=>{
              dispatch(getCurrentUser(currUser.data))
            })
        }catch(err){
            console.log(err)
        }
    }
  useEffect(()=>{
    getCurrUser()
  },[location.pathname])

  return (
    <div className=' bg-transparent fixed top-0 backdrop-blur-lg w-full z-10  h-24 flex justify-center items-end'>
        <nav className='bg-white shadow-lg relative mb-2 rounded-3xl h-16 w-11/12 flex justify-between py-1.5 px-4 sm:w-9/12'>
            <div className='flex justify-center items-center'>
                <Link to={'/'}><img className='w-10' src='https://images.vexels.com/content/137707/preview/geometric-logo-triangle-polygonal-25f671.png'/></Link>
            </div>
            <div className='relative'>
                <ul className='flex items-center gap-2 sm:gap-5 h-full'>
                    <Link to={'/search'}><li className='hover:scale-110 text-xl bg-slate-100 w-7 h-7 rounded-full flex justify-center items-center duration-200'><Search/></li></Link>
                    <Link to={'/create-newblog'}><li className='hover:scale-110 text-xl bg-slate-100 w-7 h-7 rounded-full flex justify-center items-center duration-200'><AddIcon /></li></Link>
                    {
                        crrUser.userId
                        ?
                        <div onClick={openMenu} className='hover:scale-110 text-xl bg-slate-100 w-7 h-7 rounded-full flex justify-center overflow-hidden items-center duration-200'>
                            <img src={crrUser.profileImg}/>
                        </div>
                        :
                        <Link to={'/login'}><li className='hover:scale-110 text-xl bg-slate-100 w-7 h-7 rounded-full flex justify-center items-center duration-200'><PermIdentityIcon /></li></Link>
                    }
                </ul>
            </div>
            <Navmenu/>
        </nav>
    </div>
  )
}

export default Nav