import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../redux/reduxSlice/userSlice'
import { LoadingButton } from '@mui/lab';

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
 

    const dispatch = useDispatch()

  const loginFunction = async()=>{
    setIsLoading(true)
    try{
      await axios.post(`${import.meta.env.VITE_BACKENDHOST}/blog-api/login`,{email, password}, {withCredentials:true})
      .then(async(result)=>{
        const {message} = result.data
        toast.success(message)
        await axios.get(`${import.meta.env.VITE_BACKENDHOST}/login-success`,{withCredentials: true})
        .then((currUser)=>{
          dispatch(getCurrentUser(currUser.data))
        })
        setTimeout(()=>{
            return navigate('/')
        },1500)
      })
    }catch(err){
      const {status} = err.response
      const {message} = err.response.data
      if(status === 400){
          return toast.warning(message)
      }
      return toast.error(message)
    }finally{
      setTimeout(()=>{
        setIsLoading(false)
      },1000)
    }
  }

  const google = async()=>{
    window.open(`${import.meta.env.VITE_BACKENDHOST}/auth/google`, "_self")
  }


  return (
    <div className='mt-40 bg-transparent justify-center flex pb-3 px-4 sm:px-16 md:px-20'>
      <Toaster richColors/>
       <div className='bg-white shadow-md py-5 px-8 rounded-md duration-200 flex flex-col w-full justify-center md:w-9/12 lg:w-3/6 xl:w-2/5 2xl:w-1/3'>
          <div className='grid place-items-center justify-center gap-3'>
            <img className='w-10' src='https://images.vexels.com/content/137707/preview/geometric-logo-triangle-polygonal-25f671.png'/>
            <h2>Sign in to tnpBLOG</h2>
          </div>
          <form className='bg-transparent grid gap-5 mt-7'>
              <TextField onChange={(e)=> setEmail(e.target.value)} color='#404040' id="email" label="Email" variant="outlined" />
              <FormControl color='#404040' variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  onChange={(e)=> setPassword(e.target.value)}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
            </FormControl>
            <LoadingButton loading={isLoading} onClick={loginFunction} color='#404040' sx={{color:'#404040',borderBlockColor:'#404040',paddingBlock:'12px',textTransform:'none'}} variant="outlined">Sign in</LoadingButton>
          </form>
          <div className='bg-transparent h-5 border-gray-500 border-b-2 mt-4 relative flex justify-center items-center'>
            <span className='absolute h-full flex justify-center items-center bg-white px-3 bottom-[-50%]'>OR</span>
          </div>
          <div className='bg-transparent flex justify-center items-center mt-8'>
            <Button onClick={google} sx={{paddingBlock:'10px',backgroundColor:'#404040',textTransform:'none'}}
            fullWidth 
            variant="contained">
              <img className='w-8 h-8 object-cover' src='https://imgs.search.brave.com/cMeR-TEzSzc3L_T_t4c0ZKSZu5B4BxkMPGrZ48urikE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvZ29vZ2xlLXMt/bG9nby8xNTAvR29v/Z2xlX0ljb25zLTA5/LTUxMi5wbmc'/>
              Sign in with Google
            </Button>
          </div>
          <div className='mt-7 text-center'>
            <span>Don't have an account? <Link className='text-blue-700 underline' to={'/register'}>Sign up now</Link></span>
          </div>
       </div>
    </div>
  )
}

export default Login