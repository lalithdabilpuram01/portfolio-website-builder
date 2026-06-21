'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate,
} from 'framer-motion'
import { Globe, MapPin, ArrowUpRight, ExternalLink, Mail, ArrowDown } from 'lucide-react'
import { Github, Linkedin, Twitter } from '@/components/icons/Brand'
import type { PortfolioData, Profile, Skill } from '@/types/portfolio'
import ContactForm from '@/components/themes/shared/ContactForm'
import ResumeButton from '@/components/themes/shared/ResumeButton'
import ToolIcon, { DARK_BLOOM } from '@/components/themes/shared/ToolIcon'
import { externalUrl } from '@/lib/url'

const BLUE = '#2a6fb6'
const RED = '#cd4747'
const EASE = [0.22, 1, 0.36, 1] as const

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

/* ---------------------------------------------------------------- Intro ---- */
function EclipseIntro({ name }: { name: string }) {
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      const skip = requestAnimationFrame(() => setDone(true))
      return () => cancelAnimationFrame(skip)
    }
    let raf = 0
    const start = performance.now()
    const duration = 1500
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else raf = requestAnimationFrame(() => setTimeout(() => setDone(true), 350) as unknown as number)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
          initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="eclipse-font-display text-2xl md:text-3xl font-semibold text-white"
            >
              {name}
            </motion.div>
          </div>
          <div className="mt-6 eclipse-font-display text-6xl md:text-7xl font-bold tabular-nums">
            <span className="eclipse-gradient-text">{count}</span><span className="text-slate-600">%</span>
          </div>
          <div className="mt-8 h-px w-48 bg-white/10 overflow-hidden">
            <div className="h-full" style={{ width: `${count}%`, background: `linear-gradient(90deg, ${BLUE}, ${RED})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------- 3D tilt avatar ---- */
function TiltAvatar({ src, letter, name, size }: { src: string | null; letter: string; name: string; size: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(my, [-0.5, 0.5], ['0%', '100%'])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() { mx.set(0); my.set(0) }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      className="group relative shrink-0 animate-float [transform-style:preserve-3d]"
    >
      <div className="absolute -inset-4 rounded-[1.75rem] blur-2xl opacity-50" style={{ background: `linear-gradient(135deg, ${BLUE}, ${RED})` }} />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className={`relative ${size} rounded-[1.75rem] object-cover border border-white/15`} />
      ) : (
        <div className={`relative ${size} rounded-[1.75rem] flex items-center justify-center text-6xl font-bold text-white border border-white/15 eclipse-font-display`} style={{ background: `linear-gradient(135deg, ${BLUE}, ${RED})` }}>
          {letter}
        </div>
      )}
      <motion.div className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: glare }} />
    </motion.div>
  )
}

/* ------------------------------------------------------- magnetic button --- */
function Magnetic({ href, className, children, style }: { href: string; className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 15 })
  const y = useSpring(my, { stiffness: 200, damping: 15 })
  const ref = useRef<HTMLAnchorElement>(null)

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35)
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35)
  }
  function onLeave() { mx.set(0); my.set(0) }

  return (
    <motion.a ref={ref} href={href} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y, ...style }} className={className}>
      {children}
    </motion.a>
  )
}

/* --------------------------------------------- cursor-spotlight card ------- */
function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-[#2a6fb6]/50 ${className ?? ''}`}
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(42,111,182,0.18), transparent 70%)' }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/* --------------------------------------------- left-aligned section head --- */
function SectionHeader({ index, label, title }: { index: string; label: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-sm" style={{ color: BLUE }}>{index}</span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">{label}</span>
      </div>
      <h2 className="eclipse-font-display text-3xl md:text-4xl font-bold">
        <span className="eclipse-gradient-text">{title}</span>
      </h2>
      <motion.div
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}
        className="h-[2px] w-24 mt-4 origin-left rounded-full" style={{ background: `linear-gradient(90deg, ${BLUE}, ${RED})` }}
      />
    </div>
  )
}

export default function PortfolioLayout({ profile, projects, skills, experience, education, certificates }: PortfolioData) {
  const grouped = groupSkills(skills)
  const email = (profile as Profile & { email?: string }).email
  const displayName = profile.full_name ?? profile.username

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  const cursorRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
        cursorRef.current.style.transform = `translate(${x - 250}px, ${y - 250}px)`
      }
      const nx = (x / window.innerWidth - 0.5) * 2
      const ny = (y / window.innerHeight - 0.5) * 2
      if (blob1Ref.current) blob1Ref.current.style.transform = `translate(${nx * 35}px, ${ny * 35}px)`
      if (blob2Ref.current) blob2Ref.current.style.transform = `translate(${-nx * 35}px, ${-ny * 35}px)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const socials = [
    { show: profile.show_github, url: profile.github_url, icon: Github, label: 'GitHub' },
    { show: profile.show_linkedin, url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
    { show: profile.show_website, url: profile.website_url, icon: Globe, label: 'Website' },
    { show: profile.show_twitter, url: profile.twitter_url, icon: Twitter, label: 'Twitter' },
  ].filter((s) => s.show && s.url)

  const order = [
    profile.bio ? 'about' : null,
    skills.length > 0 ? 'skills' : null,
    experience.length > 0 ? 'experience' : null,
    projects.length > 0 ? 'projects' : null,
    education.length > 0 ? 'education' : null,
    certificates.length > 0 ? 'certificates' : null,
    'contact',
  ].filter(Boolean) as string[]
  const idx = (key: string) => String(order.indexOf(key) + 1).padStart(2, '0')

  return (
    <main className="relative min-h-screen bg-[#050505] text-slate-200 eclipse-font-body overflow-hidden">
      <EclipseIntro name={displayName} />

      <motion.div style={{ scaleX, background: `linear-gradient(90deg, ${BLUE}, #a855f7, ${RED})` }} className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[70]" />

      <div ref={cursorRef} aria-hidden className="pointer-events-none fixed top-0 left-0 z-30 w-[500px] h-[500px] rounded-full opacity-0 transition-opacity duration-500 hidden md:block" style={{ background: `radial-gradient(circle, rgba(42,111,182,0.10), transparent 60%)`, mixBlendMode: 'screen' }} />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(42,111,182,0.12) 0%, transparent 45%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 90% 80%, rgba(205,71,71,0.12) 0%, transparent 45%)' }} />
      </div>

      {/* ============================ HERO ============================ */}
      <section className="relative z-10 min-h-screen flex items-center px-6">
        <div ref={blob1Ref} className="absolute will-change-transform" style={{ top: '14%', left: '6%' }}>
          <div className="w-[420px] h-[420px] rounded-full blur-3xl opacity-25 animate-eclipse-blob" style={{ background: `radial-gradient(circle, ${BLUE}, transparent 70%)` }} />
        </div>
        <div ref={blob2Ref} className="absolute will-change-transform" style={{ bottom: '12%', right: '8%' }}>
          <div className="w-[480px] h-[480px] rounded-full blur-3xl opacity-20 animate-eclipse-blob" style={{ background: `radial-gradient(circle, ${RED}, transparent 70%)`, animationDelay: '5s' }} />
        </div>

        {/* Cohesive cluster: details + avatar sitting together */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10">
          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for work
            </motion.div>

            <div className="overflow-hidden pb-1">
              <motion.h1
                initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
                className="eclipse-font-display text-4xl md:text-6xl font-bold tracking-tight"
              >
                <span className="eclipse-gradient-text">{displayName}</span>
              </motion.h1>
            </div>

            {profile.job_title && (
              <div className="overflow-hidden mt-2">
                <motion.p
                  initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 1.25 }}
                  className="text-lg md:text-xl font-light text-slate-300"
                >
                  {profile.job_title}
                </motion.p>
              </div>
            )}

            {profile.show_location && profile.location && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 1.35 }}
                className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-slate-500 mt-3"
              >
                <MapPin size={14} /> {profile.location}
              </motion.p>
            )}

            {profile.bio && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.45 }}
                className="text-slate-400 leading-relaxed mt-5 line-clamp-3 whitespace-pre-wrap"
              >
                {profile.bio}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.55 }}
              className="flex items-center justify-center md:justify-start gap-3 flex-wrap mt-7"
            >
              <Magnetic
                href="#contact"
                className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${BLUE}, #3d8fd9)` }}
              >
                <span className="relative z-10">Get in touch</span>
                <span className="pointer-events-none absolute top-0 left-0 h-full w-1/3 bg-white/25 blur-md animate-eclipse-shine" />
              </Magnetic>
              {profile.show_resume && profile.resume_url && (
                <ResumeButton
                  username={profile.username}
                  label="Resume"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-colors"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 1.65 }}
              className="flex items-center justify-center md:justify-start gap-3 flex-wrap mt-5"
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
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 transition-all backdrop-blur-sm"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${BLUE}aa`)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
                  >
                    <Icon size={17} />
                  </a>
                )
              })}
              {profile.show_email && email && (
                <a href={`mailto:${email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 transition-all backdrop-blur-sm">
                  <Mail size={17} />
                </a>
              )}
            </motion.div>
          </div>

          {/* Avatar (slightly smaller, tilt-interactive) */}
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}>
            <TiltAvatar src={profile.avatar_url} letter={displayName[0].toUpperCase()} name={displayName} size="w-40 h-40 md:w-52 md:h-52" />
          </motion.div>
        </div>

        <motion.a
          href="#content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-white transition-colors animate-float" aria-label="Scroll down"
        >
          <ArrowDown size={26} />
        </motion.a>
      </section>

      <div className="relative z-10 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #2a6fb6, #a855f7, #cd4747, transparent)' }} />

      <div id="content" className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 space-y-28">
        {/* ABOUT */}
        {profile.bio && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('about')} label="Intro" title="About" />
            <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap font-light max-w-2xl">{profile.bio}</p>
          </motion.section>
        )}

        {/* SKILLS (logo-tile grid, with brand-color bloom on hover) */}
        {skills.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('skills')} label="Stack" title="Skills & Tools" />
            <div className="space-y-8">
              {Object.entries(grouped).map(([cat, catSkills]) => (
                <div key={cat}>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">{cat}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catSkills.map((s) => (
                      <motion.div
                        key={s.id}
                        whileHover={{ y: -4 }}
                        className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 overflow-hidden hover:border-[#2a6fb6]/50 hover:bg-white/[0.06] transition-colors"
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(120px circle at center, rgba(42,111,182,0.18), transparent 70%)' }} />
                        {profile.show_skill_logos !== false && <ToolIcon name={s.name} className="w-6 h-6" imgClassName={DARK_BLOOM} />}
                        <span className="relative text-sm text-slate-200 truncate">{s.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('experience')} label="Career" title="Experience" />
            <div className="relative pl-8 border-l border-white/10 space-y-10">
              {experience.map((e, i) => (
                <motion.div key={e.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="relative">
                  <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full ring-4 ring-[#050505]" style={{ background: BLUE }} />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div className="eclipse-font-display text-lg font-semibold text-white">{e.role}</div>
                    <div className="text-xs text-slate-500 shrink-0">{e.start_date?.slice(0, 7)} — {e.is_current ? 'Present' : e.end_date?.slice(0, 7)}</div>
                  </div>
                  <div className="text-sm" style={{ color: BLUE }}>{e.company}</div>
                  {e.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('projects')} label="Work" title="Projects" />
            <div className="grid sm:grid-cols-2 gap-5">
              {projects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <SpotlightCard className="h-full p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="eclipse-font-display text-lg font-semibold text-white">{p.title}</h3>
                      <div className="flex gap-2 shrink-0 text-slate-400">
                        {p.github_url && (
                          <a href={externalUrl(p.github_url)} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors"><Github size={18} /></a>
                        )}
                        {p.project_url && (
                          <a href={externalUrl(p.project_url)} target="_blank" rel="noopener noreferrer" aria-label="Live" className="hover:text-white transition-colors"><ArrowUpRight size={18} /></a>
                        )}
                      </div>
                    </div>
                    {p.description && <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.description}</p>}
                    {p.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('education')} label="Studies" title="Education" />
            <div className="relative pl-8 border-l border-white/10 space-y-10">
              {education.map((e, i) => (
                <motion.div key={e.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="relative">
                  <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full ring-4 ring-[#050505]" style={{ background: RED }} />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div className="eclipse-font-display text-lg font-semibold text-white">{e.degree}{e.field ? ` · ${e.field}` : ''}</div>
                    <div className="text-xs text-slate-500 shrink-0">{e.start_date?.slice(0, 7)}{e.end_date ? ` — ${e.end_date.slice(0, 7)}` : ''}</div>
                  </div>
                  <div className="text-sm" style={{ color: RED }}>{e.institution}</div>
                  {e.gpa && <div className="text-xs text-slate-500 mt-0.5">GPA: {e.gpa}</div>}
                  {e.description && <p className="text-slate-400 text-sm mt-2 leading-relaxed">{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CERTIFICATES */}
        {certificates.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
            <SectionHeader index={idx('certificates')} label="Credentials" title="Certificates" />
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map((c) => (
                <div key={c.id} className="rounded-2xl p-5 border border-white/10 flex items-start justify-between gap-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="min-w-0">
                    <div className="text-white font-medium">{c.name}</div>
                    <div className="text-slate-500 text-sm">{c.issuer}{c.issued_date ? ` · ${c.issued_date.slice(0, 7)}` : ''}</div>
                  </div>
                  {c.credential_url && (
                    <a href={externalUrl(c.credential_url)} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors shrink-0"><ExternalLink size={16} /></a>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CONTACT */}
        <motion.section id="contact" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="scroll-mt-20">
          <SectionHeader index={idx('contact')} label="Say hi" title="Let's Connect" />
          <p className="text-slate-400 mb-8 max-w-lg">Got an idea, a role, or a problem worth solving? Drop me a message.</p>
          <div className="rounded-2xl p-6 md:p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <ContactForm username={profile.username} accent={BLUE} variant="dark" />
          </div>
        </motion.section>

        <footer className="text-center text-slate-600 text-sm pt-8 border-t border-white/5">© {new Date().getFullYear()} {displayName}</footer>
      </div>
    </main>
  )
}
