import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { CrosswiseTheme } from '@crosswise/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends CrosswiseTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: genos;
    src: url(/fonts/Genos.ttf);
  }
  * {
    font-family: 'Montserrat', sans-serif;
    transition: all 0.5s;
    transition-property: background, background-color, color;
  }
  body {
                       
    background-color: ${({ theme }) => (theme.isDark ? '#060514' : '#fff')};
    @media screen and (min-width: 852px) {
      background: ${({ theme }) =>
        theme.isDark
          ? 'radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)'
          : '#fff'};
      background-color: ${({ theme }) => (theme.isDark ? '#060514' : '#fff')};
    }
    img {
      height: auto;
      max-width: 100%;
    }
    ::-webkit-scrollbar-thumb {
      background: rgb(129, 142, 163);
      border-radius: 8px;
    }
    ::-webkit-scrollbar {
        width: 0px;
    }
  }
`

export default GlobalStyle
