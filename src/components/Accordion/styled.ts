import styled, { css, keyframes } from 'styled-components'

const expandAnimation = keyframes`
  from {
    max-height: 0px
  }
  to {
    max-height: 500px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px
  }
`
export const Wrapper = styled.div<{ expanded: boolean }>`
  padding: 0 25px;
  width: 100%;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 500ms linear forwards;
        `
      : css`
          ${collapseAnimation} 500ms linear forwards
        `};
`
