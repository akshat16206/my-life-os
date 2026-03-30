'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 h-16 flex items-center justify-between">
      {/* Signature Logo */}
      <Link href="/" className="text-2xl font-bold tracking-tight serif-title text-[#191919]">
        Life<span className="text-[#1a8917]">.</span>
      </Link>
      
      {/* Navigation Links */}
      <div className="flex items-center gap-4 sm:gap-8 text-[13px] sm:text-[14px] font-medium text-gray-500">
        <Link href="/portfolio" className="hover:text-black transition-colors">Portfolio</Link>
        <Link href="/public-logs" className="hover:text-black transition-colors hidden sm:block">Public Logs</Link>
        <Link href="/goals" className="hover:text-black transition-colors">Targets</Link>
        <Link href="/blogs" className="hover:text-black transition-colors">Admin Logs</Link>
        
        {/* Decorative Separator */}
        <div className="h-4 w-[1px] bg-gray-200 hidden md:block" />

        {/* Portfolio Management Link */}
        <Link 
          href="/portfolio/edit" 
          className="text-[11px] font-bold uppercase tracking-widest text-[#1a8917] hover:text-[#156d12] transition-colors"
        >
          Edit Profile
        </Link>

        <button 
          onClick={handleSignOut}
          className="text-gray-400 hover:text-red-600 transition-colors text-[11px] font-bold uppercase tracking-widest"
        >
          Sign Out
        </button>

        <Link 
          href="/blogs/new" 
          className="hidden md:block bg-[#1a8917] hover:bg-[#156d12] text-white px-4 py-2 rounded-full text-sm font-normal transition-all"
        >
          Write
        </Link>
      </div>
    </nav>
  )
}