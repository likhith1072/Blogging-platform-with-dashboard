import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData,setFormData]=useState({});
  const [errorMessage,setErrorMessage]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleChange =(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };
  
  const handleSubmit =async (e)=>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields.');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch('http://localhost:3000/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':
          'application/json',
        },
        credentials: 'include', 
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success== false){
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/signin');
      }
    } catch(error){
      setErrorMessage(error.message);
      setLoading(false);
    }

  }

  return (
    <div className='min-h-screen mt-20'>
      <div className=' flex p-3 max-w-6xl mx-auto flex-col md:flex-row gap-5 md:gap-40'>
        {/* left */}
        <div className='flex-1'>
          <Link to="/" className='font-bold text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white'>Fusion </span>
             Blog
          </Link>
          <p className='text-sm mt-5'>This is a project.You can sign up with your email and password or with Google</p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
            <div className='flex flex-col'>
              <label htmlFor="username">Your username</label>
              <input type="text" placeholder='Username' id='username'  onChange={handleChange} className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="email">Your Email</label>
              <input type="email" placeholder='Email' id='email' onChange={handleChange}  className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <div className='flex flex-col'>
              <label htmlFor="password">Your Password</label>
              <input type="password" placeholder='Password' id='password'  onChange={handleChange} className='border-1 w-70 h-8 bg-gray-100 rounded-sm px-2'/>
            </div>
            <div className='pl-25'>
              <button type='submit' className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-sm text-white w-20 h-8 cursor-pointer hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 ' disabled={loading}>
                {loading ? (<>
                <span className='pl-3'>Loading...</span></>):('Sign Up')}
              </button>
            </div>
            <OAuth />
          </form>
          <div className='mt-3 flex gap-2 pl-13'>
            <span>Have an account?</span>
            <Link to ='/signin' className='text-blue-500 hover:text-blue-700'>Sign In</Link>
            </div>
            {errorMessage && <div className='text-red-500  bg-red-100 flex justify-center items-center rounded-md w-70 mt-2 p-2'>{errorMessage}</div>}
        </div>
      </div>
    </div>
  )
}
