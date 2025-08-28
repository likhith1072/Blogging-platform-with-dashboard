import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook,BsInstagram,BsTwitter,BsGithub} from 'react-icons/bs'

export default function Footer() {
  return (
        <div className=' border border-t-6 border-teal-500 dark:border-teal-600 p-5 rounded-md m-1 mx-auto'>
        <div className=' w-full max-w-8xl mx-auto px-8'>
          <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <div className='sm:mt-5'>
              <Link to="/" className='self-center whitespace-nowrap text-md sm:text-2xl font-semibold '>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white'>Fusion </span>
               Blog
               </Link>
            </div>
            <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 mt-4 text-gray-600 text-md'>
              <div className='flex flex-col gap-4'>
                <h2 className='text-gray-600 font-semibold '>ABOUT</h2>
                 
                 <Link to="/about" target="_blank" rel="noopener no referrer" className='hover:underline'>Fusion Blog</Link>
              </div>
              <div className='flex flex-col gap-4 '>
                <h2 className='text-gray-600 font-semibold '>FOLLOW US</h2>
                 <Link to="https://github.com/likhith1072" target="_blank" rel="noopener no referrer" className='hover:underline'>GitHub</Link>
                 <Link to="https://x.com/LVarunsai" target="_blank" rel="noopener no referrer" className='hover:underline'>Twitter</Link>
              </div>
              <div className='flex flex-col gap-4 '>
                <h2 className='text-gray-600 font-semibold '>LEGAL</h2>
                 <Link to="/dashboard?tab=dash" target="_blank" rel="noopener no referrer" className='hover:underline'>Privacy Policy</Link>
                 <Link to="/dashboard?tab=dash" target="_blank" rel="noopener no referrer" className='hover:underline'>Terms & Conditions</Link>
              </div>
            </div>
          </div>
          <div className='bg-gray-100 dark:bg-gray-500 w-full h-[2px] mt-5'></div>
          <div className=' text-gray-600 flex gap-4 items-center justify-between mt-2'>   
            <div><span> &copy;{new Date().getFullYear()} Fusion blog</span></div> 
            <div className='flex gap-8 items-center sm:text-xl'> <BsFacebook className=' cursor-pointer'/>
           <BsInstagram className=' cursor-pointer'/>
           <BsTwitter className=' cursor-pointer'/>
           <BsGithub className='cursor-pointer'/></div>
           
          </div>
        </div>
        </div>
  )
}
