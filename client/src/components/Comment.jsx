import React from 'react'
import {useEffect,useState} from 'react'
import moment from 'moment';
import {FaThumbsUp} from 'react-icons/fa'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {HiOutlineExclamationCircle} from 'react-icons/hi'


export default function Comment({comment,onLike,onEdit,onDelete,onReply}) {
    const [isEditing,setIsEditing]=useState(false);
    const [editedContent,setEditedContent]=useState(comment.content);
    const {currentUser}=useSelector(state=>state.user)
    const [user,setUser]=useState({});
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);
const [replies, setReplies] = useState([]);
  const [showModal,setShowModal]=useState(false);
  const [commentToDelete,setCommentToDelete]=useState();
  const navigate=useNavigate();
  const [noOfReplies,setNoOfReplies]=useState(comment.replies.length);


    useEffect(()=>{
        const getUser =async ()=>{
           try {
             const res=await fetch(`/api/user/${comment.userId}`);
             const data=await res.json();
            //  console.log(data);
             if(res.ok){
                setUser(data);
                //  console.log(data);
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
        const res=await fetch(`/api/comment/editComment/${comment._id}`,{
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

     const fetchReplies = async () => {
      try {
        const res = await fetch(`/api/comment/getReplies/${comment._id}`);
        const data = await res.json();
        if (res.ok) {
          setReplies(data); 
          setNoOfReplies(data.length);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const handleReplySave = async () => {
      try {
        const res = await fetch('/api/comment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            content: replyContent,
            postId: comment.postId,
            userId: currentUser._id,
            parentId: comment._id,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setReplyContent('');
          setShowReplyBox(false);
          onReply(comment._id, data); // update parent in CommentSection
          setReplies((prev) => [...prev, data]);  // add reply to the replies state
          setNoOfReplies((prev) => prev + 1); 

        }
      } catch (err) {
        console.log(err.message);
      }
    };

    const handleUpdateReply = (c , updatedReply) => {
      setReplies((prev) =>
        prev.map((reply) => (reply._id === c._id ? { ...reply, content: updatedReply } : reply))
      );
    };

 
    const handleDelete=async()=>{  
      // setShowModal(false);
      if(commentToDelete.parentId === comment._id)
        { 
          setShowModal(false);
        try {
        if(!currentUser){
          navigate('/sign-in');
          return;
        }
        const res=await fetch(`/api/comment/deleteComment/${commentToDelete._id}`,{
          method:'DELETE',
          credentials:'include',
        });
        if(res.ok){
          const data=await res.json();
          setReplies((prev) => prev.filter((reply) => reply._id !== commentToDelete._id)); 
          setNoOfReplies((prev) => prev - 1);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    
    }

    const handleLike =async(commentId)=>{
      try {
       if(!currentUser){
         navigate('/sign-in');
         return;
       }
       const res=await fetch(`/api/comment/likeComment/${commentId}`,{
         method:'PUT',
         credentials:'include', 
       });
       if(res.ok){
        const data=await res.json();
        setReplies(replies.map(reply=>
          reply._id === commentId ?{
            ...reply,
            likes:data.likes,
            numberOfLikes:data.numberOfLikes,
          }:reply
        ))
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
                  onClick={()=>{onDelete(comment);
                  }}
                  className='text-gray-400 hover:text-red-500 cursor-pointer text-xs '>
                  Delete
                </button>
                </>
                
              )
            }
            {
              currentUser && (
                <button className='px-2 py-1 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer' on
                onClick={()=>setShowReplyBox(!showReplyBox)}>Reply</button>
              )
            }

        </div>
        <div className='flex flex-col gap-2 '>
        <div>
           <div>        
               {showReplyBox && (
          <div className='mt-2'>
            <textarea
              rows='2'
              maxLength='200'
              placeholder='Write your reply...'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className='w-full p-2 border rounded-md'
            />
            <div className='flex gap-2 justify-end mt-1'>
              <button
                onClick={handleReplySave}
                className='bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer'
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyContent('');
                }}
                className='text-xs px-2 py-1 border rounded cursor-pointer'
              >
                Cancel
              </button>
            </div>
          </div>
        )}</div>

         {(replies.length >0 || comment.replies.length > 0 )&& (
        <button
         onClick={() => {
         if(!showReplies) fetchReplies();
        setShowReplies(!showReplies);
       }}
      className="text-xs text-blue-500   hover:underline cursor-pointer"
     >
       {showReplies ? 'Hide Replies' : `View Replies (${noOfReplies})`}
      </button>
    )}
            </div>
            {showReplies && replies.length > 0 && (
    <div className='ml-10 mt-2'>
      {replies.map(reply => (
      <Comment
        key={reply._id}
        comment={reply}
        onLike={handleLike}
        onEdit={handleUpdateReply}
        onDelete={(commentId)=>{
          setShowModal(true);
          setCommentToDelete(commentId);
        }}
        onReply={onReply}
      />
      ))}
     </div>
  )}

        </div>
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
    </div>
  )
}
