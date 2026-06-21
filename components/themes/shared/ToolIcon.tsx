'use client'

import { useState } from 'react'

// Maps free-form skill names to Simple Icons slugs; unmatched names fall back
// to a generated monogram badge, so any tool a user adds still renders cleanly.
const ICON_ALIASES: Record<string, string> = {
  'next.js': 'nextdotjs', nextjs: 'nextdotjs', next: 'nextdotjs',
  node: 'nodedotjs', 'node.js': 'nodedotjs', nodejs: 'nodedotjs',
  'react.js': 'react', reactjs: 'react',
  vue: 'vuedotjs', 'vue.js': 'vuedotjs', vuejs: 'vuedotjs',
  nuxt: 'nuxtdotjs', 'three.js': 'threedotjs', 'express.js': 'express',
  tailwind: 'tailwindcss', 'tailwind css': 'tailwindcss', 'tailwind.css': 'tailwindcss',
  postgres: 'postgresql', 'c++': 'cplusplus', 'c#': 'csharp', 'c sharp': 'csharp',
  golang: 'go', js: 'javascript', ts: 'typescript',
  aws: 'amazonwebservices', 'amazon web services': 'amazonwebservices',
  gcp: 'googlecloud', 'google cloud': 'googlecloud',
  vscode: 'visualstudiocode', 'vs code': 'visualstudiocode',
  'github actions': 'githubactions', k8s: 'kubernetes',
}

export function toolSlug(name: string) {
  const key = name.trim().toLowerCase()
  if (ICON_ALIASES[key]) return ICON_ALIASES[key]
  return key.replace(/\+/g, 'plus').replace(/#/g, 'sharp').replace(/\./g, 'dot').replace(/[^a-z0-9]/g, '')
}

// Shared img classes for dark themes: white logo at rest (always visible on a
// dark background), blooming to its true brand color on hover of an ancestor
// with the `group` class.
export const DARK_BLOOM =
  'opacity-80 group-hover:opacity-100 [filter:brightness(0)_invert(1)] group-hover:[filter:none] transition-all duration-300'

export default function ToolIcon({
  name,
  className = 'w-5 h-5',
  imgClassName = '',
}: {
  name: string
  className?: string
  imgClassName?: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        aria-hidden
        className={`${className} shrink-0 rounded-md flex items-center justify-center text-[10px] font-bold text-white`}
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        {name.trim()[0]?.toUpperCase() ?? '?'}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/tool-icon/${toolSlug(name)}`}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      className={`${className} shrink-0 object-contain ${imgClassName}`}
    />
  )
}
