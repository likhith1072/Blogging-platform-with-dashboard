import {useSelector} from 'react-redux'
import {useEffect,useState} from 'react';
import {HiAnnotation, HiArrowNarrowRight, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup} from 'react-icons/hi'
import {Link} from 'react-router-dom'
import { FaSpinner } from "react-icons/fa";

export default function DashboardComp(){
    const [users,setUsers]=useState([]);
    const [comments,setComments]=useState([]);
    const [posts,setPosts]=useState([]);
    const [totalUsers,setTotalUsers]=useState(0);
    const [totalPosts,setTotalPosts]=useState(0);
    const [totalComments,setTotalComments]=useState(0);
    const [lastMonthUsers,setLastMonthUsers]=useState(0);
    const [lastMonthPosts,setLastMonthPosts]=useState(0);
    const [lastMonthComments,setLastMonthComments]=useState(0);
    const {currentUser}=useSelector((state)=>state.user)
    const [loadingPosts,setLoadingPosts]=useState(true);
    const [loadingComments,setLoadingComments]=useState(true);
    const [loadingUsers,setLoadingUsers]=useState(true);

    useEffect(()=>{
      const fetchUsers =async()=>{
        try{
            const res=await fetch(`http://localhost:3000/api/user/getusers?limit=5`,{
              method:'GET',
              credentials: 'include',
            });
            const data=await res.json();
            if(res.ok){
              setUsers(data.users); 
              setTotalUsers(data.totalUsers);
              setLastMonthUsers(data.lastMonthUsers);
              setLoadingUsers(false);
            }
          } catch(error){
            console.log(error.message);
          }
      }
      const fetchPosts =async()=>{
        try{
            const res=await fetch(`http://localhost:3000/api/post/getposts?limit=5`,{
              method:'GET',
              credentials: 'include',
            });
            const data=await res.json();
            if(res.ok){
              setPosts(data.posts); 
              setTotalPosts(data.totalPosts);
              setLastMonthPosts(data.lastMonthPosts);
              setLoadingPosts(false);
            }
          } catch(error){
            console.log(error.message);
          }
      }
      const fetchComments =async()=>{
        try{
            const res=await fetch(`http://localhost:3000/api/comment/getcomments?limit=5`,{
              method:'GET',
              credentials: 'include',
            });
            const data=await res.json();
            if(res.ok){
              setComments(data.comments); 
              setTotalComments(data.totalComments);
              setLastMonthComments(data.lastMonthComments);
              setLoadingComments(false);
            }
          } catch(error){
            console.log(error.message);
          }
      }
      if(currentUser.isAdmin){
        fetchUsers();
        fetchPosts();
        fetchComments();
      }
     
    },[currentUser])

    if(loadingPosts || loadingUsers || loadingComments) return (
         <div className='flex justify-center items-center min-h-screen w-full'> <FaSpinner
         className="animate-spin text-teal-500"
         size={50} 
       /></div>)

    return (
      <>
      {!loadingPosts && !loadingUsers && !loadingComments &&
               <div className='p-3 md:mx-auto transition-all duration-300'>
           <div className='flex flex-wrap justify-center items-center gap-4'>
            <div className='flex flex-col p-3 dark:bg-gray-slate-800 gap-4 md:w-72 w-60 rounded-md shadow-md'>
              <div className='flex justify-between items-center gap-5 '>
                 <div>
                    <h3 className='uppercase text-gray-500 text-md'>Total Users</h3>
                    <p className='text-2xl'>{totalUsers}</p>
                </div>
                <HiOutlineUserGroup className="text-5xl p-3 bg-teal-600 rounded-full text-white shadow-lg" />
              </div>
              <div className='flex items-center gap-2 text-sm'>
                  <span className='flex  items-center text-green-500'><HiArrowNarrowUp/>
                  {lastMonthUsers}
                  </span>
                  <span className='text-gray-500'>Last month</span>
               </div>

            </div>
            {/* next box */}
            <div className='flex flex-col p-3 dark:bg-gray-slate-800 gap-4 md:w-72 w-60 rounded-md shadow-md'>
              <div className='flex justify-between items-center'>
                 <div>
                    <h3 className='uppercase text-gray-500 text-md'>Total Comments</h3>
                    <p className='text-2xl'>{totalComments}</p>
                </div>
                <HiAnnotation className="text-5xl p-3 bg-indigo-600 rounded-full text-white shadow-lg" />
              </div>
              <div className='flex items-center gap-2 text-sm'>
                  <span className='flex  items-center text-green-500'><HiArrowNarrowUp/>
                  {lastMonthComments}
                  </span>
                  <span className='text-gray-500'>Last month</span>
               </div>

            </div>
            {/* next box */}
            <div className='flex flex-col p-3 dark:bg-gray-slate-800 gap-4 md:w-72 w-60 rounded-md shadow-md'>
              <div className='flex justify-between items-center gap-5 '>
                 <div>
                    <h3 className='uppercase text-gray-500 text-md'>Total Posts</h3>
                    <p className='text-2xl'>{totalPosts}</p>
                </div>
                <HiDocumentText className="text-5xl p-3 bg-lime-600 rounded-full text-white shadow-lg" />
              </div>
              <div className='flex items-center gap-2 text-sm'>
                  <span className='flex  items-center text-green-500'><HiArrowNarrowUp/>
                  {lastMonthPosts}
                  </span>
                  <span className='text-gray-500'>Last month</span>
               </div>

            </div>
           </div>

         <div className='flex flex-wrap gap-4 py-7 mx-auto justify-center'>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between items-center p-3 text-md font-semibold '>
              <h1 className='text-center p-2'>Recent users</h1>
              <button type='button' className='cursor-pointer border px-2 py-1 rounded-md bg-green-400 text-white flex items-center gap-1'>
                <Link to={"/dashboard?tab=users"}>See all</Link>
                <HiArrowNarrowRight/>
              </button>
            </div>
             <table className="table-auto w-full border-collapse">
                        {/* Table Header */}
                        <thead className="">
                          <tr>
                            <th className="px-4 py-2 text-left">User image</th>
                            <th className=" px-4 py-2 text-left">Username</th>
            
                          </tr>
                        </thead>
            
                        {/* Table Body */}
                        <tbody >
                          {users.map((user) => (
                            <tr key={user._id || Math.random()}>
                              
                              <td className=" px-4 py-2">
                                <img
                                  src={user.profilePicture || 'https://via.placeholder.com/100'}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </td>
                              <td className=" px-4 py-2 font-semibold">
                                {user.username}
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
          </div>

          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between items-center p-3 text-md font-semibold '>
              <h1 className='text-center p-2'>Recent comments</h1>
              <button type='button' className='cursor-pointer border px-2 py-1 rounded-md bg-green-400 text-white flex items-center gap-1'>
                <Link to={"/dashboard?tab=comments"}>See all</Link>
                <HiArrowNarrowRight/>
              </button>
            </div>
             <table className="table-auto w-full border-collapse">
                        {/* Table Header */}
                        <thead className="">
                          <tr>
                            <th className="px-4 py-2 text-left">Comment content</th>
                            <th className=" px-4 py-2 text-left">Likes</th>
            
                          </tr>
                        </thead>
            
                        {/* Table Body */}
                        <tbody >
                          {comments.map((comment) => (
                            <tr key={comment._id || Math.random()}>
                              
                              <td className=" px-4 py-2 md:w-86 transition-all duration-300">
                                <p className='line-clamp-2'>{comment.content}</p> 
                              </td>
                              <td className=" px-4 py-2 font-semibold">
                                {comment.numberOfLikes}
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
          </div>
          <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
            <div className='flex justify-between items-center p-3 text-md font-semibold '>
              <h1 className='text-center p-2'>Recent posts</h1>
              <button type='button' className='cursor-pointer border px-2 py-1 rounded-md bg-green-400 text-white flex items-center gap-1'>
                <Link to={"/dashboard?tab=posts"}>See all</Link>
                <HiArrowNarrowRight/>
              </button>
            </div>
             <table className="table-auto w-full border-collapse">
                        {/* Table Header */}
                        <thead className="">
                          <tr>
                            <th className="px-4 py-2 text-left">Post image</th>
                            <th className=" px-4 py-2 text-left">Post Title</th>
                            <th className=" px-4 py-2 text-left">Category</th>
                          </tr>
                        </thead>
            
                        {/* Table Body */}
                        <tbody >
                          {posts.map((post) => (
                            <tr key={post._id || Math.random()}>
                              
                              <td className=" px-4 py-2">
                                <img
                                  src={post.image || 'https://via.placeholder.com/100'}
                                  alt={post.username}
                                  className="w-14 h-10 rounded-md object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </td>
                              <td className=" px-4 py-2 font-semibold md:w-86 line-clamp-2 transition-all duration-300">
                                {post.title}
                                </td>
                              <td className=" px-4 py-2 font-semibold w-5">
                                {post.category}
                                </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
          </div>
         </div>
        </div>
       }
       </>
    )     
}