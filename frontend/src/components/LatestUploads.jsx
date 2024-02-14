import React from 'react'

import MovieListItem from './MovieListItem'

export default function LatestUploads() {
  return (
        <div className='bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2'>
            <h1 className='font-semibold text-2xl mb-2 text-primary dark:text-white'>
                Recent Uploads
            </h1>

            <MovieListItem
             movie = 
                {{poster:'https://plus.unsplash.com/premium_photo-1706625695154-d8a6a1c275d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D',
                  title:'Captain America',
                  status:'public',
                  genres:['Action']
                }}     
             />
         </div>

    )
}


