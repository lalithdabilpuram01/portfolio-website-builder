'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Mail, MapPin, ExternalLink, Star, ArrowDown, Briefcase, GraduationCap, Award } from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import type { PortfolioData, Skill, SkillLevel } from '@/types/portfolio'
import ContactForm from '@/components/themes/shared/ContactForm'
import ResumeButton from '@/components/themes/shared/ResumeButton'
import ToolIcon, { DARK_BLOOM } from '@/components/themes/shared/ToolIcon'
import BulletText from '@/components/themes/shared/BulletText'
import { externalUrl } from '@/lib/url'
import { APP_NAME } from '@/lib/config'

const levelWidth: Record<SkillLevel, string> = {
  beginner: '35%',
  intermediate: '60%',
  advanced: '80%',
  expert: '100%',
}

function groupSkills(skills: Skill[]) {
  const map: Record<string, Skill[]> = {}
  for (const s of skills) {
    const key = s.category || 'Other'
    if (!map[key]) map[key] = []
    map[key].push(s)
  }
  return map
}

export default function PortfolioLayout({ profile, projects, skills, experience, education, certificates }: PortfolioData) {
  const grouped = groupSkills(skills)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const socials = [
    { show: profile.show_github, url: profile.github_url, icon: Github, label: 'GitHub' },
    { show: profile.show_linkedin, url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { show: profile.show_website, url: profile.website_url, icon: Globe, label: 'Website' },
    { show: profile.show_twitter, url: profile.twitter_url, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.show && s.url)

  return (
    <main className="min-h-screen bg-[#0a0612] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 transition-transform duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, #ec4899, transparent 70%)',
            top: '10%',
            left: '5%',
            transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30 transition-transform duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
            bottom: '10%',
            right: '5%',
            transform: `translate(${-mouse.x * 30}px, ${-mouse.y * 30}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)', top: '40%', left: '50%' }}
        />

        <div className="relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.full_name ?? ''}
                className="w-28 h-28 rounded-full object-cover mx-auto mb-8 border-4 border-white/10 animate-pulse-glow"
              />
            ) : (
              <div className="w-28 h-28 rounded-full mx-auto mb-8 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-bold animate-pulse-glow">
                {profile.full_name?.[0] ?? profile.username[0].toUpperCase()}
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          >
            <span className="gradient-text animate-gradient">{profile.full_name}</span>
          </motion.h1>

          {profile.job_title && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-2xl md:text-3xl font-light text-slate-300 mb-6"
            >
              {profile.job_title}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap mb-10"
          >
            {profile.show_location && profile.location && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin size={16} /> {profile.location}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={externalUrl(s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 hover:border-pink-500/50 transition-all backdrop-blur-sm"
                >
                  <Icon size={20} />
                </a>
              )
            })}
            {profile.show_resume && profile.resume_url && (
              <ResumeButton
                username={profile.username}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
              />
            )}
          </motion.div>
        </div>

        <a
          href="#content"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-white transition-colors animate-float"
        >
          <ArrowDown size={28} />
        </a>
      </section>

      <div id="content" className="max-w-6xl mx-auto px-6 pb-24 space-y-32">
        {/* About */}
        {profile.bio && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-8 text-center">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl leading-relaxed text-slate-300 text-center max-w-3xl mx-auto whitespace-pre-wrap font-light">
              {profile.bio}
            </p>
          </motion.section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <div className="space-y-6">
              {experience.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))' }}>
                      <Briefcase size={18} className="text-pink-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{e.role}</div>
                      <div className="text-pink-400">{e.company}</div>
                      {e.description && <BulletText text={e.description} className="text-slate-400 text-sm mt-2 leading-relaxed" />}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 shrink-0 sm:text-right">
                    {e.start_date?.slice(0, 7)} — {e.is_current ? 'Present' : e.end_date?.slice(0, 7)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              My <span className="gradient-text">Education</span>
            </h2>
            <div className="space-y-6">
              {education.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))' }}>
                      <GraduationCap size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{e.degree}{e.field ? ` · ${e.field}` : ''}</div>
                      <div className="text-purple-400">{e.institution}</div>
                      {e.gpa && <div className="text-slate-500 text-sm mt-0.5">GPA: {e.gpa}</div>}
                      {e.description && <BulletText text={e.description} className="text-slate-400 text-sm mt-2 leading-relaxed" />}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 shrink-0 sm:text-right">
                    {e.start_date?.slice(0, 7)}{e.end_date ? ` — ${e.end_date.slice(0, 7)}` : ''}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              My <span className="gradient-text">Certificates</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl p-6 border border-white/10 flex items-start gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))' }}>
                    <Award size={18} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-slate-400 text-sm">{c.issuer}{c.issued_date ? ` · ${c.issued_date.slice(0, 7)}` : ''}</div>
                  </div>
                  {c.credential_url && (
                    <a href={externalUrl(c.credential_url)} target="_blank" rel="noopener noreferrer"
                      className="text-slate-500 hover:text-white transition-colors shrink-0">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl p-8 border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at top right, rgba(236,72,153,0.15), transparent 60%)' }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {p.title}
                        {p.is_featured && <Star size={18} className="text-amber-400 fill-amber-400" />}
                      </h3>
                      <div className="flex gap-2">
                        {p.github_url && (
                          <a
                            href={externalUrl(p.github_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {p.project_url && (
                          <a
                            href={externalUrl(p.project_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live"
                            className="text-slate-400 hover:text-white transition-colors"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                    {p.description && (
                      <BulletText text={p.description} className="text-slate-400 leading-relaxed mb-5" />
                    )}
                    {p.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 text-xs font-medium rounded-full text-white"
                            style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))' }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-12 text-center">
              My <span className="gradient-text">Skills</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(grouped).map(([cat, catSkills]) => (
                <div
                  key={cat}
                  className="rounded-3xl p-6 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-5">{cat}</h3>
                  <div className="space-y-4">
                    {catSkills.map((s) => (
                      <div key={s.id} className="group">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="flex items-center gap-2 text-slate-300">
                            {profile.show_skill_logos !== false && <ToolIcon name={s.name} className="w-4 h-4" imgClassName={DARK_BLOOM} />}
                            {s.name}
                          </span>
                          {s.level && (
                            <span className="text-slate-500 capitalize text-xs">{s.level}</span>
                          )}
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: s.level ? levelWidth[s.level] : '50%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #ec4899, #8b5cf6)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-black mb-4 text-center">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 text-center mb-10">
            Got an idea or opportunity? I&apos;d love to hear from you.
          </p>
          <div
            className="rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <ContactForm username={profile.username} accent="#ec4899" variant="dark" />
          </div>
        </motion.section>

        <footer className="text-center text-slate-600 text-sm flex items-center justify-center gap-2">
          {profile.show_email && <Mail size={14} />}
          © {new Date().getFullYear()} {profile.full_name}. Crafted with {APP_NAME}.
        </footer>
      </div>
    </main>
  )
}
