import styled, { css, keyframes } from 'styled-components'
import { DropDownBottomIcon, LinkExternal, Button, Flex, Toggle } from '@crosswise/uikit'
import { ChevronDownIcon as ChevronDown } from '../ExpandButton'

// fadein keyframe
const fadeInKeyframe = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const CellInner = styled.div<{ alignItems?: string; isMobile?: boolean }>`
  /* padding: 24px 0px; */
  ${({ isMobile }) =>
    isMobile &&
    css`
      display: flex;
    `}
  /* width: 100%; */
  align-items: ${({ alignItems }) => alignItems || 'center'};
  /* padding-right: 8px; */
  width: max-content;

  ${({ theme }) => theme.mediaQueries.xl} {
    /* padding-right: 32px; */
  }
`

const expandRowAnimation = keyframes`
  from {
    height: 111px;
  }
  to {
    height: max-content;
  }
`

const collapseRowAnimation = keyframes`
  from {
    height: max-content;
  }
  to {
    height: 111px;
  }
`

const expandRowAnimationOnMobile = keyframes`
  from {
    height: 132px;
  }
  to {
    height: max-content;
  }
`

const collapseRowAnimationOnMobile = keyframes`
  from {
    height: max-content;
  }
  to {
    height: 132px;
  }
`

export const StyledTr = styled.div<{ index: number; expanded?: boolean; isMobile?: boolean }>`
  cursor: pointer;
  /* opacity: 0;
  animation: ${fadeInKeyframe} 2s;
  animation-delay: ${({ index }) => `${index * 0.1}s`};
  animation-fill-mode: forwards; */
  transition: box-shadow 0.5s;
  transition: transform 1s;
  /* border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder}; */
  /* padding: 25px 20px; */
  margin-bottom: 15px;

  background: ${({ theme }) =>
    theme.isDark
      ? // 'linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 45.83%, rgba(255, 255, 255, 0) 100%), #25272C;'
        `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.12) 0%,
          rgba(255, 255, 255, 0.06) 45.83%,
          rgba(255, 255, 255, 0) 100%
        )`
      : '#FFF'};
  border: ${({ theme }) => (theme.isDark ? '1px solid rgba(224, 224, 255, 0.22)' : 'none')};

  -webkit-backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
  box-shadow: 1px 4px 44px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;

  &:hover {
    box-shadow: 0px 0px 10px rgba(135, 80, 244, 0.85);
  }
  animation: ${({ expanded, isMobile }) =>
    expanded
      ? css`
          ${isMobile ? expandRowAnimationOnMobile : expandRowAnimation} 500ms linear forwards;
        `
      : css`
          ${isMobile ? collapseRowAnimationOnMobile : collapseRowAnimation} 500ms linear forwards
        `};

  &::before {
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
  }
`

export const EarnedMobileCell = styled.td`
  padding: 16px 0 24px 16px;
`

export const AprMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

export const FarmMobileCell = styled.td`
  padding-top: 24px;
`

export const DepositFeeMobileCell = styled.td`
  padding-top: 16px;
  padding-bottom: 24px;
`

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 20px;
`

export const GearIcon = styled.div`
  background-image: url('/images/icons/GearIcon.png');
  background-size: cover;
  width: 21px;
  height: 21px;
`

export const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 56px;
  }
`

export const RowBody = styled.div<{ columnsTemplate?: string; alignItems?: string; isMobile: boolean }>`
  /* display: flex; */
  display: grid;
  grid-template-columns: ${({ isMobile, columnsTemplate }) => (isMobile ? '1fr' : columnsTemplate ?? '1fr 1fr 1fr')};
  /* grid-column-gap: 50px; */
  justify-content: space-between;
  justify-items: center;
  align-items: ${({ alignItems }) => alignItems ?? 'flex-start'};
  padding: ${({ isMobile }) => (isMobile ? '10px 15px' : '19px 25px')};
  border-top: 1px solid rgba(196, 196, 196, 0.1);
  border-bottom: 1px solid rgba(196, 196, 196, 0.1);
`

export const EarningRow = styled.div<{ isMobile: boolean; justifyContent?: string }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ isMobile }) => (isMobile ? '1fr' : '1.5fr 0.8fr 0.8fr 0.8fr')};
  justify-content: ${({ justifyContent }) => justifyContent ?? 'space-between'};
  justify-items: center;
  align-items: center;
  margin: 10px 0;
`

export const ExpandMainInfoButton = styled.div`
  position: absolute;
  right: 20px;
  cursor: pointer;
`

export const StyledLinkExternal = styled(LinkExternal)<{ isMobile?: boolean }>`
  font-weight: 400;
  ${({ isMobile }) =>
    !isMobile &&
    css`
      width: 100%;
    `}
  display: flex;
  font-size: 13px;
  /* justify-content: space-between; */
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#060514')};
  svg {
    fill: #218bff;
    margin-left: 10px;
  }
`

export const ActionButton = styled(Button)<{ width: string }>`
  width: ${({ width }) => width ?? '152px'};
  border-radius: 6px;
  /* margin-left: 10px; */
  background: linear-gradient(92.63deg, #3f81ef -1.76%, #8750f4 107.38%);
`

export const NextUnlockPanel = styled(Flex)<{ isMobile?: boolean }>`
  background: rgba(245, 255, 252, 0.1);
  box-shadow: inset 0px 1px 9px rgba(0, 0, 0, 0.85);
  border-radius: 6px;
  width: ${({ isMobile }) => !isMobile && '152px'};
  height: 48px;
  /* padding: 5px; */
`

export const StyledSettingIcon = styled.div`
  background: url('/images/icons/GearFrameIcon.png');
  background-size: cover;
  width: 20px;
  height: 20px;
`

export const ChevronDownIcon = styled(ChevronDown)`
  margin-left: 10px;
`

export const ChevronUpIcon = styled(ChevronDownIcon)`
  transform: rotate(180deg);
`

export const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* padding: 10px; */
  justify-content: flex-end;
  margin-right: 22px;
  /* width: 100%; */
  /* ${({ theme }) => theme.mediaQueries.xl} {
    width: 200px;
  } */
`

export const ToggleWrapper = styled.div<{ isMobile?: boolean }>`
  /* width: 100%; */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({ isMobile }) => (isMobile ? '5px' : '12px')};
  /* margin: 5px 0; */
  margin-left: ${({ isMobile }) => (isMobile ? '15px' : '36px')};
  &:last-child {
    margin-bottom: 0;
  }
`

export const StyledToggle = styled(Toggle)`
  width: 45px;
  & > span {
    top: 6px;
  }
`

export const CrossedText = styled.span<{ checked: boolean }>`
  text-decoration: line-through;
  font-size: 12px;
  color: ${({ checked }) => (checked ? '#04F8AD' : '#be3f50')};
`

export const DropDownIcon = styled(DropDownBottomIcon)`
  position: absolute;
  right: 15px;
  top: 21px;
  cursor: pointer;
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

export const VestingListTable = styled.div<{ expanded: boolean; isMobile?: boolean }>`
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#060514')};
  padding: 0 ${({ isMobile }) => (isMobile ? 10 : 25)}px;
  width: 100%;
  /* opacity: ${({ expanded }) => (expanded ? 1 : 0)}; */
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 500ms linear forwards;
        `
      : css`
          ${collapseAnimation} 500ms linear forwards
        `};
`

export const VestingListTableRow = styled.div<{ border?: string }>`
  display: grid;
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 16px 0;
`

export const VestingListTableCell = styled.div<{ textAlign?: string; color?: string }>`
  text-align: ${({ textAlign }) => textAlign ?? 'center'};
  ${({ color }) => color && `color: ${color};`}
`

export const VestingListTableHeaderCell = styled(VestingListTableCell)`
  font-weight: bold;
`
