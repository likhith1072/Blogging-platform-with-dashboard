import React from 'react';
import {useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState("");
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    setTab(tabFromUrl);
  },[location.search]);
  return (
    <div className='flex flex-col sm:flex-row gap-2 w-full min-h-screen '>
      <div className=" md:w-60 border-2 border-gray-500">
        {/* sidebar */}
        <DashSidebar/>
      </div>
      {/* profile */}
      {tab ==='profile' && <DashProfile/>}
      {/* posts */}
      {tab ==='posts' &&  <DashPosts/>}
      {/* users */}
      {tab ==='users' && <DashUsers/>}
      {/* comments */}
      {tab ==='comments' && <DashComments/>}
      {/* dashboard comp*/}
      {tab ==='dash' && <DashboardComp/>}

    </div>
  )
}
