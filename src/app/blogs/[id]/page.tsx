'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import BlogFooter from '../../../components/BlogFooter'

interface Blog {
  id: number
  title: string
  content: string
  created_at: string
}

export default function PublicBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) setBlog(data as Blog)
      setLoading(false)
    }
    fetchBlog()
  }, [id])

  if (loading) return <div className="max-w-[720px] mx-auto pt-20 px-6 italic text-gray-400">Loading story...</div>
  if (!blog) return <div className="max-w-[720px] mx-auto pt-20 px-6 font-serif">Story not found.</div>

  return (
    <article className="max-w-[720px] mx-auto pt-12 pb-24 px-6">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold serif-title text-[#191919] mb-6 leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex items-center gap-3 border-y border-gray-50 py-6">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            T
          </div>
          <div className="text-sm">
            <p className="font-semibold text-[#191919]">AKSHAT GUPTA</p>
            <p className="text-gray-500 font-serif italic">
              Published on {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </header>

      {/* The Actual Content */}
      <div className="font-serif text-[18px] sm:text-[21px] leading-relaxed text-[#292929] whitespace-pre-wrap">
        {blog.content}
      </div>

      {/* Reusable Contact Section */}
      <BlogFooter />
    </article>
  )
}