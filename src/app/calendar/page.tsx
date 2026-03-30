'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns'

interface Event {
  id: number
  event_name: string
  event_date: string
}

export default function CalendarGridPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newEventName, setNewEventName] = useState('')
  const router = useRouter()

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase.from('events').select('*')
    if (data) setEvents(data as Event[])
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') router.push('/login')
    else fetchEvents()
  }, [router, fetchEvents])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  async function addEvent() {
    if (!newEventName) return
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const { error } = await supabase.from('events').insert([{ event_name: newEventName, event_date: dateStr }])
    if (!error) { setNewEventName(''); fetchEvents(); }
  }

  return (
    <div className="max-w-[720px] mx-auto pt-8 pb-24">
      {/* Editorial Header */}
      <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold serif-title text-[#191919]">
          {format(currentMonth, 'MMMM yyyy')}
        </h1>
        <div className="flex gap-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-gray-400 hover:text-black transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-gray-400 hover:text-black transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Minimalist Grid */}
      <div className="grid grid-cols-7 mb-12">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.event_date), day))
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isSelected = isSameDay(day, selectedDate)

          return (
            <div 
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`relative min-h-[90px] p-2 cursor-pointer border-t border-gray-50 transition-all
                ${!isCurrentMonth ? 'text-gray-200' : 'text-gray-900'}
                ${isSelected ? 'bg-emerald-50/50' : 'hover:bg-gray-50/50'}
              `}
            >
              <span className={`text-xs font-medium ${isSelected ? 'text-[#1a8917] font-bold' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {dayEvents.map(e => (
                  <div key={e.id} className="w-1.5 h-1.5 rounded-full bg-[#1a8917]/40" title={e.event_name} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Day Agenda - Medium Style */}
      <div className="border-t border-gray-100 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold serif-title text-[#191919]">
              {format(selectedDate, 'EEEE, MMM do')}
            </h3>
            <p className="text-sm text-gray-500 italic">Daily Schedule</p>
          </div>
        </div>

        {/* Medium-style Quick Entry */}
        <div className="flex gap-3 mb-10">
          <input 
            type="text" 
            placeholder="What's the plan for today?" 
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEvent()}
            className="flex-grow bg-gray-50 border-none rounded-full px-5 py-2 text-sm text-[#191919] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={addEvent} 
            className="bg-[#1a8917] hover:bg-[#156d12] text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
          >
            Add
          </button>
        </div>

        {/* Agenda List */}
        <div className="space-y-4">
          {events
            .filter(e => isSameDay(new Date(e.event_date), selectedDate))
            .map(event => (
              <div 
                key={event.id} 
                className="flex items-center justify-between py-3 border-b border-gray-50 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#1a8917]" />
                  <span className="text-[16px] text-[#292929]">{event.event_name}</span>
                </div>
                <button 
                  onClick={async () => {
                    const { error } = await supabase.from('events').delete().eq('id', event.id)
                    if (!error) fetchEvents()
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          }
          {events.filter(e => isSameDay(new Date(e.event_date), selectedDate)).length === 0 && (
            <p className="text-gray-400 text-sm italic py-4">No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  )
}