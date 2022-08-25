import { Card } from '@crosswise/uikit'
import styled from 'styled-components'
import { RowBetween } from '../Layout/Row'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const TokenPairCard = styled(Card)`
  margin-right: 5px;
  background: ${({ theme }) => theme.colors.background};
`
