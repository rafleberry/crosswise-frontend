import React from 'react'
// import { Spinner } from '@crosswise/uikit'
import Lottie from 'react-lottie'
import loadingAnimation from 'lottie_animations/loadingAnimation'
import { Wrapper } from './styled'

const PageLoader: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return (
    <Wrapper>
      {/* <Spinner /> */}
      <Lottie options={defaultOptions} height={256} width={256} />
    </Wrapper>
  )
}

export default PageLoader
