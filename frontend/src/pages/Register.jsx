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
import axios from "axios";
import { LoadingButton } from '@mui/lab';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickshowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword]= useState()
  const [confirmPass, setConfirmPass] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const registerFunction = async()=>{
    setIsLoading(true)
    try{
      await axios.post(`${import.meta.env.VITE_BACKENDHOST}/blog-api/register`,{username, email, password, confirmPass})
      .then((data)=>{
          const {message} = data.data
          if(data.status === 201){
            toast.success(message)
            setTimeout(()=>{
              return navigate('/login')
            },1000)
          }
      })
    }catch(err){
      const {message} = err.response.data
      return toast.warning(message)
    }finally{
      setTimeout(()=>{
        setIsLoading(false)
      },1000)
    }
  }

  return (
    <div className='mt-40 bg-transparent justify-center flex pb-3 px-4 sm:px-16 md:px-20'>
       <div className='bg-white shadow-md py-5 px-8 rounded-md duration-200 flex flex-col w-full justify-center md:w-9/12 lg:w-3/6 xl:w-2/5 2xl:w-1/3'>
        <Toaster richColors />
          <div className='grid place-items-center justify-center gap-3'>
            <img className='w-10' src='https://images.vexels.com/content/137707/preview/geometric-logo-triangle-polygonal-25f671.png'/>
            <h2>Create your account and get started.</h2>
          </div>
          <form className='bg-transparent grid gap-5 mt-7'>
              <TextField onChange={(e)=> setUsername(e.target.value)} color='#404040' id="username" label="Username" variant="outlined" />
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
              <FormControl color='#404040' variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                  onChange={(e)=> setConfirmPass(e.target.value)}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickshowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
            </FormControl>
            <LoadingButton loading={isLoading} onClick={registerFunction} color='#404040' sx={{color:'#404040',borderBlockColor:'#404040',paddingBlock:'12px',textTransform:'none'}} variant="outlined">Sign up</LoadingButton>
          </form>
          <div className='mt-7 text-center'>
            <span>Already have an account? <Link className='text-blue-700 underline' to={'/login'}>Sign in</Link></span>
          </div>
       </div>
    </div>
  )
}

export default Register