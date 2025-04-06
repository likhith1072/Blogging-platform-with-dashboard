import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal,setShowModal]=useState(false);
  const [postIdToDelete,setPostIdToDelete]=useState('');

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);
 console.log(userPosts.length)

  const fetchPosts = async () => {
    const startIndex=userPosts.length;
    try{
      const res=await fetch(`http://localhost:3000/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data=await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.posts]); //we directly assigned data.posts to setUserPosts because we know data.posts is an array
        if(data.posts.length<9){
          setShowMore(false);
        }
      }
    } catch(error){
      console.log(error.message);
    }
  }

  const handleDeletePost=async()=>{
     setShowModal(false);
     try {
      const res=await fetch(`http://localhost:3000/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE',
        credentials: 'include',
      });
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }
      else{
        setUserPosts((prev)=>prev.filter((post)=>post._id !== postIdToDelete));
      }
     } catch (error) {
      console.log(error.message);
     }
  };

  return (
    <div className='table-auto dark:text-gray-300 overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200  '>
      {/* Show table if posts exist, otherwise show fallback */}
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300 ">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date updated</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Post image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Post title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Delete</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody >
              {userPosts.map((post) => (
                <tr key={post._id || post.id || Math.random()}>
                  <td className="border border-gray-300 px-4 py-2">{new Date(post.updatedAt).toLocaleDateString() || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image || 'https://via.placeholder.com/100'}
                      alt="Post"
                      className="w-16 h-16 object-cover"
                    />
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    <Link className='hover:underline' to={`/post/${post.slug}`}>{post.title || 'No Title'}</Link>
                    </td>
                  <td className="border border-gray-300 px-4 py-2">{post.category || 'Uncategorized'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-500 cursor-pointer"><span className='hover:underline' onClick={()=>{setShowModal(true);
                    setPostIdToDelete(post._id);
                  }}>Delete</span></td>
                  <td className="border border-gray-300 px-4 py-2 text-blue-500 cursor-pointer">
                    <Link to={`/update-post/${post._id}`}><span className='hover:underline'>Edit</span></Link>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && <button className=' bg-gray-100 w-full text-teal-500 px-4 py-2 mt-4 self-center cursor-pointer hover:text-teal-600' onClick={fetchPosts}>Show more</button>}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          {currentUser.isAdmin ? 'You have no posts.' : 'Access denied.'}
        </div>
      )}

       {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
                <div className='bg-white p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
                  <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-20 h-20'/>
                  <div className='text-center text-xl'>Are you sure you want to delete this post?</div>
                  <div className='flex justify-center gap-10 item-center w-full mt-5'> 
                    <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={handleDeletePost}>Yes,I'm sure</button>
                  <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
                 
                </div>
              </div>
              }
    </div>
  );
}
