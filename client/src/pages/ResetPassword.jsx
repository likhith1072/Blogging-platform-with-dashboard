import React from 'react'
import { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [email,setEmail]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [confirmNewPassword,setConfirmNewPassword]=useState('');
    const navigate=useNavigate();
    const inputRefs=React.useRef([]);
    const [isEmailSent,setIsEmailSent]=useState(false);
    const [isNewPasswordSubmitted,setIsNewPasswordSubmitted]=useState(false);
    const [loading,setLoading]=useState(false);

      useEffect(() => {
        if(inputRefs.current[0]){
            inputRefs.current[0].focus();
        }
      },[isEmailSent]);
      
    
      const handleInput=(e,index)=>{
        if(e.target.value.length > 0 && index < inputRefs.current.length-1){
            inputRefs.current[index+1].focus();  
        }
      }
    
      const handleKeyDown=(e,index)=>{
        if(e.key === 'Backspace' && e.target.value === '' && index > 0){
            inputRefs.current[index-1].focus();
        }
      }
    
      const handlePaste =(e)=>{
        const paste=e.clipboardData.getData('text');
        const pasteArray =paste.split('');
        pasteArray.forEach((item,index)=>{
            if(inputRefs.current[index]){
                inputRefs.current[index].value=item;
            }
        })
      }
    
      const handleClick =(index)=>{
        inputRefs.current[index].setSelectionRange(1,1);
      }

      const onSubmitEmail =async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsEmailSent(true);
        setLoading(false);
      }

      const onSubmitNewPassword =async (e) => {
        e.preventDefault();
        if(newPassword !== confirmNewPassword){
            return toast.error('Passwords do not match.');
        }
        try {
            setLoading(true);
            const res=await fetch('http://localhost:3000/api/auth/send-reset-otp',{
                method:'POST',
                headers:{
                    'Content-Type':
                    'application/json',
                },
                credentials: 'include', 
                body:JSON.stringify({email}),
            });
            const data=await res.json();
            if(data.success){
                toast.success(data.message);
                setIsNewPasswordSubmitted(true);
                setLoading(false);
            }
            else{
                setLoading(false);
                toast.error(data.message);
            }
        
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        } 
      }

      const onSubmitOTP =async (e) => {
        e.preventDefault();
        const otpArray =inputRefs.current.map(e=>e.value)
        const otp=otpArray.join('');
        if(isNaN(otp)){
            return toast.error('Please enter a valid OTP.');
        }
        try {
            setLoading(true);
            const res=await fetch('http://localhost:3000/api/auth/reset-password',{
                method:'POST',
                headers:{
                    'Content-Type':
                    'application/json',
                },
                credentials: 'include', 
                body:JSON.stringify({email,otp,newPassword}),
            });
            const data=await res.json();
            if(data.success){
                toast.success(data.message);
                setLoading(false);
                navigate('/signin');
            }
            else{
                setLoading(false);
                toast.error(data.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
        }
      }

  return (
    <>
    <div className='min-h-screen fixed top-0 left-0 right-0 bottom-0 bg-gray-200/40 dark:bg-gray-500/40 flex justify-center items-center'>
    {/* <div className='bg-gray-100 shadow-lg'> */}
    {!isEmailSent &&
     <form onSubmit={onSubmitEmail} className='p-8 rounded-lg shadow-lg w-96 text-sm bg-gray-100 flex flex-col gap-2 justify-center items-center dark:bg-gray-800 dark:text-gray-300'>
     <h1 className=' text-2xl font-semibold text-center mb-4'>
        Reset password
     </h1>
     <p className='mb-2'>Enter your registered email-address</p>
     <div className='flex flex-col gap-2 justify-center items-center'>
        <input type="email" placeholder="Email id" value={email} onChange={e=>setEmail(e.target.value)} required  className='border rounded-sm mb-2 p-1 w-65'/>
     </div>
     <button type='submit' className='w-full py-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md hover:from-blue-400 hover:to-blue-500  font-semibold mt-1 cursor-pointer  dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 ' disabled={loading} >Submit</button>
     </form>
  }

{isEmailSent && !isNewPasswordSubmitted &&
       <form onSubmit={onSubmitNewPassword} className='p-8 rounded-lg shadow-lg w-96 text-sm bg-gray-100 flex flex-col gap-2 justify-center items-center dark:bg-gray-800 dark:text-gray-300'>
     <h1 className=' text-2xl font-semibold text-center mb-4'>
        New password
     </h1>
     <p className='mb-2'>Enter your new password below</p>
     <div className='flex flex-col gap-2 justify-center items-center '>
        <input type="password" placeholder="new password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required className='border rounded-sm mb-2 p-1 w-65'/>
        <input type="password" placeholder="Confirm new password" value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)} required className='border rounded-sm mb-2 p-1 w-65'/>
     </div>
     <button type='submit' className='w-full py-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md hover:from-blue-400 hover:to-blue-500  font-semibold mt-1 cursor-pointer dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 ' disabled={loading}>
        {loading ? "Loading..." : "Submit"}</button>
     </form>
     }

    {isEmailSent && isNewPasswordSubmitted &&
     <form onSubmit={onSubmitOTP} className='p-8 rounded-lg shadow-lg w-96 text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-300'>
        <h1 className=' text-2xl font-semibold text-center mb-4'>Password Reset OTP</h1>
        <p className='mb-2'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-3 ' onPaste={handlePaste}>{Array(6).fill(0).map((_,index)=>(
            <input key={index} type="text" maxLength='1' required className='w-10 h-10 border-1 text-center text-xl rounded-md m-1'
            ref={(e)=>{inputRefs.current[index]=e}} onInput={(e)=>{handleInput(e,index)}} 
            onKeyDown={(e)=>{handleKeyDown(e,index)}} onClick={()=>handleClick(index)}/>
        ))}</div>
        <button className='w-full py-3 bg-gradient-to-r from-blue-300 to-blue-400 rounded-md hover:from-blue-400 hover:to-blue-500  font-semibold mt-1 cursor-pointer dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 ' disabled={loading} type='submit'>Verify Otp</button>
       </form>
}


    {/* </div>  */}
    </div>
    <div className='min-h-screen'>
    </div>
     </>
  )
}

export default ResetPassword
