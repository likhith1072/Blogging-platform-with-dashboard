import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>About Fusion Blog</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>Welcome to Fusion Blog This blog was created as a personal project to share thoughts and ideas with the World .</p>
            <p>On this blog, you'll find weekly articles and tutorials on topics such as web development, software engineering, and programming languagues. so be sure to check back often for new content</p>
            <p>We encorage you to leave comments on our posts and engage with ohter readers. You can like other people's comments and reply to them as well. We believe that community of learners can help each other grow and improve. </p>
            <p>We hope you enjoy reading our blog as much as we enjoy writing it. If you have any questions or suggestions for future posts, please feel free to reach out to us.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
