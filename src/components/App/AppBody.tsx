import React from 'react'
import useTheme from 'hooks/useTheme'
import { BodyWrapper } from './styled'

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  return <BodyWrapper background={theme.isDark && 'tranparent'}>{children}</BodyWrapper>
}
