import styled, { css } from 'styled-components'

export const MultiplierTagContainer = styled.div`
  position: relative;
  width: fit-content;
  background: linear-gradient(to right, #8c39ff, #218bff);
  padding: 1px;
  border-radius: 15px;
`

export const MultiplierTagContent = styled.div<{ isDarkTheme: boolean }>`
  padding: 5px;
  /* border-radius: 8px; */
  border-radius: 25px;
  ${(props) =>
    props.isDarkTheme
      ? css`
          background: #303236;
        `
      : css`
          background: white;
        `}
`
