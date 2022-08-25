import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Skeleton, useMatchBreakpoints } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePriceCrssBusd } from 'state/farms/hooks'
import useTheme from 'hooks/useTheme'
import useTVL from 'hooks/useTvl'
import MarketCap from '../StatisticComponents/MarketCap'
import Circulation from '../StatisticComponents/Circulation'
import { Container, SubColumn, StyledButton, StyledTitle, StyledValue, StyledFlex } from './styled'

const AboutCrss = () => {
  const { t } = useTranslation()
  const tvlData = useTVL()
  const crssTokenPrice = usePriceCrssBusd().toNumber()
  const { isXs, isSm } = useMatchBreakpoints()
  const isMobile = isXs || isSm
  const theme = useTheme()
  return (
    <Container>
      <SubColumn>
        <StyledTitle>{t('Volume 24h')}</StyledTitle>
        <StyledValue>$ 1,000,999</StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('Price')}</StyledTitle>
        <StyledValue>
          {Number(crssTokenPrice) > 0 ? <>$ {crssTokenPrice.toFixed(2)}</> : <Skeleton width={60} />}
        </StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('Market Cap')}</StyledTitle>
        <StyledValue>
          <MarketCap />
        </StyledValue>
      </SubColumn>
      <SubColumn span={2}>
        <StyledTitle>{t('Circulating Supply')}</StyledTitle>
        <StyledValue>
          <Circulation />
        </StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('TVL')}</StyledTitle>
        <StyledValue>
          {Number(tvlData) > 0 ? (
            <>${tvlData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</>
          ) : (
            <Skeleton width={60} />
          )}
        </StyledValue>
      </SubColumn>
      <StyledFlex>
        <RouterLink to="/exchange">
          <StyledButton variant={isMobile && !theme.isDark ? 'secondaryGradient' : 'primaryGradient'}>
            {t('Buy CRSS')}
          </StyledButton>
        </RouterLink>
      </StyledFlex>
    </Container>
  )
}

export default AboutCrss
