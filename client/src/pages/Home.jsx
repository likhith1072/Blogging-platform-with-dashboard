import React from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useState,useEffect } from 'react'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts]=useState([]);

  useEffect(()=>{
    const fetchPosts =async()=>{
      const res=await fetch('/api/post/getPosts');
      const data=await res.json();
      setPosts(data.posts);
    }
    fetchPosts();
  },[])

  return (
    <div>
        <div className='flex flex-col gap-6 p-28 px-5 max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
          <p className='text-gray-500 text-xs sm:text-sm'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
          <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline hover:text-teal-600 flex items-center gap-1'><span>View all posts </span>
          <HiArrowNarrowRight/>
          </Link>
        </div>
        <div className='p-3 bg-amber-100 dark:bg-slate-700'>
          <CallToAction/>
        </div>
        
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
          {posts && posts.length>0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl lg:text-3xl font-semibold text-center'>Recent Posts</h2>
              <div className='flex flex-wrap items-center justify-center gap-4'>
                {posts.map((post)=>(
                  <PostCard key={post._id} post={post}/>
                ))}
              </div>
              <Link to='/search' className='text-sm sm:text-lg text-teal-500 font-bold hover:underline hover:text-teal-600 flex justify-center items-center gap-1 '><span>View all posts </span>
             <HiArrowNarrowRight/>
             </Link>
            </div>
          )}
        </div>
    </div>
  )
}

