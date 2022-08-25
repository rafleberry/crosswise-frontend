import styled from 'styled-components'

const Divider = styled.div<{ width?: string }>`
  background: #c4c4c4;
  opacity: 0.1;
  width: ${({ width }) => width || '100%'};
`
export const HorizontalDivider = styled(Divider)`
  height: 1px;
`
export const VerticalDivider = styled(Divider)`
  width: 1px;
`
