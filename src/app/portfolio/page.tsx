'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Profile {
  full_name: string;
  bio: string;
  image_url: string;
  cv_link: string;
  twitter_url: string;
  github_url: string;
  linkedin_url: string;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string[];
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

export default function PortfolioPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolioData() {
      const [profRes, expRes, projRes, skillRes] = await Promise.all([
        supabase.from('portfolio_profile').select('*').single(),
        supabase.from('portfolio_experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('portfolio_projects').select('*').order('id', { ascending: false }),
        supabase.from('portfolio_skills').select('*').order('id', { ascending: true })
      ]);

      if (profRes.data) setProfile(profRes.data);
      if (expRes.data) setExperiences(expRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (skillRes.data) setSkills(skillRes.data);
      setLoading(false);
    }

    fetchPortfolioData();
  }, []);

  if (loading) return <div className="max-w-[720px] mx-auto pt-20 px-6 italic text-gray-400 font-serif">Syncing research profile...</div>;

  return (
    <div className="max-w-[720px] mx-auto pt-8 pb-24">
      {/* Header Section */}
      <header className="flex flex-col-reverse sm:flex-row justify-between items-start gap-8 mb-16 px-6 sm:px-0">
        <div className="flex-grow text-center sm:text-left w-full">
          <h1 className="text-4xl font-bold serif-title text-[#191919] mb-2">
            {profile?.full_name || 'Akshat Gupta'}
          </h1>
          <p className="text-gray-500 italic font-serif mb-6 text-sm">
            Student at Madhav Institute of Technology & Science
          </p>
          
          <div className="space-y-4 text-[17px] leading-relaxed text-[#292929] font-serif">
            <p className="whitespace-pre-wrap">{profile?.bio}</p>
          </div>
        </div>

        {/* Dynamic Profile Photo from Supabase Bucket */}
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm mx-auto sm:mx-0 bg-gray-50">
          <img 
            src={profile?.image_url || "/my_image.jpg"} 
            alt={profile?.full_name || "Profile Photo"} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if bucket URL fails or is empty
              e.currentTarget.src = "/my_image.jpg";
            }}
          />
        </div>
      </header>

      {/* Social & Contact Links */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-6 mb-16 pb-8 border-b border-gray-100 text-[12px] font-bold uppercase tracking-widest text-gray-400 px-6 sm:px-0">
        <a href="mailto:akshat8036@gmail.com" className="hover:text-[#1a8917] transition-colors">Email</a>
        {profile?.cv_link && <a href={profile.cv_link} className="hover:text-[#1a8917] transition-colors">CV</a>}
        <a href={profile?.twitter_url || "https://x.com/akshat8036"} className="hover:text-[#1a8917] transition-colors text-black font-bold">Twitter</a>
        <a href={profile?.github_url || "https://github.com/akshat16206"} className="hover:text-[#1a8917] transition-colors">GitHub</a>
        <a href={profile?.linkedin_url || "https://www.linkedin.com/in/hermits/"} className="hover:text-[#1a8917] transition-colors">LinkedIn</a>
      </div>

      {/* Technical Stack Section */}
      <section className="mb-16 px-6 sm:px-0">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Technical Stack</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.id} className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-full text-[13px] font-medium font-serif italic">
              {skill.skill_name}
            </span>
          ))}
        </div>
      </section>

      {/* Dynamic Technical Blogs Section */}
      <section className="mb-16 mx-6 sm:mx-0 p-8 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#1a8917]/20 transition-all">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 text-[#1a8917]">BLOGS</h2>
        <p className="font-serif text-[18px] text-[#292929] mb-6 leading-relaxed">
          I document my studies on neural architectures, mathematics, deep learning model deployment and new research.
        </p>
        <Link 
          href="/public-logs" 
          className="inline-flex items-center gap-2 bg-[#191919] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a8917] transition-all shadow-sm"
        >
          Read my Technical Blogs
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>

      {/* Dynamic Work Experience Section */}
      <section className="mb-16 px-6 sm:px-0">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Work Experience</h2>
        <div className="space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-6 border-l border-gray-100">
              <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[#1a8917]" />
              <div className="flex justify-between items-baseline mb-3">
                <h3 className="text-xl font-bold serif-title text-[#191919]">{exp.role}, {exp.company}</h3>
                <span className="text-xs text-gray-400 italic font-serif">{exp.duration}</span>
              </div>
              <ul className="space-y-3 text-[15px] text-gray-600 list-disc ml-4 font-serif leading-relaxed">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Projects Section */}
      <section className="mb-16 px-6 sm:px-0">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Selected Projects</h2>
        <div className="grid gap-10">
          {projects.map((project) => (
            <div key={project.id} className="group border-b border-gray-50 pb-6 last:border-0">
              <a href={project.link} className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-[#191919] group-hover:text-[#1a8917] transition-colors tracking-tight">
                  {project.title}
                </h3>
                <span className="text-xs text-gray-300 group-hover:text-[#1a8917] transition-all translate-x-0 group-hover:translate-x-1">→</span>
              </a>
              <p className="text-gray-500 text-[15px] leading-relaxed font-serif">{project.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}