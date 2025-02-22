import { Loader2 } from 'lucide-react'
import React from 'react'

const TeamsPageLoading = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
        <Loader2 className='animate-spin' />
        <p className="text-lg">Teams Loading...</p>
    </div>
  )
}

export default TeamsPageLoading