import React from 'react'
import {HiUser ,HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation} from 'react-icons/hi';
import {Link,useLocation} from 'react-router-dom';
import {useEffect,useState} from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';

export default function DashSidebar() {
      const {currentUser}=useSelector(state=>state.user);
      const dispatch=useDispatch();
      const location=useLocation();
      const [tab,setTab]=useState("");
      useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const tabFromUrl=urlParams.get('tab');
        setTab(tabFromUrl);
      },[location.search]);
  const handleSignout=async()=>{
    try {
      const res = await fetch('http://localhost:3000/api/user/signout',{
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
    <div className='flex flex-col gap-3 p-2 '>
       {currentUser && currentUser.isAdmin &&  (<Link to='/dashboard?tab=dash'><div className={`flex flex-row  items-center gap-2 rounded-sm p-3 ${tab==='dash'|| !tab ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-50 hover:dark:bg-gray-800`}>
        <HiDocumentText/><div>Dashboard</div>
        </div>
        </Link>)}

       <Link to='/dashboard?tab=profile'><div className={`flex flex-row items-center gap-2 rounded-sm p-3 ${tab==='profile' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-50  hover:dark:bg-gray-800`}>
        <div><HiUser/></div> <div>Profile</div>
        <div className='bg-blue-500  rounded-md ml-5 px-1 '>
          {currentUser.isAdmin ? 'Admin' : 'User'}
        </div>
        </div>
        </Link>
      {currentUser.isAdmin &&  (<Link to='/dashboard?tab=posts'><div className={`flex flex-row  items-center gap-2 rounded-sm p-3 ${tab==='posts' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-50 hover:dark:bg-gray-800`}>
        <HiDocumentText/><div>Posts</div>
        </div>
        </Link>)}
      {currentUser.isAdmin &&  (<Link to='/dashboard?tab=users'><div className={`flex flex-row  items-center gap-2 rounded-sm p-3 ${tab==='users' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-50  hover:dark:bg-gray-800`}>
        <HiOutlineUserGroup/><div>Users</div>
        </div>
        </Link>)}
      {currentUser.isAdmin &&  (<Link to='/dashboard?tab=comments'><div className={`flex flex-row  items-center gap-2 rounded-sm p-3 ${tab==='comments' ? 'bg-gray-200 dark:bg-gray-700' : ''} hover:bg-gray-50  hover:dark:bg-gray-800`}>
        <HiAnnotation/><div>Comments</div>
        </div>
        </Link>)}
       

       <div className='flex flex-row  items-center gap-2 rounded-sm p-3 cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800' onClick={handleSignout}>
        <div><HiArrowSmRight/></div> <div>Sign out</div>
        </div>

    </div>
  )
}
