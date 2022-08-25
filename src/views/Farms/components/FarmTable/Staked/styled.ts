import styled, { css } from 'styled-components'

export const ReferenceElement = styled.div`
  display: inline-block;
`
export const LiquidityWrapper = styled.div<{ isMobile: boolean }>`
  min-width: 110px;
  font-weight: 600;
  text-align: left;

  /* ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  } */

  ${({ isMobile }) =>
    isMobile
      ? css`
          display: flex;
          /* justify-content: center; */
          align-items: center;
        `
      : css`
          /* margin-right: 14px; */
        `}
`

export const Container = styled.div`
  display: flex;
  align-items: center;
`
