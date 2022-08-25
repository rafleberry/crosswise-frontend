import styled from 'styled-components'
import { CardBody, Flex } from '@crosswise/uikit'

export const Wrapper = styled(Flex)`
  padding: 20px 5px 10px 5px;
  height: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px;
  }
`
export const Body = styled(CardBody)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  flex: 1;
  padding: 5px;

  &:before {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background: ${({ theme }) => theme.colors.input};
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
    opacity: 0.25;
    border: 1px solid #e0e0ff3d;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px;
  }
`

export const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
    justify-content: flex-start;

    > div {
      padding: 0;
    }
  }
`

export const StyledBody = styled.div`
  ::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;
  }
  ::-webkit-scrollbar {
    width: 4px;
  }
  @media screen and (min-width: 852px) {
    max-height: 350px;
    overflow: auto;
  }
`

export const NoAccountWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 10px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`
