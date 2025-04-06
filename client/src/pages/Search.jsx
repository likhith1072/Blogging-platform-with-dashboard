import React from 'react'
import { useState,useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { FaSpinner } from "react-icons/fa";
import PostCard from '../components/PostCard';

export default function Search() {
    const location=useLocation();
    const navigate=useNavigate();
    const [sidebarData,setSidebarData]=useState({
        searchTerm:'',
        sort:'desc',
        category:'uncategorized',
    });
    const [posts,setPosts]=useState([]);
    const [loading,setLoading]=useState(false);
    const [showMore,setShowMore]=useState(false);
     console.log('sidebarData:',sidebarData);
    useEffect(()=>{
      const urlParams=new URLSearchParams(location.search);
      const searchTermFromUrl=urlParams.get('searchTerm');
       const sortFromUrl=urlParams.get('sort');
       const categoryFromUrl=urlParams.get('category');
         if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
             setSidebarData({...sidebarData,searchTerm:searchTermFromUrl,
             sort:sortFromUrl , category:categoryFromUrl});
             }
       const fetchPosts=async()=>{
            setLoading(true);
            const searchQuery=urlParams.toString();
            const res=await fetch(`http://localhost:3000/api/post/getPosts?${searchQuery}`);
            if(!res.ok){
                setLoading(false);
                return;
            }
            if(res.ok){
                const data=await res.json();
                setPosts(data.posts);
                setLoading(false);
                if(data.posts.length===9){
                    setShowMore(true);
                }
                else{
                    setShowMore(false);
                }
            }
       } 
       fetchPosts();     
         
    },[location.search])

    const handleChange=(e)=>{
        if(e.target.id ==='searchTerm'){
            setSidebarData({...sidebarData,searchTerm:e.target.value});
        }
        if(e.target.id ==='sort'){
            const order=e.target.value || 'desc';
            setSidebarData({...sidebarData,sort:order});
        }
        if(e.target.id ==='category'){
            const category=e.target.value || 'uncategorized';
            setSidebarData({...sidebarData,category});
        }
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('category',sidebarData.category);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore=async()=>{
        const numberOfPosts=posts.length;
        const startIndex=numberOfPosts;
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery=urlParams.toString();
        const res=await fetch(`http://localhost:3000/api/post/getPosts?${searchQuery}`);
        if(!res.ok){
            return;
        }
        if(res.ok){
            const data =await res.json();
            setPosts([...posts,...data.posts]);
            if(data.posts.length ===9){
                setShowMore(true);
            }
            else{
                setShowMore(false);
            }
        }

    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold whitespace-nowrap' htmlFor="searchTerm">Search Term:</label>
                    <input 
                    className='border px-2 py-1 border-gray-600 rounded-sm bg-gray-100 text-black w-30 lg:w-40' type="text" id="searchTerm"
                     placeholder='Search...'
                      value={sidebarData.searchTerm} onChange={handleChange}
                    />
                </div>
                <div className='flex items-center gap-2'>
                <label className='font-semibold whitespace-nowrap' htmlFor="sort">Sort:</label>
                 <select className='border px-2 py-1 border-gray-600 rounded-sm bg-gray-100 text-black' id="sort" value={sidebarData.sort || "desc"} onChange={handleChange}>
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                    </select>
                </div>
                <div className='flex items-center gap-2'>
                <label className='font-semibold whitespace-nowrap' htmlFor="category">Category:</label>
                 <select className='border px-2 py-1 border-gray-600 rounded-sm bg-gray-100 text-black' id="category" value={sidebarData.category} onChange={handleChange}>
                    <option value="uncategorized">Uncategorized</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                    <option value="javascript">JavaScript</option>
                    </select>
                </div>
                <button type='submit' className='border cursor-pointer border-gray-600 rounded-sm bg-gradient-to-r from-violet-500 to-pink-400 hover:from-violet-600 hover:to-pink-500 text-black px-3 py-1 mx-auto '>Apply Filters</button>
            </form>
        </div>
        <div className='w-full'>
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {
                    !loading && posts.length===0 && <p className='text-xl text-gray-500'>No posts found.</p>
                }
                {
                    loading && ( <div className="flex justify-center items-center text-6xl text-green-600 animate-spin min-h-screen w-full">
                        <FaSpinner />
                      </div>)
                }
                {
                    !loading && posts && posts.map((post)=>
                     <PostCard key={post._id} post={post}/>  
                    )
                }
                {
                    showMore && (
                        <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 mx-auto cursor-pointer'>
                            Show More
                        </button>
                    )
                }
            </div>
        </div>
    </div>
  )
}
