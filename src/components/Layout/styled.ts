import styled from 'styled-components'
import Container from './Container'

export const StyledPage = styled(Container)<{ isMobile?: boolean }>`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;
  /* background-image: url('/images/home/planets/planet-pluto.png');
  background-repeat: no-repeat;
  background-position: bottom center; */
  padding: ${({ isMobile }) => `0 ${isMobile ? 10 : 24}px`};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`
