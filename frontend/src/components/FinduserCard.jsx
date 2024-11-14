import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function FinduserCard({userCardData}) {

  const [userForm, setUserForm] = useState({
    userId: '',
    profileImg: '',
    username: '',
    blogCount: '',
    viewCount: ''
  })

  useEffect(()=>{
    if(userCardData){
      const {userId, profileImg, username, blogCount, viewCount} = userCardData
      setUserForm(()=>({
        userId,
        profileImg,
        username,
        blogCount,
        viewCount
      }))
    }
  },[userCardData])

  // console.log(userCardData,'test')
  
  return (
    <Link to={`/profile/${userForm?.userId}`}>
            <div className='bg-white shadow-md flex items-center justify-between p-2 hover:scale-[1.01] rounded-md duration-200'>
                <div className='flex items-center gap-2'>
                    <img className='w-10 h-10 rounded-full' src={userForm?.profileImg}/>
                    <div className='flex flex-col w-full justify-between xl:flex-row'>
                        <span className='w-32 overflow-hidden text-ellipsis'>@{userForm?.username}</span>
                    </div>
                </div>
                <div>
                    <span>{userForm?.blogCount} Blogs | {userForm?.viewCount} Reads</span>
                </div>
            </div>
    </Link>
  )
}

export default FinduserCard