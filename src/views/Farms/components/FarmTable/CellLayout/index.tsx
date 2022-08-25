import React from 'react'
import { Flex, useMatchBreakpoints } from '@crosswise/uikit'
import { Label, ContentContainer } from './styled'

interface CellLayoutProps {
  label?: string
  textAlign?: string
}

const CellLayout: React.FC<CellLayoutProps> = ({ label = '', children, textAlign = 'left' }) => {
  const { isXs, isSm } = useMatchBreakpoints()

  const isMobile = isXs || isSm
  return (
    <Flex
      flexDirection={isMobile ? 'row' : 'column'}
      justifyContent={isMobile ? 'space-between' : 'center'}
      alignItems="center"
    >
      {label && (
        <Label isMobile={isMobile} textAlign={textAlign}>
          {label}
        </Label>
      )}
      <ContentContainer>{children}</ContentContainer>
    </Flex>
  )
}

export default CellLayout
