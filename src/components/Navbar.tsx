'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation' // Add usePathname

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname() // This will change every time you navigate

  useEffect(() => {
    // This runs every time the URL changes (e.g., going from /login to /goals)
    const authStatus = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(authStatus)
  }, [pathname]) // Adding pathname here is the secret sauce

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold tracking-tight serif-title text-[#191919]">
        Life<span className="text-[#1a8917]">.</span>
      </Link>
      
      <div className="flex items-center gap-4 sm:gap-8 text-[13px] sm:text-[14px] font-medium text-gray-500">
        <Link href="/portfolio" className="hover:text-black transition-colors">Portfolio</Link>
        <Link href="/public-logs" className="hover:text-black transition-colors hidden sm:block">Public Logs</Link>
        
        {!isLoggedIn ? (
          <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
            Login
          </Link>
        ) : (
          <>
            <Link href="/goals" className="hover:text-black transition-colors">Targets</Link>
            <Link href="/blogs" className="hover:text-black transition-colors">Admin Logs</Link>
            
            <div className="h-4 w-[1px] bg-gray-200 hidden md:block" />

            <Link 
              href="/portfolio/edit" 
              className="text-[11px] font-bold uppercase tracking-widest text-[#1a8917] hover:text-[#156d12]"
            >
              Edit Profile
            </Link>

            <button 
              onClick={handleSignOut}
              className="text-gray-400 hover:text-red-600 text-[11px] font-bold uppercase tracking-widest"
            >
              Sign Out
            </button>

            <Link 
              href="/blogs/new" 
              className="hidden md:block bg-[#1a8917] text-white px-4 py-2 rounded-full text-sm"
            >
              Write
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}