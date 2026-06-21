import { NextResponse, type NextRequest } from 'next/server'
import * as simpleIcons from 'simple-icons'

interface SimpleIcon {
  title: string
  slug: string
  hex: string
  path: string
}

// Build a slug -> icon lookup once (server-only; never shipped to the client).
const iconsBySlug: Map<string, SimpleIcon> = (() => {
  const map = new Map<string, SimpleIcon>()
  for (const value of Object.values(simpleIcons as Record<string, unknown>)) {
    const icon = value as Partial<SimpleIcon>
    if (icon && typeof icon.slug === 'string' && typeof icon.path === 'string') {
      map.set(icon.slug, icon as SimpleIcon)
    }
  }
  return map
})()

// Serves a brand-colored SVG for a tool by Simple Icons slug. Unknown slugs
// return 404 so the theme can fall back to its monogram badge.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const icon = iconsBySlug.get(slug.toLowerCase())

  if (!icon) return new NextResponse('Not found', { status: 404 })

  const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${icon.title}</title><path d="${icon.path}" fill="#${icon.hex}"/></svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
