import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal,setShowModal]=useState(false);
  const [commentIdToDelete,setCommentIdToDelete]=useState('');

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const fetchComments = async () => {
    const startIndex=comments.length;
    try{
      const res=await fetch(`http://localhost:3000/api/comment/getcomments?startIndex=${startIndex}`,{
        method:'GET',
        credentials: 'include',
      });
      const data=await res.json();
      if(res.ok){
        setComments((prev)=>[...prev,...data.comments]); 
        if(data.comments.length<9){
          setShowMore(false);
        }
      }
    } catch(error){
      console.log(error.message);
    }
  }

    const handleDeleteComment = async () => {
      setShowModal(false);
        try {
            const res = await fetch(`http://localhost:3000/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete)); // Remove the deleted user from the state
                
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200  dark:text-gray-300'>
      {/* Show table if posts exist, otherwise show fallback */}
      {currentUser.isAdmin && comments.length > 0 ? (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date updated</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Comment content</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Number of likes</th>
                <th className="border border-gray-300 px-4 py-2 text-left">PostId</th>
                <th className="border border-gray-300 px-4 py-2 text-left">UserId</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Delete</th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody >
              {comments.map((comment) => (
                <tr key={comment._id || Math.random()}>
                  <td className="border border-gray-300 px-4 py-2">{new Date(comment.updatedAt).toLocaleDateString() || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {comment.content}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {comment.numberOfLikes}
                    </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {comment.postId}
                    </td>
                  <td className="border border-gray-300 px-4 py-2">{comment.userId}</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-500 cursor-pointer"><span className='hover:underline' onClick={()=>{setShowModal(true);
                    setCommentIdToDelete(comment._id);
                  }}>Delete</span></td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && <button className=' bg-gray-100 w-full text-teal-500 px-4 py-2 mt-4 self-center cursor-pointer hover:text-teal-600' onClick={fetchUsers}>Show more</button>}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          {currentUser.isAdmin ? 'You have no comments yet!.' : 'Access denied.'}
        </div>
      )}

       {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
                <div className='bg-white p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
                  <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-20 h-20'/>
                  <div className='text-center text-xl'>Are you sure you want to delete this comment?</div>
                  <div className='flex justify-center gap-10 item-center w-full mt-5'> 
                    <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={handleDeleteComment}>Yes,I'm sure</button>
                  <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
                 
                </div>
              </div>
              }
    </div>
  );
}
