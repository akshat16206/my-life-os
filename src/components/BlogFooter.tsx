'use client'

import Link from 'next/link'

export default function BlogFooter() {
  return (
    <footer className="mt-20 pt-12 border-t border-gray-100 text-center">
      <div className="max-w-[500px] mx-auto">
        <p className="text-gray-500 font-serif italic mb-8 text-[15px] leading-relaxed">
          I'm always open to discussing.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="mailto:akshat8036@gmail.com" 
            className="bg-[#191919] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a8917] transition-all shadow-sm"
          >
            Contact Me
          </a>
          <a 
            href="https://x.com/akshat8036" 
            target="_blank"
            className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-full text-sm font-medium hover:border-black hover:text-black transition-all"
          >
            Twitter
          </a>
        </div>
        
        <div className="mt-10">
          <Link href="/portfolio" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#1a8917] transition-colors">
            View Full Portfolio
          </Link>
        </div>
      </div>
    </footer>
  )
}