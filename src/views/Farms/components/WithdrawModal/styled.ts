import styled, { css, keyframes } from 'styled-components'
import { Flex, Text } from '@crosswise/uikit'
import ExpandButton, { ChevronDownIcon as ChevronDown } from '../FarmTable/ExpandButton'

export const ExpandMainInfoButton = styled.div`
  position: absolute;
  right: 0;
  cursor: pointer;
  top: -20px;
`

export const TotalBalance = styled(Text)`
  position: absolute;
  right: 0;
  cursor: pointer;
  top: -20px;
`

export const PopupBox = styled.div`
  position: absolute;
  left: 0px;
  top: 120px;
  background: ${({ theme }) => theme.colors.bluePalette.light};
  box-shadow: 1px 4px 44px rgba(0, 0, 0, 0.3);
  border: 1px solid #dbe2eb;
  border-radius: 10px;
  padding: 30px 18px;
  font-size: 13px;
  line-height: 21px;
  letter-spacing: 0.035em;
  color: ${({ theme }) => theme.colors.bluePalette.darkBG};
  width: 200px;
  z-index: 10;

  ${({ theme }) => theme.mediaQueries.xl} {
    left: calc(100% + 20px);
    top: 0px;
  }
`

export const DepositListItemContent = styled.div<{ textAlign: string }>`
  font-size: 12px;
  text-align: ${({ textAlign }) => textAlign};
`

export const DepositListItem = styled.div<{ color: string }>`
  display: grid;
  margin: 5px 0;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  color: ${({ color }) => color};
`

export const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.primaryGray};
`

export const ModalNoPadContainer = styled.div`
  margin: 0px -25px -25px -25px;
`

export const ModalContainer = styled.div`
  padding: 20px 20px 0px 20px;
`

export const TransparentInput = styled.input`
  background: transparent;
  border-radius: 0px;
  box-shadow: none;
  padding-left: 0px;
  padding-right: 0px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryGray};
  width: 50%;

  &:focus-visible {
    outline: none;
  }
`

export const Panel = styled(Flex)`
  padding: 12px;
  box-shadow: inset 0px 1px 9px rgba(0, 0, 0, ${({ theme }) => (theme.isDark ? '0.85' : '0.15')});
  border-radius: 6px;
  background: rgba(234, 242, 250, 0.1);
  position: relative;
`

const expandAnimation = keyframes`
  from {
    max-height: 0px;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
    opacity: 1;
  }
  to {
    max-height: 0px;
    opacity: 0;
  }
`

export const DepositHistoryTable = styled.div<{ expanded: boolean }>`
  margin-top: 10px;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#060514')};
  width: 100%;
  overflow: auto;
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 500ms linear forwards;
        `
      : css`
          ${collapseAnimation} 500ms linear forwards
        `};
`

export const ChevronDownIcon = styled(ChevronDown)`
  margin-left: 10px;
`

export const ChevronUpIcon = styled(ChevronDownIcon)`
  transform: rotate(180deg);
`

export const StyledExpandButton = styled(ExpandButton)`
  margin: 0px -25px -25px -25px;
  width: calc(100% + 50px);
`
