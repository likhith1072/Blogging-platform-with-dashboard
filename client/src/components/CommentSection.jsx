import React from 'react'
import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import Comment from './Comment'
import { useNavigate } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({postId}) {
  const navigate=useNavigate();
  const {currentUser}=useSelector(state=>state.user)
  const [comment,setComment]=useState("");
  const [commentError,setCommentError]=useState(null);
  const [comments,setComments]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [commentToDelete,setCommentToDelete]=useState(null);
  console.log(comments);

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(comment.length>200){
      return;
    }
    try {
      const res=await fetch('http://localhost:3000/api/comment/create',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        credentials:'include',
        body:JSON.stringify({content:comment,postId,userId:currentUser._id})
      });
      const data=await res.json();
      if(res.ok){
        setComment("");
        setCommentError(null);
        setComments([data,...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  }

  useEffect(()=>{
   const getComments=async()=>{
    try {
      const res=await fetch(`http://localhost:3000/api/comment/getPostComments/${postId}`);
      if(res.ok){
        const data=await res.json();
        setComments(data);    
      }
      }
    catch (error) {
      console.log(error.message);
      }
    }
    getComments();
  },[postId])

 const handleLike =async(commentId)=>{
   try {
    if(!currentUser){
      navigate('/sign-in');
      return;
    }
    const res=await fetch(`http://localhost:3000/api/comment/likeComment/${commentId}`,{
      method:'PUT',
      credentials:'include', 
    });
    if(res.ok){
     const data=await res.json();
     setComments(comments.map(comment=>
      comment._id === commentId ?{
        ...comment,
        likes:data.likes,
        numberOfLikes:data.numberOfLikes,
      }:comment
     ));
    }
   } catch (error) {
      console.log(error.message);
   }
 }

 const handleEdit=async(comment,editedContent)=>{
    setComments(comments.map(c=>c._id === comment._id ? {...c,content:editedContent}:c)); 
 }

  const handleDelete=async()=>{
    setShowModal(false);
    try {
      if(!currentUser){
        navigate('/sign-in');
        return;
      }
      const res=await fetch(`http://localhost:3000/api/comment/deleteComment/${commentToDelete._id}`,{
        method:'DELETE',
        credentials:'include',
      });
      if(res.ok){
        const data=await res.json();
        setComments(comments.filter(comment=>comment._id !== commentToDelete._id));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleReply = (parentId, newReply) => {
    setComments((prev) => {
      return prev.map((comment) =>
        comment._id === parentId
          ? { ...comment, replies: [...(comment.replies || []), newReply._id] }
          : comment
      );
    });
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-600 text-sm'>
          <p>Signed in as:</p>
          <img src={currentUser.profilePicture} alt="" className='h-5 w-5 object-cover rounded-full'/>
          <Link to="/dashboard?tab=profile" className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
        </div>
      ):
      (
        <div className="comment-section flex gap-2 text-sm text-teal-500 my-5">
          <p>Sign in to leave a comment.</p>
          <Link to="/sign-in" className='text-blue-500 hover:underline'>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
          <textarea className='border p-1 w-full'
          value={comment}
          rows="4"
          placeholder="Add a comment..."
          maxLength='200' 
          onChange={(e)=>setComment(e.target.value)}
         />
         <div className='flex justify-between items-center mt-5'>
          <p className='text-gray-500 text-xs'>{200 -comment.length} characters remaining</p>
          <button className='outline bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 cursor-pointer rounded-sm px-1' type='submit'>Submit</button>
         </div>
          {commentError && <p className='text-red-500 bg-red-100 rounded-sm text-xs mt-5'>{commentError}</p>}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ):(
        <>
        <div className='text-sm my-5 flex items-center gap-1'>
          <p>Comments</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p>{comments.length}</p>
          </div>
        </div>
        {
          comments.map(comment=>(
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId)=>{
              setShowModal(true);
              setCommentToDelete(comment);
            }} onReply={handleReply}/>
          )) }
        </>) 
        }

         {showModal && <div className='bg-black/50 z-4 fixed top-0 left-0 w-full h-screen flex justify-center items-center text-md' onClick={()=>setShowModal(false)}>
                        <div className='bg-white p-5 rounded-md w-90 h-60 flex flex-col justify-center items-center 'onClick={(e)=>e.stopPropagation()}>
                          <HiOutlineExclamationCircle className='text-gray-400 dark:text-gray-200 w-20 h-20'/>
                          <div className='text-center text-xl'>Are you sure you want to delete this comment?</div>
                          <div className='flex justify-center gap-10 item-center w-full mt-5'> 
                            <button className='bg-red-500 text-white rounded-sm  p-1 cursor-pointer' onClick={()=>handleDelete()}>Yes,I'm sure</button>
                          <button className='bg-gray-100 text-black rounded-sm p-1 cursor-pointer' onClick={()=>setShowModal(false)}>No,cancel</button></div>
                         
                        </div>
                      </div>
                      }
    </div>
  )
}
