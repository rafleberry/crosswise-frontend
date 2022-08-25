import styled, { css } from 'styled-components'
import { Text } from '@crosswise/uikit'

export const TopPart = styled.div`
  position: absolute;
  top: -1px; // should be -1px because on mobile environment 0px doesn't work properly
  left: 0;
  width: 100%;
  height: 20px;
  border-radius: 0px 0px 20px 20px;
  background: ${({ theme }) =>
    theme.isDark
      ? // 'linear-gradient(90deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.06) 45.83%,rgba(255,255,255,0) 100%),#25272C;'
        `linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.12) 0%,
          rgba(255, 255, 255, 0.06) 45.83%,
          rgba(255, 255, 255, 0) 100%
        )`
      : 'white'};
`

export const StyledSvg = styled.svg<{ inverse?: boolean }>`
  align-self: flex-end;
  position: absolute;
  bottom: 0;

  ${({ inverse }) =>
    inverse
      ? css`
          transform: rotateY(180deg);
          right: 0;
        `
      : css`
          left: 0;
        `};
`

export const ExpandButtonText = styled(Text)`
  --wing-width: 20px;
  --overlap-width: 1px; // this property is for not showing borders of side wing when on hover
  position: absolute;
  left: calc(var(--wing-width) - var(--overlap-width));
  top: 27px;
  width: calc(100% - var(--wing-width) * 2 + var(--overlap-width) * 2);
  height: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #6f61f3;
  z-index: 1;

  &:hover {
    /* box-shadow: inset 0px 0px 0px 1px #04f8ad, 0px 4px 12px rgb(0 184 185 / 24%); */
    border-top: 1px solid #04f8ad;
    border-bottom: 1px solid #04f8ad;
    & ~ ${StyledSvg} {
      stroke: #04f8ad;
      stroke-width: 1px;
    }
  }
`

export const ExpandButtonWrapper = styled.div`
  position: relative;
  cursor: pointer;
  height: 47px;
  width: 100%;
  border-radius: 0px 0px 20px 20px;
  transition: all 0.5s;
  /* display: flex;
  align-items: flex-end; */
  &:hover {
    /* background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      linear-gradient(92.63deg, #3f81ef -1.76%, #8750f4 107.38%); */
  }
`
