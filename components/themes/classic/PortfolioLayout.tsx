'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Mail, MapPin, ExternalLink, Star, Briefcase, GraduationCap, Award, ExternalLink as LinkIcon } from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import type { PortfolioData, Skill } from '@/types/portfolio'
import ContactForm from '@/components/themes/shared/ContactForm'
import ResumeButton from '@/components/themes/shared/ResumeButton'
import ToolIcon, { DARK_BLOOM } from '@/components/themes/shared/ToolIcon'
import { externalUrl } from '@/lib/url'
import { APP_NAME } from '@/lib/config'

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
  const [activeSection, setActiveSection] = useState('about')
  const grouped = groupSkills(skills)
  const initials =
    profile.full_name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || profile.username[0].toUpperCase()

  const sections = [
    'about',
    ...(experience.length > 0 ? ['experience'] : []),
    ...(education.length > 0 ? ['education'] : []),
    ...(certificates.length > 0 ? ['certificates'] : []),
    ...(projects.length > 0 ? ['projects'] : []),
    ...(skills.length > 0 ? ['skills'] : []),
    'contact',
  ]

  useEffect(() => {
    const handler = () => {
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const socials = [
    { show: profile.show_github, url: profile.github_url, icon: Github, label: 'GitHub' },
    { show: profile.show_linkedin, url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { show: profile.show_website, url: profile.website_url, icon: Globe, label: 'Website' },
    { show: profile.show_twitter, url: profile.twitter_url, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.show && s.url)

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-slate-200">
      <div className="max-w-6xl mx-auto px-6 lg:flex lg:gap-12">
        {/* Sidebar */}
        <aside className="lg:w-80 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:py-16 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:flex lg:flex-col lg:h-full"
          >
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? ''}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-indigo-500/30 mb-6 animate-pulse-glow"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-6 animate-pulse-glow">
                  {initials}
                </div>
              )}
              <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
              {profile.job_title && (
                <p className="text-indigo-400 font-medium mt-1">{profile.job_title}</p>
              )}
              {profile.show_location && profile.location && (
                <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-3">
                  <MapPin size={14} /> {profile.location}
                </p>
              )}
            </div>

            {/* Nav */}
            <nav className="hidden lg:flex flex-col gap-1 mt-10">
              {sections.map((s) => (
                <a
                  key={s}
                  href={`#${s}`}
                  className={`group flex items-center gap-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                    activeSection === s ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      activeSection === s ? 'w-12 bg-indigo-400' : 'w-6 bg-slate-700 group-hover:w-10'
                    }`}
                  />
                  {s}
                </a>
              ))}
            </nav>

            {/* Socials */}
            <div className="flex gap-3 mt-8 justify-center lg:justify-start lg:mt-auto">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={externalUrl(s.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:scale-110 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>

            <div className="flex flex-col gap-2 mt-5 items-center lg:items-start">
              {profile.show_email && (
                <a
                  href={`mailto:${(profile as { email?: string }).email ?? ''}`}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Mail size={14} /> Contact via email
                </a>
              )}
              {profile.show_resume && profile.resume_url && (
                <ResumeButton
                  username={profile.username}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:scale-105 transition-transform mt-1"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                />
              )}
            </div>
          </motion.div>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:py-16 pb-20 space-y-24">
          {/* About */}
          <motion.section
            id="about"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={sectionVariants}
            className="scroll-mt-20"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
              About
            </h2>
            <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap">
              {profile.bio || 'Welcome to my portfolio.'}
            </p>
          </motion.section>

          {/* Experience */}
          {experience.length > 0 && (
            <motion.section
              id="experience"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionVariants}
              className="scroll-mt-20"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <Briefcase size={14} /> Experience
              </h2>
              <div className="space-y-6">
                {experience.map((e) => (
                  <div key={e.id} className="relative pl-4 border-l border-indigo-500/30">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500/50 border border-indigo-400" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{e.role}</div>
                        <div className="text-indigo-400 text-sm">{e.company}</div>
                      </div>
                      <div className="text-xs text-slate-500 shrink-0">
                        {e.start_date?.slice(0, 7)} — {e.is_current ? 'Present' : e.end_date?.slice(0, 7)}
                      </div>
                    </div>
                    {e.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{e.description}</p>}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <motion.section
              id="education"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionVariants}
              className="scroll-mt-20"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <GraduationCap size={14} /> Education
              </h2>
              <div className="space-y-6">
                {education.map((e) => (
                  <div key={e.id} className="relative pl-4 border-l border-indigo-500/30">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500/50 border border-indigo-400" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{e.degree}{e.field ? ` · ${e.field}` : ''}</div>
                        <div className="text-indigo-400 text-sm">{e.institution}</div>
                        {e.gpa && <div className="text-slate-500 text-xs mt-0.5">GPA: {e.gpa}</div>}
                      </div>
                      <div className="text-xs text-slate-500 shrink-0">
                        {e.start_date?.slice(0, 7)}{e.end_date ? ` — ${e.end_date.slice(0, 7)}` : ''}
                      </div>
                    </div>
                    {e.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{e.description}</p>}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <motion.section
              id="certificates"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionVariants}
              className="scroll-mt-20"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                <Award size={14} /> Certificates
              </h2>
              <div className="space-y-3">
                {certificates.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-sm text-slate-400">{c.issuer}{c.issued_date ? ` · ${c.issued_date.slice(0, 7)}` : ''}</div>
                    </div>
                    {c.credential_url && (
                      <a href={externalUrl(c.credential_url)} target="_blank" rel="noopener noreferrer"
                        className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0 ml-4">
                        <LinkIcon size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.section
              id="projects"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionVariants}
              className="scroll-mt-20"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {p.title}
                          </h3>
                          {p.is_featured && (
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        {p.description && (
                          <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {p.description}
                          </p>
                        )}
                        {p.tech_stack?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {p.tech_stack.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-1 text-xs rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {p.github_url && (
                          <a
                            href={externalUrl(p.github_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub repo"
                            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {p.project_url && (
                          <a
                            href={externalUrl(p.project_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live project"
                            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <motion.section
              id="skills"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={sectionVariants}
              className="scroll-mt-20"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">
                Skills
              </h2>
              <div className="space-y-6">
                {Object.entries(grouped).map(([cat, catSkills]) => (
                  <div key={cat}>
                    <h3 className="text-sm font-medium text-slate-400 mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((s) => (
                        <span
                          key={s.id}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 hover:border-indigo-500/40 hover:text-indigo-300 transition-colors"
                        >
                          {profile.show_skill_logos !== false && <ToolIcon name={s.name} className="w-4 h-4" imgClassName={DARK_BLOOM} />}
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Contact */}
          <motion.section
            id="contact"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={sectionVariants}
            className="scroll-mt-20"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Contact
            </h2>
            <p className="text-slate-400 mb-6">
              Have a question or want to work together? Drop me a message.
            </p>
            <div className="rounded-2xl p-6 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <ContactForm username={profile.username} accent="#6366f1" variant="dark" />
            </div>
          </motion.section>

          <footer className="text-sm text-slate-600 pt-8 border-t border-white/5">
            © {new Date().getFullYear()} {profile.full_name}. Built with {APP_NAME}.
          </footer>
        </div>
      </div>
    </main>
  )
}
