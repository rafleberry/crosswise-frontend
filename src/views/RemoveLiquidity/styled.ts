import styled from 'styled-components'
import { Button, Flex } from '@crosswise/uikit'

export const BorderCard = styled.div`
  // border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  @media screen and (max-width: 852px) {
    padding: 30px 0;
  }
`

export const OutlinedButton = styled(Button)`
  width: 200px;
  height: 50px;
`

export const ResponsiveFlex = styled(Flex)`
  width: 50%;
  margin: 10px;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 852px) {
    width: 100%;
  }
`
