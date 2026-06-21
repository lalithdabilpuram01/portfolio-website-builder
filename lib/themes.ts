import type { ComponentType } from 'react'
import type { PortfolioData } from '@/types/portfolio'

const themeMap: Record<string, () => Promise<{ default: ComponentType<PortfolioData> }>> = {
  classic: () => import('@/components/themes/classic/PortfolioLayout'),
  minimal: () => import('@/components/themes/minimal/PortfolioLayout'),
  bold:    () => import('@/components/themes/bold/PortfolioLayout'),
  eclipse: () => import('@/components/themes/eclipse/PortfolioLayout'),
}

export async function getThemeComponent(slug: string) {
  const loader = themeMap[slug] ?? themeMap['classic']
  const mod = await loader()
  return mod.default
}
