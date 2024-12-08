"use client"
import React from 'react'
import Link from 'next/link'
import { auth } from "@/auth"

import { signOut } from '@/auth'

import { User } from 'next-auth'
import { Button } from './ui/button'






const Navbar = async () => {

 const session = await auth()

 const user: User = session?.user as User


  return (
   <nav className='p-4 md:p-6 shadow-md'>
<div className='container mx-auto flex flex-col mdLflex-row justify-between items-center'>
 <a className="text-xl font-bold mb-4 md:mb-0" href='#'> Mystery Message </a>

 {session ? (<><span>Welcome, {user?.username || user.email}</span>
 <Button onClick={() => signOut()}></Button></>
) : (
 <Link href='/sign-in'>
  <Button>Login</Button>
 </Link>
)}


</div>

   </nav>
    
      
   
  )
}

export default Navbar
