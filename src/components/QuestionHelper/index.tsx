import React from 'react'
import { HelpIcon, InfoIcon, useTooltip, Box, useMatchBreakpoints } from '@crosswise/uikit'
import { Props } from './interfaces'
import { QuestionWrapper } from './styled'

const QuestionHelper: React.FC<Props> = ({ text, icon = 'help', ...props }) => {
  const { isXs, isSm } = useMatchBreakpoints()

  const isMobile = isXs || isSm
  const toolTipPosition = isMobile ? 'top' : 'top-end'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement: toolTipPosition, trigger: 'hover' })
  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        {icon === 'help' && <HelpIcon width="16px" viewBox="0 0 22 22" />}
        {icon === 'info' && <InfoIcon width="16px" />}
      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
