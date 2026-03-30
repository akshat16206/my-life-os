'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'


interface Goal {
  id: number
  title: string
  is_completed: boolean
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState('')

  useEffect(() => {
    const fetchGoals = async () => {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setGoals(data as Goal[])
    }
    fetchGoals()
  }, [])

  async function addGoal() {
    if (!newGoal.trim()) return
    const { error } = await supabase.from('goals').insert([{ title: newGoal }])
    if (!error) {
      setNewGoal('')
      // Just a quick way to refresh the list
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">My Targets</h1>
        
        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            placeholder="Add new goal..."
          />
          <button 
            onClick={addGoal}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between">
              <span>{goal.title}</span>
              <input type="checkbox" defaultChecked={goal.is_completed} className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}