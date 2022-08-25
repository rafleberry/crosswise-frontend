import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 0;
`

export const LinkWrapper = styled.a`
  width: 38px;
  height: 38px;
  background: rgba(245, 255, 252, 0.1);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  margin: 10px;
  display: flex;
  justify-content: center;
  transition: box-shadow 0.5s;
  svg {
    transition: all 0.5s;
  }
  &:hover {
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.1), 0px 0px 10px 2px rgba(135, 80, 244, 0.65);
    svg {
      path {
        fill: #bd00ff;
      }
    }
  }
`
