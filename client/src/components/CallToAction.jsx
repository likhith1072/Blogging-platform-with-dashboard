import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col' >
        <h2 className='text-2xl'>Want to learn more about JavaScript?</h2>
        <p className='text-gray-500 my-4'>Checkout these resources with 100 JavaScript Projects</p>
        <button className='cursor-pointer bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 border-1 rounded-sm border-gray-400 rounded-tl-xl rounded-bl-none p-1'><a href="https://www.100jsprojects.com" target="_blank" rel='noopener noreferrer'>100 JavaScript Projects</a></button>
      </div>
      <div className='p-7 flex-1 justify-center flex items-center'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6CmNq1i35d8DeMMSvHvJ3s8_ty14CADizxQ&s" className='rounded-md'/>
      </div>
    </div>
  )
}
