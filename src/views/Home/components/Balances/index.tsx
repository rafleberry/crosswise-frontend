import React from 'react'
import { useSelector } from 'react-redux'
import { Text, TotalIcon, Skeleton } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
import { Container, SubColumn, StyledTitle, StyledValue, SubColumnTitle } from './styled'

const Balances = ({ allEarnings, allStakings, allVestings }) => {
  const farmsDataLoaded = useSelector((state: any) => state.farms.userDataLoaded)
  const poolsDataLoaded = useSelector((state: any) => state.pools.userDataLoaded)
  const dataIsLoaded = farmsDataLoaded && poolsDataLoaded
  const { t } = useTranslation()

  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + earning
  }, 0)
  const vestingsSum = allVestings.reduce((sum, vesting) => {
    return sum + vesting
  }, 0)
  const stakingsSum = allStakings.reduce((sum, staking) => {
    return sum + staking
  }, 0)
  const totalValue = earningsSum + vestingsSum + stakingsSum
  return (
    <Container>
      <SubColumnTitle>
        <Text fontSize="10px" color="homeTitle" fontWeight={600} display="flex">
          {t('BALANCES')} &nbsp;
          <TotalIcon fill="primaryText" width="17px" />
        </Text>
        <Text>&nbsp;</Text>
      </SubColumnTitle>
      <SubColumn>
        <StyledTitle>{t('Total Value')} (USD)</StyledTitle>
        <StyledValue>
          {dataIsLoaded ? (
            <>
              $
              {totalValue
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </>
          ) : (
            <Skeleton width={60} />
          )}
        </StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('Claimable')}</StyledTitle>
        <StyledValue>
          {dataIsLoaded ? (
            <>
              $
              {earningsSum
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </>
          ) : (
            <Skeleton width={60} />
          )}
        </StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('Total Vested')}</StyledTitle>
        <StyledValue>
          {dataIsLoaded ? (
            <>
              $
              {vestingsSum
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </>
          ) : (
            <Skeleton width={60} />
          )}
        </StyledValue>
      </SubColumn>
      <SubColumn>
        <StyledTitle>{t('Total Staked')} (USD)</StyledTitle>
        <StyledValue>
          {dataIsLoaded ? (
            <>
              $
              {stakingsSum
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </>
          ) : (
            <Skeleton width={60} />
          )}
        </StyledValue>
      </SubColumn>
    </Container>
  )
}

export default Balances
