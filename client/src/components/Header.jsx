import React from 'react'
import { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaMoon ,FaSun} from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';


export default function Header() {
    const dispatch=useDispatch();
    const {theme}=useSelector(state=>state.theme);
    const [searchTerm,setSearchTerm]=useState('');
    const navigate=useNavigate();
    const {currentUser}=useSelector(state=>state.user);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: "Home", to: "/" },
        { name: "About", to: "/about" },
    ];
  
    useEffect(()=>{
     const urlParams=new URLSearchParams(location.search);
     const searchTermFromUrl=urlParams.get('searchTerm');
     if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl);
     }
    },[location.search]);

   const handleSignout=async()=>{
     try {
       const res = await fetch('/api/user/signout',{
         method:'POST',
         credentials: 'include',
       });
       const data= await res.json();
       if(!res.ok){
         console.log(data.message);
       }
       else{
         dispatch(signoutSuccess());
       }
     } catch (error) {
       console.log(error.message);
     }
   }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const urlParams=new URLSearchParams(location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery=urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    return (
        <div className='relative' >
            <div className='sm:px-1 py-2 border-1 border-gray-500 flex justify-between items-center'>
                <div>
                    <Link to="/" className='self-center whitespace-nowrap text-md sm:text-xl font-semibold '>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white'>Fusion </span>
                        Blog
                    </Link>
                </div>

                <div >
                    <div className=" px-4 sm:px-6 lg:px-8 flex lg:gap-28 gap-4 lg:justify-between justify-content items-center bg-green">
                        <div>
                            <form onSubmit={handleSubmit} className='lg:inline hidden'>
                                <div className="relative w-[250px]">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        className="w-full p-[10px_30px_10px_8px] border border-gray-500 rounded-lg box-border dark:bg-gray-800"
                                        onChange={(e)=>setSearchTerm(e.target.value)}
                                    />
                                    <AiOutlineSearch className="absolute right-[10px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>

                            </form>
                            <button className='w-12 h-10 border-1 border-gray-500 rounded-full px-3 lg:hidden cursor-pointer'> <AiOutlineSearch /> </button>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex space-x-7 w-full lg:text-xl">
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`${isActive(link.to) ? "text-indigo-600 font-semibold" : "text-gray-1000"
                                        } hover:text-indigo-500 transition`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>


                        <div className='flex gap-2 items-center justify-center'>
                            <button className='w-12 h-10 border-1 rounded-full px-3 hidden lg:inline cursor-pointer' onClick={()=>{dispatch(toggleTheme())}}>
                               {theme==='light'?<FaSun/>:<FaMoon />}
                                </button>

                            {currentUser ? (<div className=' relative group px-2 w-14' >
                                <img src={currentUser.profilePicture} alt="user" referrerPolicy="no-referrer"  className='rounded-full w-10 h-10 cursor-pointer '  onClick={()=>navigate('/dashboard?tab=profile')}/>
                            
                            <div className='absolute top-10 right-0 border-1 
                            bg-white dark:bg-gray-800 dark:text-gray-400 rounded-md flex-col items-center justify-center hidden group-hover:flex p-2 z-1'>
                             <div className='py-1'>{currentUser.username}</div>
                             <div className='py-1'>{currentUser.email}</div>
                             <Link to="/dashboard?tab=profile" className='dark:hover:bg-gray-600 hover:bg-gray-300 w-full text-center py-1'>Profile</Link>
                             <div className='dark:hover:bg-gray-600 hover:bg-gray-300 w-full text-center py-1 cursor-pointer' onClick={handleSignout}><Link to="/signin">Sign out</Link></div>
                            </div>
                             
                            </div>):(<Link to='/signin' className={`${isActive('/signin') && "hidden"}`}>
                            <div className=' h-10 w-20  bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-1 rounded-md px-2 text-white text-sm sm:text-md font-semibold cursor-pointer flex justify-center items-center'>Sign In</div></Link>)
                        }
                            
                        </div>

                        {/* Mobile Menu Button */}
                        <div>
                            <button
                                className="lg:hidden p-2 rounded-md border cursor-pointer"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X className="w-5 h-5 hover:bg-gray-200" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                   
                     {isOpen && (
                        <div className="lg:hidden px-4 py-2  border-2 border-gray-600  absolute top-0 w-full dark:bg-gray-800 bg-white z-1">
                            <div className="pl-3 flex items-center ">
                                <span className="text-xl font-semibold pr-2 pl-6">Menu </span>
                                <button
                                    className="lg:hidden m-2 rounded-md border-2 p-[2px] cursor-pointer"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {isOpen ? <X className="w-7 h-7  hover:bg-gray-500" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                            {links.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)} // Close menu on click
                                    className={`block ${isActive(link.to) ? "text-indigo-600 font-semibold" : "text-gray-700 dark:text-gray-400 p-1  "} hover:text-indigo-500 pl-6 transition hover:bg-gray-200 dark:hover:bg-gray-600`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                      </div>
                      )}
                  
                </div>

            </div>
        </div>
    )
}
