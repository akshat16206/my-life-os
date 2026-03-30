'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Blog {
  id: number
  title: string
  content: string
  created_at: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const router = useRouter()

  const fetchBlogs = useCallback(async () => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setBlogs(data as Blog[])
  }, [])

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn')
    if (auth !== 'true') {
      router.push('/login')
    } else {
      fetchBlogs()
    }
  }, [router, fetchBlogs])

  async function deleteBlog(id: number) {
    if (!confirm('Delete this log?')) return
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (!error) fetchBlogs()
  }

  return (
    <div className="max-w-[720px] mx-auto pt-8">
      {/* Editorial Header */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-12 mb-8">
        <div>
          <h1 className="text-4xl font-bold serif-title text-[#191919] mb-2">My Logs</h1>
          <p className="text-gray-500 text-sm italic font-serif">Thoughts, progress, and first principles.</p>
        </div>
        <Link 
          href="/blogs/new" 
          className="bg-[#1a8917] hover:bg-[#156d12] text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
        >
          New Story
        </Link>
      </div>

      {/* The Article Feed */}
      <div className="divide-y divide-gray-100 pb-20">
        {blogs.map((blog) => (
          <div key={blog.id} className="py-10 group">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-grow">
                {/* Author Info */}
                <div className="flex items-center gap-2 mb-3 text-[13px]">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
                    T
                  </div>
                  <span className="font-semibold text-gray-800">Akshat Gupta</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Link to Public Page */}
                <Link href={`/blogs/${blog.id}`} className="block group">
                  <h2 className="text-[22px] font-bold leading-7 text-[#191919] serif-title mb-2 group-hover:text-gray-600 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-[#757575] text-[16px] leading-6 line-clamp-2 mb-4 font-serif">
                    {blog.content}
                  </p>
                </Link>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">Journal</span>
                    <button 
                      onClick={() => {
                        const url = `${window.location.origin}/blogs/${blog.id}`;
                        navigator.clipboard.writeText(url);
                        alert('Public link copied!');
                      }}
                      className="text-xs text-[#1a8917] hover:underline"
                    >
                      Share Link
                    </button>
                  </div>
                  <button 
                    onClick={() => deleteBlog(blog.id)}
                    className="text-gray-400 hover:text-red-600 text-[13px] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Minimal Image Placeholder */}
              <div className="hidden sm:block w-28 h-28 bg-gray-50 rounded-sm border border-gray-100 flex-shrink-0" />
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic font-serif">
            Your story hasn't started yet.
          </div>
        )}
      </div>
    </div>
  )
}