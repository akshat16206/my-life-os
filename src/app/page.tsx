'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-[720px] mx-auto pt-20 pb-24 px-6 text-center sm:text-left">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-6xl sm:text-7xl font-bold serif-title text-[#191919] mb-8 tracking-tighter">
          Life<span className="text-[#1a8917]">.</span>
        </h1>
        
        <p className="text-2xl sm:text-3xl font-serif text-[#292929] leading-tight mb-8">
          A personal command center for technical research, milestones, and daily intentions.
        </p>

        <div className="h-1 w-20 bg-[#1a8917] mb-12 hidden sm:block" />
      </section>

      {/* Description Section */}
      <section className="mb-16 space-y-6">
        <p className="text-lg text-gray-500 font-serif leading-relaxed">
          This platform serves as a synchronized ecosystem for documenting your journey in any Feild and makes it easy for you to manage your daily life in form of Documents , blogs events and portfolio.
        </p>
      
        <p >
          Through integrated logs, goal tracking, and scheduling, Life OS ensures 
          architectural consistency across research projects and academic goals.
        </p>
      </section>
      <div>
        <p className="text-lg text-gray-500 font-serif leading-relaxed">Build By - Akshat Gupta</p>
      </div>
      {/* Navigation Call to Action */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-gray-100">
        <Link 
          href="/portfolio" 
          className="bg-[#191919] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a8917] transition-all shadow-sm w-full sm:w-auto text-center"
        >
          View Portfolio
        </Link>
        
        <Link 
          href="/public-logs" 
          className="text-gray-500 hover:text-black font-medium text-sm transition-colors"
        >
          Read Technical Logs →
        </Link>
      </div>

      <footer className="mt-32 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-300">
        Sync Protocol v3.0 // Research & Deployment
      </footer>
    </div>
  )
}