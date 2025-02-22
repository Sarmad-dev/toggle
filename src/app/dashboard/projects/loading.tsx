import { Loader2 } from 'lucide-react'
import React from 'react'

const ProjectPageLoading = () => {
  return (
    <main className='min-h-screen w-full flex flex-col items-center justify-center'>
        <Loader2 className='animate-spin' />
        <p className="text-lg font-semibold">Loading Projects...</p>
    </main>
  )
}

export default ProjectPageLoading