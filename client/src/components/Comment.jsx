import React from 'react'
import {useEffect,useState} from 'react'
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa'
import {useSelector} from 'react-redux'

export default function Comment({comment,onLike,onEdit,onDelete}) {
    const [isEditing,setIsEditing]=useState(false);
    const [editedContent,setEditedContent]=useState(comment.content);
    const {currentUser}=useSelector(state=>state.user)
    const [user,setUser]=useState({});

    useEffect(()=>{
        const getUser =async ()=>{
           try {
             const res=await fetch(`http://localhost:3000/api/user/${comment.userId}`);
             const data=await res.json();
             console.log(data);
             if(res.ok){
                setUser(data);
                console.log(data);
            }
           } catch (error) {
            console.log(error.message);      
           }
        }
        getUser();
    },[comment])

    const handleEdit=async(commentId)=>{
      setIsEditing(true);
      setEditedContent(comment.content);
    }
    
    const handleSave=async()=>{
      try {
        const res=await fetch(`http://localhost:3000/api/comment/editComment/${comment._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        credentials:'include',
        body:JSON.stringify({content:editedContent})
        })
        if(res.ok){
          setIsEditing(false);
          onEdit(comment,editedContent);
        }
      } catch (error) {
        console.log(error.message);
      }
     }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex shrink-0 mr-3'>
        <img src={user.profilePicture} alt={user.username} className='h-10 w-10 object-cover rounded-full bg-gray-200' referrerPolicy='no-referrer'/>
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}`:'anonymous user'}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>

       {
        isEditing ? (
          <> < textarea className='w-full p-2 text-gray-700 bg-gray-100 rounded-md ' rows='3'
          maxLength={200}
          value={editedContent}
          onChange={(e)=>setEditedContent(e.target.value)}/>
          
         <div className='flex items-center justify-end gap-3 p-1 text-xs text-white font-semibold'>
          <button type='button' className='text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 cursor-pointer rounded-sm p-1'
          onClick={handleSave}>Save</button>
          <button type='button' className='text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 cursor-pointer rounded-sm p-1 mr-3' onClick={()=>setIsEditing(false)}>Cancel</button>
          
         </div>
          </> 
        ):(
        <>
         <p className='text-gray-500 pb-2'>{comment.content}</p>
        <div className='flex items-center gap-2 pt-2  '>
          <button type='button' onClick={()=>onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 cursor-pointer ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
            <FaThumbsUp className='text-sm'/>
          </button>
          <p className='text-gray-500 text-xs '>
            {
              comment.numberOfLikes >0 && comment.numberOfLikes + " "+ (comment.numberOfLikes === 1 ? "like" : "likes")
            }
          </p>
            {
              currentUser && (currentUser._id === comment.userId) && (
                <>
                <button
                  type='button' 
                  onClick={()=>handleEdit(comment._id)}
                  className='text-gray-400 hover:text-blue-500 cursor-pointer text-xs'>
                  Edit
                </button>
                <button
                  type='button' 
                  onClick={()=>onDelete(comment._id)}
                  className='text-gray-400 hover:text-red-500 cursor-pointer text-xs '>
                  Delete
                </button>
                </>
                
              )
            }
        </div>
        </>)
       }

 
      </div>
    </div>
  )
}
