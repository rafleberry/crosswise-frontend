import styled from 'styled-components'
import { Flex } from '@crosswise/uikit'

export const BuyWidgetContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.gradsecondary};
  border: 1px solid rgba(224, 224, 255, 0.24);
  border-radius: 20px;
  backdrop-filter: blur(40px);
`

export const BuyWidgetBodyContainer = styled.div`
  border-top: 1px solid rgba(196, 196, 196, 0.1);
  padding: 0px 12px;
`

export const FooterPanel = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  letter-spacing: 0.035em;
  margin-bottom: 30px;
  margin-top: auto;
  text-align: center;
`

export const WarningPad = styled.div`
  background-color: ${({ theme }) => (theme.isDark ? '#282731' : theme.colors.light)};
  padding: 16px 24px;
  border-radius: 6px;
  text-align: center;
`

export const StyledHeader = styled(Flex)`
  background: ${({ theme }) => theme.colors.gradients.btngradprimary};
  height: 51px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  font-weight: 700;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: white;
`
