import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Searchbox from '../components/Searchbox'
import BlogCard from '../components/BlogCard'
import FinduserCard from '../components/FinduserCard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getblogRecom } from '../redux/reduxSlice/blogSlice'
import SkeletonBlogCard from '../components/SkeletonBlogCard'
import SkeletonUserCard from '../components/SkeletonUserCard'

function Search() {

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [radioType, setRadioType] = useState('')
  const dispatch = useDispatch()
  const {blogRecom} = useSelector((state)=> state.blog)
  const [ready, setReady] = useState(false)
  const [isLoading ,setIsLoading] = useState(false)

  const searchFunction = async()=>{
    setIsLoading(true)
    try{
      await axios.get(`${import.meta.env.VITE_BACKENDHOST}/blog-api/search?radioType=${radioType}&search=${search}&category=${category}`,{withCredentials: true})
      .then((res)=>{
        console.log(res.data)
        dispatch(getblogRecom(res.data))
        setReady(true)
      })
    }catch(err){
      console.log(err)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    searchFunction()
    setReady(false)
  },[radioType, search, category])


  return (
    <div className='bg-transparent mt-40 pb-3 px-4 sm:px-16 md:px-20 lg:grid lg:place-items-center'>
        <div className='bg-transparent w-full grid mb-4 lg:w-9/12'>
            <Searchbox 
            searchOnchange={(e)=> setSearch(e)} 
            categoryOnchange={(e)=> setCategory(e)} 
            radioOnchange={(e)=> setRadioType(e)}/>
        </div>
        <div className='flex gap-3 bg-transparent w-full lg:w-9/12'>
            {
              search && <h3 className='font-bold'>Search <div className='text-blue-600 inline'>{search}</div></h3>
            }
           {
            category && radioType === 'blogs' &&  <h3 className='font-bold'>&bull; Categories <div className='text-yellow-600 inline'>{category}</div></h3>
           }
        </div>
        {
          isLoading && radioType === "blogs"? <div className='grid gap-2 mt-10 bg-transparent w-full lg:w-9/12'>
            <SkeletonBlogCard/>
            <SkeletonBlogCard/>
            <SkeletonBlogCard/>
          </div>
          :
          radioType === 'blogs' && ready && (
            <div className='grid gap-2 mt-10 bg-transparent w-full lg:w-9/12'>
            {
                blogRecom && blogRecom.length !== 0? blogRecom.map((blog,index)=>{
                    return (
                        <BlogCard key={index} blogData={blog} type={'recom'}/>
                    )
                }) : !search || search.length === 0? <h2 className='text-center mt-10 text-lg text-gray-600'>Please type your search term.</h2> :<h2 className='text-center mt-10 text-lg text-gray-600'>Blog not found.</h2>
            }
          </div>
          )
        }
        {
          isLoading && radioType === "users"? <div className='grid gap-2 mt-10 bg-transparent w-full lg:w-9/12'>
            <SkeletonUserCard/>
            <SkeletonUserCard/>
            <SkeletonUserCard/>
          </div>
          :
          radioType === 'users' && ready && (
            <div className='grid gap-2 mt-10 bg-transparent w-full lg:w-9/12'>
            {
                blogRecom && blogRecom.length !== 0? blogRecom.map((user, index)=>{
                    return (
                        <FinduserCard key={index} userCardData={user}/>
                    )
                }) : !search || search.length === 0? <h2 className='text-center mt-10 text-lg text-gray-600'>Please type your search term.</h2> :<h2 className='text-center mt-10 text-lg text-gray-600'>User not found.</h2>
            }
          </div>
          )
        }
    </div>
  )
}

export default Search