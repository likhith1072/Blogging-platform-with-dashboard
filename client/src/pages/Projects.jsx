import React from 'react'
import CallToAction from '../components/CallToAction'

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto p-3 flex justify-center items-cneter flex-col gap-6'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Build fun and engaging projects while learning HTML, CSS and JavaScript!</p>
       <CallToAction />
    </div>
  )
}
