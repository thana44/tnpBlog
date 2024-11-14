import React from 'react'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FaceIcon from '@mui/icons-material/Face';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import OutputIcon from '@mui/icons-material/Output';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isOpenMenu } from '../redux/reduxSlice/menuSlice';

function Navmenu() {
    const crrUser = useSelector((state)=> state.user.currentUser)
    const {isOpenMenuTab} = useSelector((state)=> state.menu)
    const dispatch = useDispatch()

    const closeMenu = ()=>{
        dispatch(isOpenMenu())
    }

    const logout = ()=>{
        window.open(`${import.meta.env.VITE_BACKENDHOST}/logout`, "_self")
        dispatch(isOpenMenu())
    }

  return (
    <div className={'bg-white shadow-2xl rounded-b-md absolute duration-200 mt-16 w-[50%] right-0 sm:w-[30%] ' + (isOpenMenuTab? 'block': 'hidden')}>
        <ul className='py-2 grid'>
            <Link onClick={closeMenu} to={`/profile/${crrUser?.userId}`}>
                <div className='hover:bg-gray-100 duration-200 text-sm md:text-base grid items-center gap-3 p-2' style={{gridTemplateColumns:'0.2fr 1.8fr'}}>
                    <FaceIcon/>
                    <li className=''>My Profile</li>
                </div>
            </Link>
            <Link onClick={closeMenu} to={`/edit-profile/${crrUser?.userId}`}>
                <div className='hover:bg-gray-100 duration-200 text-sm md:text-base grid items-center gap-3 p-2' style={{gridTemplateColumns:'0.2fr 1.8fr'}}>
                    <ManageAccountsIcon/>
                    <li className=''>Edit Profile</li>
                </div>
            </Link>
            <Link onClick={closeMenu} to={`/get-blog-update/${crrUser?.userId}`}>
                <div className='hover:bg-gray-100 duration-200 text-sm md:text-base grid items-center gap-3 p-2' style={{gridTemplateColumns:'0.2fr 1.8fr'}}>
                    <FormatShapesIcon/>
                    <li className=''>Edit Blogs</li>
                </div>
            </Link>
            <div onClick={logout} className='hover:bg-gray-100 duration-200 text-sm md:text-base border-gray-300 border-t-2 grid items-center gap-3 p-2' style={{gridTemplateColumns:'0.2fr 1.8fr'}}>
                <OutputIcon/>
                <li className=''>Logout</li>
            </div>
        </ul>
    </div>
  )
}

export default Navmenu