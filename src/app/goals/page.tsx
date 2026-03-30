'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Goal {
  id: number
  title: string
  is_completed: boolean
  created_at: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const router = useRouter()

  const fetchGoals = useCallback(async () => {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setGoals(data as Goal[])
  }, [])

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn')
    if (auth !== 'true') {
      router.push('/login')
    } else {
      fetchGoals()
    }
  }, [router, fetchGoals])

  async function addGoal() {
    if (!newGoal.trim()) return
    const { error } = await supabase.from('goals').insert([{ title: newGoal }])
    if (!error) {
      setNewGoal('')
      fetchGoals()
    }
  }

  async function deleteGoal(id: number) {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) fetchGoals()
  }

  async function toggleGoal(id: number, currentStatus: boolean) {
    const { error } = await supabase
      .from('goals')
      .update({ is_completed: !currentStatus })
      .eq('id', id)
    if (!error) fetchGoals()
  }

  async function saveEdit(id: number) {
    const { error } = await supabase
      .from('goals')
      .update({ title: editValue })
      .eq('id', id)
    if (!error) {
      setEditingId(null)
      fetchGoals()
    }
  }

  return (
    <div className="max-w-[720px] mx-auto pt-8 pb-24">
      {/* Editorial Header */}
      <div className="border-b border-gray-100 pb-12 mb-10">
        <h1 className="text-4xl font-bold serif-title text-[#191919] mb-3">Targets & Goals</h1>
        <p className="text-gray-500 text-sm italic font-serif">A record of technical milestones and daily intentions.</p>
      </div>
      
      {/* Quick Entry: Medium-style Pill Input */}
      <div className="flex gap-3 mb-12">
        <input 
          type="text" 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          className="flex-grow bg-gray-50 border-none rounded-full px-6 py-3 text-[#191919] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#1a8917] transition-all"
          placeholder="What is your next target?"
        />
        <button 
          onClick={addGoal} 
          className="bg-[#1a8917] hover:bg-[#156d12] text-white px-8 py-3 rounded-full font-medium transition-all"
        >
          Add
        </button>
      </div>

      <div className="space-y-0 divide-y divide-gray-100">
        {goals.map((goal) => (
          <div key={goal.id} className="py-6 group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-grow">
                {/* Custom Medium Checkbox */}
                <button 
                  onClick={() => toggleGoal(goal.id, goal.is_completed)}
                  className={`mt-1 w-5 h-5 flex-shrink-0 rounded-full border transition-all flex items-center justify-center
                    ${goal.is_completed ? 'bg-[#1a8917] border-[#1a8917]' : 'border-gray-300 hover:border-[#1a8917]'}`}
                >
                  {goal.is_completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  )}
                </button>

                <div className="flex-grow">
                  {editingId === goal.id ? (
                    <input 
                      className="bg-gray-50 text-[#191919] text-lg font-serif p-0 border-none outline-none w-full focus:ring-0"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(goal.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(goal.id)}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className={`text-lg transition-all duration-300 ${goal.is_completed ? "text-gray-400 line-through" : "text-[#292929] font-medium"}`}
                    >
                      {goal.title}
                    </span>
                  )}
                  
                  <div className="mt-2 text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                    Ref No. {goal.id} — {new Date(goal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              {/* Contextual Actions */}
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingId(goal.id); setEditValue(goal.title); }}
                  className="text-gray-400 hover:text-black text-xs font-semibold"
                >
                  EDIT
                </button>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-600 text-xs font-semibold"
                >
                  REMOVE
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic font-serif">
            The board is clear. No targets currently active.
          </div>
        )}
      </div>
    </div>
  )
}