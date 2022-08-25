import styled from 'styled-components'
import { Text, Button, Flex } from '@crosswise/uikit'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
`
export const SubColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top: 20px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    height: 100%;
  }
`
export const TokenPairWrapper = styled.div`
  padding: 2px;
  width: 34px;
  margin-left: 20px;
`
export const StyledTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
`
export const CardContent = styled.div<{ collapse: boolean }>`
  width: 100%;
  height: ${({ collapse }) => (collapse ? '180px' : '0')};
  overflow: hidden;
  background: rgba(245, 255, 252, 0.1);

  box-shadow: ${({ theme }) => (theme.isDark ? '2px 2px 6px 0px #000000D9 inset' : theme.shadows.lightInset)};
  
  border-radius: 6px;
  padding: ${({ collapse }) => (collapse ? '30px' : '0')};
  margin: 15px 5px 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease-out;
  @media screen and (max-width: 576px) {
    margin: 15px 0px 0px 0px;
    height: ${({ collapse }) => (collapse ? '100%' : '0')};
    padding: ${({ collapse }) => (collapse ? '20px 16px 0px 16px' : '0')};
`

export const StyledText = styled(Text)`
  margin-bottom: 10px;
`
export const StyledButton = styled(Button)`
  height: 35px;
  font-size: 12px;
`
export const IconButton = styled.div`
  cursor: pointer;
  display: flex;
`
export const StyledFlex = styled(Flex)`
  @media screen and (max-width: 576px) {
    a {
      width: 100%;
    }
    button {
      width: 100%;
      height: 47px;
    }
    margin-bottom: 10px;
  }
`
export const LpCard = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 576px) {
    flex-direction: column;
  }
`
