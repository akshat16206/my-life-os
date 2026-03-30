'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

// --- Interfaces for Vercel TypeScript Check ---
interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string[];
  sort_order?: number;
}

interface Project {
  id: number;
  title: string;
  link: string;
  description: string;
}

interface Skill {
  id: number;
  skill_name: string;
}

export default function EditPortfolio() {
  const [profile, setProfile] = useState<any>({ 
    full_name: '', bio: '', image_url: '', cv_link: '', 
    twitter_url: '', github_url: '', linkedin_url: '' 
  })
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    // SECURITY GUARD: Redirect to login if not authenticated
    const authStatus = localStorage.getItem('isLoggedIn')
    if (authStatus !== 'true') {
      router.push('/login')
    } else {
      fetchData()
    }
  }, [router])

  async function fetchData() {
    try {
      const [prof, exp, proj, sk] = await Promise.all([
        supabase.from('portfolio_profile').select('*').single(),
        supabase.from('portfolio_experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('portfolio_projects').select('*').order('id', { ascending: false }),
        supabase.from('portfolio_skills').select('*').order('id', { ascending: true })
      ])
      
      if (prof.data) setProfile(prof.data)
      if (exp.data) setExperiences(exp.data)
      if (proj.data) setProjects(proj.data)
      if (sk.data) setSkills(sk.data)
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) return
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(fileName)
      setProfile({ ...profile, image_url: data.publicUrl })
    } catch (error) {
      alert('Error uploading image! Check your Supabase bucket settings.')
    } finally {
      setUploading(false)
    }
  }

  const formatImageUrl = (url: string) => {
    if (url && url.includes('dropbox.com')) {
      return url.replace('?dl=0', '?raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    }
    return url
  }

  async function saveProfile() {
    const formattedProfile = { ...profile, image_url: formatImageUrl(profile.image_url) }
    const { error } = await supabase.from('portfolio_profile').upsert(formattedProfile)
    if (!error) {
      setProfile(formattedProfile)
      alert('Profile updated successfully.')
    }
  }

  // --- Logic Helpers ---
  async function addSkill() {
    const { data, error } = await supabase.from('portfolio_skills').insert([{ skill_name: 'New Skill' }]).select()
    if (!error && data) setSkills([...skills, data[0]])
  }

  async function updateSkill(id: number, name: string) {
    setSkills(skills.map(s => s.id === id ? { ...s, skill_name: name } : s))
    await supabase.from('portfolio_skills').update({ skill_name: name }).eq('id', id)
  }

  async function deleteSkill(id: number) {
    const { error } = await supabase.from('portfolio_skills').delete().eq('id', id)
    if (!error) setSkills(skills.filter(s => s.id !== id))
  }

  async function addExperience() {
    const newExp = { company: 'New Institution', role: 'Researcher', duration: 'Month YYYY', description: ['New accomplishment'], sort_order: experiences.length }
    const { data, error } = await supabase.from('portfolio_experience').insert([newExp]).select()
    if (!error && data) setExperiences([...experiences, data[0]])
  }

  async function deleteExperience(id: number) {
    if (!confirm('Permanently remove this work experience?')) return
    const { error } = await supabase.from('portfolio_experience').delete().eq('id', id)
    if (!error) setExperiences(experiences.filter(exp => exp.id !== id))
  }

  async function updateExperience(id: number, field: keyof Experience, value: any) {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp))
    await supabase.from('portfolio_experience').update({ [field]: value }).eq('id', id)
  }

  async function addProject() {
    const newProj = { title: 'New Project', link: '#', description: 'Built an end-to-end pipeline...' }
    const { data, error } = await supabase.from('portfolio_projects').insert([newProj]).select()
    if (!error && data) setProjects([data[0], ...projects])
  }

  async function deleteProject(id: number) {
    if (!confirm('Remove project?')) return
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id)
    if (!error) setProjects(projects.filter(proj => proj.id !== id))
  }

  async function updateProject(id: number, field: keyof Project, value: string) {
    setProjects(projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj) as Project[])
    await supabase.from('portfolio_projects').update({ [field]: value }).eq('id', id)
  }

  if (loading) return <div className="p-20 text-center font-serif italic text-gray-400">Verifying Identity...</div>

  return (
    <div className="max-w-[800px] mx-auto pt-12 pb-24 px-6">
      <div className="flex justify-between items-center mb-16 border-b border-gray-100 pb-8">
        <h1 className="text-3xl font-bold serif-title text-[#191919]">Portfolio Manager</h1>
        <button onClick={saveProfile} className="bg-[#1a8917] text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-[#156d12] transition-all">
          Save Profile
        </button>
      </div>

      <section className="mb-20 space-y-8">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Core Identity</h2>
        
        <div className="flex flex-col sm:flex-row gap-8 items-center bg-gray-50 p-8 rounded-3xl mb-8 border border-gray-100">
          <div className="relative group w-32 h-32 flex-shrink-0">
            <img src={profile.image_url || "/my_image.jpg"} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md transition-all bg-gray-200" alt="Preview" />
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-black/40 text-white rounded-full">
              {uploading ? '...' : 'Upload'}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
          </div>
          
          <div className="flex-grow w-full space-y-4">
            <input placeholder="Full Name" className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none text-sm font-bold" value={profile.full_name || ''} onChange={e => setProfile({...profile, full_name: e.target.value})} />
            <input placeholder="CV Link" className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none text-sm" value={profile.cv_link || ''} onChange={e => setProfile({...profile, cv_link: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="GitHub URL" className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={profile.github_url || ''} onChange={e => setProfile({...profile, github_url: e.target.value})} />
          <input placeholder="LinkedIn URL" className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={profile.linkedin_url || ''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} />
          <input placeholder="Twitter URL" className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={profile.twitter_url || ''} onChange={e => setProfile({...profile, twitter_url: e.target.value})} />
          <input placeholder="Direct Image URL" className="p-4 bg-gray-50 rounded-xl outline-none text-sm" value={profile.image_url || ''} onChange={e => setProfile({...profile, image_url: e.target.value})} />
        </div>
        
        <textarea placeholder="Bio & Research Interests" rows={4} className="w-full bg-gray-50 p-6 rounded-2xl outline-none font-serif text-lg leading-relaxed" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
      </section>

      {/* Skills, Experience, and Projects sections */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Technical Stack</h2>
          <button onClick={addSkill} className="text-[#1a8917] text-xs font-bold hover:underline tracking-widest">+ ADD SKILL</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map(skill => (
            <div key={skill.id} className="group relative bg-white border border-gray-100 px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#1a8917]/30 transition-all">
              <input className="bg-transparent text-sm font-medium outline-none text-gray-700 w-24" value={skill.skill_name || ''} onChange={e => updateSkill(skill.id, e.target.value)} />
              <button onClick={() => deleteSkill(skill.id)} className="text-gray-300 hover:text-red-500 text-xs font-bold transition-colors">×</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Work Experience</h2>
          <button onClick={addExperience} className="text-[#1a8917] text-xs font-bold hover:underline tracking-widest">+ ADD ROLE</button>
        </div>
        <div className="space-y-8">
          {experiences.map(exp => (
            <div key={exp.id} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 group relative transition-all hover:border-gray-200">
              <button onClick={() => deleteExperience(exp.id)} className="absolute -top-3 -right-3 bg-white border border-gray-100 text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input className="bg-transparent font-bold text-xl serif-title outline-none text-[#191919]" value={exp.role || ''} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                <input className="bg-transparent text-right text-gray-400 italic outline-none font-serif" value={exp.duration || ''} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} />
              </div>
              <input className="w-full bg-transparent text-[#1a8917] font-medium mb-4 outline-none uppercase text-xs tracking-widest" value={exp.company || ''} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
              <textarea 
                className="w-full bg-white border border-gray-100 p-4 rounded-xl text-sm font-serif text-gray-600 leading-relaxed outline-none focus:border-[#1a8917]/30"
                rows={4}
                value={exp.description?.join('\n') || ''}
                onChange={e => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Technical Projects</h2>
          <button onClick={addProject} className="text-[#1a8917] text-xs font-bold hover:underline tracking-widest">+ ADD PROJECT</button>
        </div>
        <div className="space-y-8">
          {projects.map(proj => (
            <div key={proj.id} className="p-8 border border-gray-100 rounded-3xl group hover:bg-gray-50/50 transition-all relative">
              <button onClick={() => deleteProject(proj.id)} className="absolute -top-3 -right-3 bg-white border border-gray-100 text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
              <input className="w-full text-xl font-bold serif-title mb-2 outline-none bg-transparent" value={proj.title || ''} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
              <input className="w-full text-xs text-[#1a8917] mb-4 outline-none bg-transparent font-mono" value={proj.link || ''} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
              <textarea 
                className="w-full bg-transparent border-b border-gray-100 py-2 text-[15px] text-gray-500 font-serif leading-relaxed outline-none focus:border-[#1a8917]"
                rows={3}
                value={proj.description || ''}
                onChange={e => updateProject(proj.id, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}