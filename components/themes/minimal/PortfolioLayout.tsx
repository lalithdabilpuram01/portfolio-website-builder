'use client'

import { motion } from 'framer-motion'
import { Globe, Mail, MapPin, ArrowUpRight, ExternalLink } from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import type { PortfolioData, Skill } from '@/types/portfolio'
import ContactForm from '@/components/themes/shared/ContactForm'
import ResumeButton from '@/components/themes/shared/ResumeButton'
import ToolIcon from '@/components/themes/shared/ToolIcon'
import { externalUrl } from '@/lib/url'

function groupSkills(skills: Skill[]) {
  const map: Record<string, Skill[]> = {}
  for (const s of skills) {
    const key = s.category || 'Other'
    if (!map[key]) map[key] = []
    map[key].push(s)
  }
  return map
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function PortfolioLayout({ profile, projects, skills, experience, education, certificates }: PortfolioData) {
  const grouped = groupSkills(skills)

  const socials = [
    { show: profile.show_github, url: profile.github_url, icon: Github, label: 'GitHub' },
    { show: profile.show_linkedin, url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { show: profile.show_website, url: profile.website_url, icon: Globe, label: 'Website' },
    { show: profile.show_twitter, url: profile.twitter_url, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.show && s.url)

  return (
    <main className="min-h-screen bg-[#fafaf9] text-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-24">
        {/* Hero */}
        <motion.header initial="hidden" animate="visible" variants={fade} className="mb-20">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name ?? ''}
              className="w-20 h-20 rounded-full object-cover mb-8 grayscale hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-2xl font-light text-white mb-8">
              {profile.full_name?.[0] ?? profile.username[0].toUpperCase()}
            </div>
          )}
          <h1 className="text-4xl font-light tracking-tight text-slate-900">
            {profile.full_name}
          </h1>
          {profile.job_title && (
            <p className="text-xl text-slate-500 mt-2 font-light">{profile.job_title}</p>
          )}
          {profile.show_location && profile.location && (
            <p className="flex items-center gap-1.5 text-sm text-slate-400 mt-3">
              <MapPin size={14} /> {profile.location}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-8">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={externalUrl(s.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <Icon size={16} />
                  <span className="border-b border-transparent group-hover:border-slate-900 transition-colors">
                    {s.label}
                  </span>
                </a>
              )
            })}
            {profile.show_resume && profile.resume_url && (
              <ResumeButton
                username={profile.username}
                label="Resume"
                className="group flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
              />
            )}
          </div>
        </motion.header>

        {/* About */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          className="mb-20"
        >
          <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-light">
            {profile.bio || 'Welcome to my portfolio.'}
          </p>
        </motion.section>

        {/* Experience */}
        {experience.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="mb-20">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Experience</h2>
            <div className="space-y-8">
              {experience.map((e) => (
                <div key={e.id} className="border-t border-slate-200 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-900">{e.role}</div>
                      <div className="text-slate-500 text-sm">{e.company}</div>
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">
                      {e.start_date?.slice(0, 7)} — {e.is_current ? 'Present' : e.end_date?.slice(0, 7)}
                    </div>
                  </div>
                  {e.description && <p className="text-slate-600 text-sm mt-2 leading-relaxed font-light">{e.description}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="mb-20">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Education</h2>
            <div className="space-y-8">
              {education.map((e) => (
                <div key={e.id} className="border-t border-slate-200 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-900">{e.degree}{e.field ? ` · ${e.field}` : ''}</div>
                      <div className="text-slate-500 text-sm">{e.institution}</div>
                      {e.gpa && <div className="text-slate-400 text-xs mt-0.5">GPA: {e.gpa}</div>}
                    </div>
                    <div className="text-xs text-slate-400 shrink-0">
                      {e.start_date?.slice(0, 7)}{e.end_date ? ` — ${e.end_date.slice(0, 7)}` : ''}
                    </div>
                  </div>
                  {e.description && <p className="text-slate-600 text-sm mt-2 leading-relaxed font-light">{e.description}</p>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="mb-20">
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Certificates</h2>
            <div className="space-y-px">
              {certificates.map((c) => (
                <div key={c.id} className="border-t border-slate-200 py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-slate-900 font-normal">{c.name}</div>
                    <div className="text-slate-500 text-sm font-light">{c.issuer}{c.issued_date ? ` · ${c.issued_date.slice(0, 7)}` : ''}</div>
                  </div>
                  {c.credential_url && (
                    <a href={externalUrl(c.credential_url)} target="_blank" rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-900 transition-colors shrink-0">
                      <ExternalLink size={15} />
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-20"
          >
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Selected Work</h2>
            <div className="space-y-px">
              {projects.map((p) => {
                const href = p.project_url || p.github_url
                const content = (
                  <div className="group py-6 border-t border-slate-200 flex items-start justify-between gap-6 hover:px-2 transition-all duration-300">
                    <div className="flex-1">
                      <h3 className="text-xl font-normal text-slate-900 flex items-center gap-2">
                        {p.title}
                        {href && (
                          <ArrowUpRight
                            size={18}
                            className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                          />
                        )}
                      </h3>
                      {p.description && (
                        <p className="text-slate-500 mt-2 leading-relaxed font-light">
                          {p.description}
                        </p>
                      )}
                      {p.tech_stack?.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                          {p.tech_stack.map((t) => (
                            <span key={t} className="text-xs text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
                return href ? (
                  <a key={p.id} href={externalUrl(href)} target="_blank" rel="noopener noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  <div key={p.id}>{content}</div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-20"
          >
            <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Skills</h2>
            <div className="space-y-6">
              {Object.entries(grouped).map(([cat, catSkills]) => (
                <div key={cat} className="flex flex-col sm:flex-row sm:gap-8">
                  <div className="text-sm text-slate-400 sm:w-40 shrink-0 mb-2 sm:mb-0">{cat}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {catSkills.map((s) => (
                      <span key={s.id} className="inline-flex items-center gap-1.5 text-slate-700 font-light">
                        {profile.show_skill_logos !== false && <ToolIcon name={s.name} className="w-4 h-4" />}
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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
        >
          <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-8">Get in Touch</h2>
          <ContactForm username={profile.username} accent="#0f172a" variant="light" />
        </motion.section>

        <footer className="text-sm text-slate-400 mt-20 pt-8 border-t border-slate-200 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {profile.full_name}</span>
          {profile.show_email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> Available for work
            </span>
          )}
        </footer>
      </div>
    </main>
  )
}
