import React from 'react'
import { useLocation } from 'react-router-dom'
import { Heading } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
import { StyledNav, HeadLine, SubHeadLine } from './styled'

const getActiveIndex = (pathname: string): number => {
  if (pathname.includes('/pool') || pathname.includes('/create') || pathname.includes('/liquidity')) {
    return 1
  }
  if (pathname.includes('/bridge')) return 2
  if (pathname.includes('/limit-orders')) return 3
  return 0
}

interface NavProps {
  title?: string
  subTitle?: string
}

const Nav = ({ title, subTitle }: NavProps) => {
  const location = useLocation()
  const { t } = useTranslation()

  const getTabHead = (activeIndex: number): string => {
    if (activeIndex === 1) {
      return t('Liquidity')
    }
    if (activeIndex === 2) {
      return t('Bridge')
    }
    if (activeIndex === 3) {
      return t('Limit')
    }
    return t('Exchange')
  }

  return (
    <StyledNav>
      <Heading>
        <HeadLine>{title ?? getTabHead(getActiveIndex(location.pathname))}</HeadLine>
        <SubHeadLine>{subTitle}</SubHeadLine>
      </Heading>
    </StyledNav>
  )
}

export default Nav
