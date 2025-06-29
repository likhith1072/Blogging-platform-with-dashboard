import React, { useEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux';
import { useState ,useRef} from 'react';
import {getStorage, uploadBytesResumable,ref,getDownloadURL} from 'firebase/storage';
import {app} from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice.js';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { deleteStart,deleteSuccess,deleteFailure } from '../redux/user/userSlice.js';
import { signoutSuccess } from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';


export default function DashProfile() {
  const {currentUser,error,loading}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const [imageFile,setImageFile]=useState(null);
  const [imageFileUrl,setImageFileUrl]=useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress]=useState(0);
  const [imageFileUploadError,setImageFileUploadError]=useState(null);
  const [imageFileUploading,setImageFileUploading]=useState(false); 
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
  const [updateUserError,setUpdateUserError]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [formData,setFormData]=useState({});  
  const filePickerRef=useRef();

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(()=>{
    if(imageFile){
      uploadImage();
    }
  },[imageFile]);

  const uploadImage=async()=>{
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage=getStorage(app);
    const fileName =new Date().getTime()+imageFile.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error)=>{
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL=>{
           setImageFileUrl(downloadURL);
           setFormData({...formData,profilePicture:downloadURL});
            setImageFileUploading(false);
        }
      );
      },
    );
  };

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes were made');
      return;
    }
    if(imageFileUploading){
      return;
    }
    try {
      dispatch(updateStart());
      // console.log({currentUser,formData});
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if(!res.ok){
       dispatch(updateFailure(data.message));
       setUpdateUserError(data.message);
      }
      else{
        dispatch(updateSuccess(data));
        setFormData({});
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  const handleDeleteUser=async()=>{
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      if(!res.ok){
       dispatch(deleteFailure(data.message));
       
      }
      else{
        dispatch(deleteSuccess(data));
      }
    }
   catch (error) {
    dispatch(deleteFailure(error.message));
  }
}
  
const handleSignout=async()=>{
  try {
    const res = await fetch('/api/user/signout',{
      method:'POST',
      credentials: 'include',
    });
    const data= await res.json();
    if(!res.ok){
      console.log(data.message);
    }
    else{
      dispatch(signoutSuccess());
    }
  } catch (error) {
    console.log(error.message);
  }
}

  return (
    <div className='w-full max-w-lg mx-auto p-3 relative'>
       <h1 className='my-5 text-center font-semibold text-3xl'>Profile</h1>
       <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <input type="file" accept='image/*' className='border-1 cursor-pointer p-1 hidden' onChange={handleImageChange} ref={filePickerRef} />
        <div className='w-32 h-32 self-center cursor-pointer overflow-hidden rounded-full shadow-md relative' onClick={()=>{filePickerRef.current.click()}} >
           
           {imageFileUploadProgress &&  (<CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
           strokeWidth={5} 
           styles={{
            root:{
              width:'100%',
              height:'100%',
              position:'absolute',
              top:0,
              left:0,
            },
            path:{
              stroke:`rgba(62,152,199,${imageFileUploadProgress/100})`
            },
           }}/> )}
          <img src={ imageFileUrl || currentUser.profilePicture} alt="user" className={`absolute top-0 left-0 rounded-full w-full h-full  object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}  />
        </div>
      
          {imageFileUploadError && <div>{imageFileUploadError}</div>}
        
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username} className='p-1 border-1 rounded-sm bg-gray-50 dark:bg-gray-800' onChange={handleChange}/>
        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email}  className='p-1 border-1 rounded-sm bg-gray-50 dark:bg-gray-800' onChange={handleChange}/>
        <input type="password" id="password" placeholder="password" className='p-1 border-1 rounded-sm bg-gray-50 dark:bg-gray-800'  onChange={handleChange}/>
        <button className='bg-gradient-to-r from-purple-400 to-blue-400 hover:from bg-purple-500 hover:to-blue-500 cursor-pointer rounded-sm' type="submit" disabled={loading || imageFileUploading}>{loading ? 'Loading..' : 'Update'}</button>
        {currentUser && currentUser.isAdmin && (
          <Link to='/create-post' className='bg-gradient-to-r from-purple-400 to-blue-400 hover:from bg-purple-500 hover:to-blue-500 rounded-sm'>
            <button type='button' className='w-full cursor-pointer '>Create a post</button>
          </Link>
        )}
       </form>
       <div className='text-red-500 flex justify-between mt-4 p-1'>
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignout}>Sign Out</span>
       </div>
       {updateUserSuccess && <div className='bg-green-100 text-green-400 rounded-sm p-2'>{updateUserSuccess}</div>
       }
       {updateUserError && <div className='bg-red-100 text-red-400 rounded-sm p-2'>{updateUserError}</div>
        }
        {error && <div className='bg-red-100 text-red-400 rounded-sm p-2'>{error}</div>}
        {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
          <div className='bg-white dark:bg-gray-700 p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
            <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-20 h-20'/>
            <div className='text-center text-xl'>Are you sure you want to delete your account?</div>
            <div className='flex justify-center gap-10 item-center w-full mt-5'> 
              <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={handleDeleteUser}>Yes,I'm sure</button>
            <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
           
          </div>
        </div>
        }
    </div>
  )
}
