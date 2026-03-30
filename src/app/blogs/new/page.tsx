'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function NewBlogPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const router = useRouter()

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  async function saveBlog() {
    if (!title || !content) return
    const { error } = await supabase.from('blogs').insert([
      { 
        title, 
        content, 
        is_featured: isFeatured 
      }
    ])
    
    if (!error) {
      router.push('/blogs')
    }
  }

  return (
    <div className="max-w-[720px] mx-auto pt-12 pb-24 px-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => router.push('/blogs')}
          className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
        >
          Back to logs
        </button>
        
        <div className="flex items-center gap-6">
          {/* Featured Toggle: Medium Style */}
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={isFeatured} 
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1a8917] focus:ring-[#1a8917] cursor-pointer"
            />
            <span className="group-hover:text-[#1a8917] transition-colors">Feature Research</span>
          </label>

          <button 
            onClick={saveBlog}
            className="bg-[#1a8917] hover:bg-[#156d12] text-white px-5 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50"
            disabled={!title || !content}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <input 
          type="text" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-[#191919] text-4xl sm:text-5xl font-bold serif-title outline-none placeholder:text-gray-200 border-none p-0"
        />

        <textarea 
          placeholder="Tell your story..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent text-[#292929] text-xl leading-relaxed font-serif outline-none placeholder:text-gray-300 resize-none border-none p-0 min-h-[500px]"
          spellCheck="false"
        />
      </div>

      {/* Subtle Hint Footer */}
      <footer className="mt-20 border-t border-gray-100 pt-8 flex justify-between items-center">
        <p className="text-gray-400 text-xs italic">
          Drafting as Akshat Gupta. Your research will be published to the public sync.
        </p>
        <div className="text-gray-400 text-xs font-mono font-medium">
          {wordCount} words
        </div>
      </footer>
    </div>
  )
}