export type UserStatus = 'pending' | 'active' | 'suspended'
export type UserRole   = 'user' | 'admin' | 'super_admin'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  job_title: string | null
  bio: string | null
  location: string | null
  avatar_url: string | null
  github_url: string | null
  linkedin_url: string | null
  website_url: string | null
  twitter_url: string | null
  resume_url: string | null
  resume_filename: string | null
  show_github: boolean
  show_linkedin: boolean
  show_website: boolean
  show_twitter: boolean
  show_resume: boolean
  show_email: boolean
  show_location: boolean
  show_skill_logos: boolean
  selected_theme: string
  status: UserStatus
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  project_url: string | null
  github_url: string | null
  image_url: string | null
  tech_stack: string[]
  is_featured: boolean
  display_order: number
  created_at: string
}

export interface Skill {
  id: string
  user_id: string
  name: string
  category: string | null
  level: SkillLevel | null
  display_order: number
}

export interface Theme {
  id: string
  name: string
  slug: string
  description: string | null
  preview_image_url: string | null
  is_active: boolean
}

export interface Experience {
  id: string
  user_id: string
  company: string
  role: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  display_order: number
  created_at: string
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field: string | null
  start_date: string | null
  end_date: string | null
  gpa: string | null
  description: string | null
  display_order: number
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  name: string
  issuer: string
  issued_date: string | null
  expiry_date: string | null
  credential_url: string | null
  display_order: number
  created_at: string
}

export interface SiteSettings {
  id: number
  creator_name: string | null
  creator_tagline: string | null
  creator_bio: string | null
  creator_picture_url: string | null
  announcement_message: string | null
  announcement_visible: boolean
  updated_at: string
}

export interface PortfolioData {
  profile: Profile
  projects: Project[]
  skills: Skill[]
  experience: Experience[]
  education: Education[]
  certificates: Certificate[]
}

export interface AdminUserView extends Profile {
  email: string
  last_sign_in_at: string | null
  role: UserRole
}

export interface AuditLogEntry {
  id: string
  admin_id: string
  action: 'approved' | 'suspended' | 'reinstated' | 'deleted' | 'created' | 'updated'
  target_user_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}
