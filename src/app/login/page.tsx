'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'workhardbitch') {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/goals')
    } else {
      alert('Access Denied')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center">
        {/* Logo Mark */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold serif-title text-[#191919]">
            Life<span className="text-[#1a8917]">.</span>
          </h1>
        </div>

        <h2 className="text-2xl font-medium text-[#191919] mb-8">Access the Journal</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider block text-left ml-1">
              Secret Key
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-b border-gray-200 px-4 py-4 text-[#191919] outline-none focus:border-[#1a8917] transition-all placeholder:text-gray-300"
              autoFocus
            />
          </div>

          <button className="w-full bg-[#191919] hover:bg-black text-white py-3 rounded-full font-medium transition-all active:scale-[0.98]">
            Continue
          </button>
        </form>

        <p className="mt-12 text-sm text-gray-400 font-serif italic">
          Authorized access only for Akshat.
        </p>
      </div>
    </div>
  )
}