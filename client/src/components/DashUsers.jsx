import React, { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal,setShowModal]=useState(false);
  const [userIdToDelete,setUserIdToDelete]=useState('');

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const fetchUsers = async () => {
    const startIndex=users.length;
    try{
      const res=await fetch(`http://localhost:3000/api/user/getusers?startIndex=${startIndex}`,{
        method:'GET',
        credentials: 'include',
      });
      const data=await res.json();
      if(res.ok){
        setUsers((prev)=>[...prev,...data.users]); //we directly assigned data.posts to setUserPosts because we know data.posts is an array
        if(data.users.length<9){
          setShowMore(false);
        }
      }
    } catch(error){
      console.log(error.message);
    }
  }

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete)); // Remove the deleted user from the state
                setShowModal(false);
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
      {currentUser.isAdmin && users.length > 0 ? (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date created</th>
                <th className="border border-gray-300 px-4 py-2 text-left">User image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Admin</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Delete</th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody >
              {users.map((user) => (
                <tr key={user._id || Math.random()}>
                  <td className="border border-gray-300 px-4 py-2">{new Date(user.createdAt).toLocaleDateString() || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={user.profilePicture || 'https://via.placeholder.com/100'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {user.username}
                    </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {user.email}
                    </td>
                  <td className="border border-gray-300 px-4 py-2">{user.isAdmin ?(<FaCheck className="text-green-500"/>):(<FaTimes className="text-red-500"/>) }</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-500 cursor-pointer"><span className='hover:underline' onClick={()=>{setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}>Delete</span></td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && <button className=' bg-gray-100 w-full text-teal-500 px-4 py-2 mt-4 self-center cursor-pointer hover:text-teal-600' onClick={fetchUsers}>Show more</button>}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          {currentUser.isAdmin ? 'You have no Users.' : 'Access denied.'}
        </div>
      )}

       {showModal && <div className='bg-black/50 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
                <div className='bg-white p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
                  <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-20 h-20'/>
                  <div className='text-center text-xl'>Are you sure you want to delete this User?</div>
                  <div className='flex justify-center gap-10 item-center w-full mt-5'> 
                    <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={handleDeleteUser}>Yes,I'm sure</button>
                  <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
                 
                </div>
              </div>
              }
    </div>
  );
}
