'use client'

import { useEffect } from 'react'

import Link from 'next/link';
import { H1 } from '@/components/ui/typography/h1';

export default function Error({error}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className={'container max-md:p-0 mx-auto'}>
      <div className={'bg-content section p-8 flex flex-col justify-center'}>
        <div className={'flex flex-row w-full justify-center'}>
          <H1>500</H1>
          <div className={'border-l-2 ml-2 mr-2'}/>
          <div className={'flex flex-col justify-center'}>Something went wrong</div>
        </div>
        <div className={'flex flex-row w-full justify-center mt-8'}>Please try again later</div>
        <div className={'flex flex-row w-full justify-center mt-8'}><Link href="/">Return Home</Link></div>
      </div>
    </div>
  )
}