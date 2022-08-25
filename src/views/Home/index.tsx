import React from 'react'
import { useSelector } from 'react-redux'
import { Heading, useMatchBreakpoints } from '@crosswise/uikit'
import Row from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import { HorizontalDivider } from 'components/Divider'
import { useTranslation } from 'contexts/Localization'
import { usePollFarmsData, usePriceCrssBusd } from 'state/farms/hooks'
import { usePollPoolsData } from 'state/pools/hooks'
import useAllLps from './hooks/useAllLps'
import useAllAccRewards from './hooks/useAllAccRewards'
import useAllEarnings from './hooks/useAllEarnings'
import useAllStakings from './hooks/useAllStakings'
import useAllVestings from './hooks/useAllVestings'
import Chart from './components/BasicChart'
import AboutCrss from './components/AboutCrss'
import Header from './components/Header'
import SocialLink from './components/SocialLink'
import Balances from './components/Balances'
import CardsArea from './components/CardsArea'
import { StyledPage, Label, StyledRow } from './styled'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const crssPriceBusd = usePriceCrssBusd()
  const farms = useSelector((state: any) => state.farms.data)
  const pools = useSelector((state: any) => state.pools.data)
  // console.log('farms & pools: ', farms, pools)
  const allEarnings = useAllEarnings(farms, pools, crssPriceBusd)
  const allStakings = useAllStakings()
  // const { allLps, allStakings } = useAllStakings()
  // const allStakings = []
  const allVestings = useAllVestings(farms, pools, crssPriceBusd)
  const allLps = useAllLps()
  // const allLps = []
  const allAccRewards = useAllAccRewards(farms, pools, crssPriceBusd)
  const isMobile = isXs || isSm || isMd
  usePollFarmsData()
  usePollPoolsData()
  return (
    <>
      <StyledPage>
        <Row justify="center">
          <AutoColumn justify="center">
            {!isMobile && (
              <Heading as="h1" scale="xxl" mb="24px" color="text">
                <Header isMobile={isMobile} />
              </Heading>
            )}
            <Label color="primaryText" fontSize="20px" textAlign="center" fontFamily="genos">
              {t('Next-Gen Cross-Chain DEX')}
            </Label>
            <SocialLink />
          </AutoColumn>
        </Row>
        <Row>
          <AboutCrss />
        </Row>
        <StyledRow>
          <Balances allEarnings={allEarnings} allStakings={allStakings} allVestings={allVestings} />
          <HorizontalDivider />
          <CardsArea
            // crssPriceBusd={crssPriceBusd}
            allStakings={allStakings}
            allLps={allLps}
            allAccRewards={allAccRewards}
          />
        </StyledRow>
        {!isMobile && (
          <StyledRow>
            <Chart />
          </StyledRow>
        )}
      </StyledPage>
    </>
  )
}

export default Home
