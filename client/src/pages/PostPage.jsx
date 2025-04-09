import {useParams} from 'react-router-dom'
import {useEffect,useState} from 'react'
import { FaSpinner } from "react-icons/fa";
import {Link} from 'react-router-dom';
import { lexicalToHtml } from './lexicalToHtml.js';
import CallToAction from '../components/CallToAction.jsx';
import CommentSection from '../components/CommentSection.jsx';
import PostCard from '../components/PostCard.jsx';

export default function PostPage(){
    const {postSlug}=useParams();
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [post,setPost]=useState({});
    const [recentPosts,setRecentPosts]=useState(null);
    const [contentLength,setContentLength]=useState(0);
  useEffect(()=>{
        const fetchPost=async()=>{
            try{
                const res=await fetch(`http://localhost:3000/api/post/getposts?slug=${postSlug}`,{
                    method:'GET',
                    credentials: 'include',
                });
                const data=await res.json();
                if(!res.ok)
                {
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setContentLength(data.posts[0].content.length);
                    const contentData = typeof data.posts[0].content === 'string' 
             ? JSON.parse(data.posts[0].content) 
             : data.posts[0].content;
             setPost({ ...data.posts[0], content: contentData });
                    setError(false);
                    setLoading(false);
                }
            }catch(error){
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    },[postSlug]);

   useEffect(()=>{
    try {
        const fetchRecentPosts=async()=>{
            const res=await fetch('http://localhost:3000/api/post/getposts?limit=3');
            const data=await res.json();
            if(res.ok){
                setRecentPosts(data.posts);
            }
        }
        fetchRecentPosts();
    } catch (error) {
        console.log(error.message);

    }
   },[])

    if(loading) return (
        <div className='flex justify-center items-center min-h-screen w-full'> <FaSpinner
        className="animate-spin text-teal-500"
        size={50} // size in px
      /></div>)
      console.log(post);
    const contentHtml =
      post  && lexicalToHtml(post.content) ;
    console.log(contentHtml);
    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
           <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
           <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
           <button className='cursor-pointer border border-gray-400 px-1 rounded-2xl hover:bg-gray-100 font-semibold'>{post && post.category}</button></Link>
           <img src={post && post.image}  alt={post && post.title} className='mt-10 p-3  max-h-[600px]w-full object-cover' />
           <div className='flex justify-between p-3  border-b border-slate-500 mx-auto w-full max-w-2xl text-xs font-semibold'>
           <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
           <span className='italic'>{post &&(contentLength/1000).toFixed(0)} mins read</span>
          </div>
          <div className='mx-auto p-3  max-w-3xl w-full post-content' dangerouslySetInnerHTML={{__html:post && contentHtml}}
          >
          </div>
          <div className='max-w-4xl mx-auto w-full'>
            <CallToAction/>
          </div>
          <CommentSection postId={post._id}/>

          <div className='flex flex-col justify-center items-center mb-5'>
            <h1 className='text-xl mt-5 '>Recent articles</h1>
            <div className='flex flex-wrap gap-5 mt-5 justify-center'>
              {
                recentPosts &&
                recentPosts.map((post)=>(
                    <PostCard key={post._id} post={post} />
                ))
              }
            </div>
          </div>
        </main>
    )
}