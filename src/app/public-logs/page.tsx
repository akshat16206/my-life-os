'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Blog {
  id: number
  title: string
  content: string
  created_at: string
  is_featured: boolean
}

export default function PublicLogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      // Order by featured first, then by date
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
      if (data) setBlogs(data as Blog[])
    }
    fetchBlogs()
  }, [])

  return (
    <div className="max-w-[720px] mx-auto pt-12 pb-24 px-6">
      <header className="mb-16 border-b border-gray-100 pb-10">
        <h1 className="text-4xl font-bold serif-title text-[#191919] mb-4">Technical Blogs</h1>
        <p className="text-gray-500 font-serif italic text-lg leading-relaxed">
          Documentation on interesting topics in Maths , machine and music.
        </p>
      </header>

      <div className="space-y-16">
        {blogs.map((blog) => (
          <article key={blog.id} className="relative group">
            {blog.is_featured && (
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#1a8917] rounded-full hidden sm:block" />
            )}
            
            <Link href={`/blogs/${blog.id}`} className="block">
              <div className="flex items-center gap-3 mb-4 text-[11px] font-bold uppercase tracking-[0.2em]">
                {blog.is_featured ? (
                  <span className="text-[#1a8917] bg-emerald-50 px-2 py-0.5 rounded">Featured Research</span>
                ) : (
                  <span className="text-gray-400">Log Entry</span>
                )}
                <span className="text-gray-200">•</span>
                <span className="text-gray-400">
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <h2 className="text-2xl font-bold serif-title text-[#191919] mb-3 group-hover:text-gray-600 transition-colors">
                {blog.title}
              </h2>
              
              <p className="text-[#757575] text-[17px] leading-relaxed font-serif line-clamp-3 mb-6">
                {blog.content}
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-[#191919]">
                <span>View Full Analysis</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}