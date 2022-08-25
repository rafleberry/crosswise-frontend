import React from 'react'
import { useSelector } from 'react-redux'
// import { Link as RouterLink } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  Text,
  TokenPairImage,
  DropDownBottomIcon,
  DropDownUpIcon,
  Flex,
  LiquidityIcon,
  RewardsIcon,
  SectorIcon,
  WalletIcon,
  ClaimIcon,
  useMatchBreakpoints,
  Skeleton,
} from '@crosswise/uikit'
import { farmsConfig, poolsConfig } from 'config/constants'
// import useTokenBalance from 'hooks/useTokenBalance'
// import useTheme from 'hooks/useTheme'
// import { getFullDisplayBalance } from 'utils/formatBalance'
// import { getCrssAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import {
  Container,
  SubColumn,
  IconButton,
  TokenPairWrapper,
  StyledTitle,
  CardContent,
  StyledText,
  StyledFlex,
  LpCard,
} from './styled'

const CardsArea = ({ allStakings, allLps, allAccRewards }) => {
  const farmsDataLoaded = useSelector((state: any) => state.farms.userDataLoaded)
  const poolsDataLoaded = useSelector((state: any) => state.pools.userDataLoaded)
  const { isXs, isSm } = useMatchBreakpoints()
  const isMobile = isXs || isSm
  const dataIsLoaded = farmsDataLoaded && poolsDataLoaded
  const [collapseLiquidity, setCollapseLiquidity] = React.useState(false)
  const [collapseRewards, setCollapseRewards] = React.useState(false)
  const { chainId } = useActiveWeb3React()
  const allConfig = farmsConfig.concat(poolsConfig)
  // const { balance: crssBalance } = useTokenBalance(getCrssAddress())
  const sumRewards = allAccRewards.reduce((sum, reward) => {
    return sum + reward
  }, 0)
  const poolRewards = allAccRewards[0]
  const farmRewards = sumRewards - poolRewards
  const { t } = useTranslation()
  const collapseClicked = () => {
    setCollapseRewards(!collapseRewards)
    if (!isMobile) {
      setCollapseLiquidity(!collapseLiquidity)
    }
  }
  const collapseLiquidityClicked = () => {
    setCollapseLiquidity(!collapseLiquidity)
  }
  return (
    <Container>
      <SubColumn>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          height="40px"
          onClick={isMobile ? collapseLiquidityClicked : collapseClicked}
        >
          <Text fontSize="10px" color="homeTitle" fontWeight={600} display="flex">
            {t('ADD LIQUIDITY')} &nbsp;
            <LiquidityIcon fill="primaryText" width="15px" />
          </Text>
          {isMobile && (
            <IconButton onClick={collapseLiquidityClicked}>
              {collapseLiquidity ? (
                <DropDownBottomIcon width="24px" mr={20} />
              ) : (
                <DropDownUpIcon width="24px" mr={20} />
              )}
            </IconButton>
          )}
        </Flex>
        <StyledTitle onClick={isMobile ? collapseLiquidityClicked : collapseClicked}>
          <Text fontSize="26px" fontWeight={500} lineHeight="29px" mt={10}>
            {t('Liquidity')}
          </Text>
          <TokenPairWrapper>
            <TokenPairImage
              primarySrc={`/images/tokens/${tokens.crss.address[chainId]}.svg`}
              secondarySrc={`/images/tokens/${tokens.wbnb.address[chainId]}.svg`}
              height={26}
              width={26}
            />
          </TokenPairWrapper>
        </StyledTitle>
        <Flex flexDirection={isMobile ? 'column' : 'row'}>
          <CardContent collapse={!collapseLiquidity}>
            <LpCard>
              <StyledFlex flexDirection="column">
                <StyledText fontSize="13px" display="flex" color="homeTitle">
                  {t('Your Total Liquidity')}&nbsp; <WalletIcon fill="primaryText" width="15px" />
                </StyledText>
                {farmsConfig.map((data, index) => {
                  if (allLps[index] > 0) {
                    return (
                      <StyledText fontSize="16px" key={farmsConfig[index].pid}>
                        $ {allLps[index].toFixed(2)} {farmsConfig[index].lpSymbol}
                      </StyledText>
                    )
                  }
                  return null
                })}
              </StyledFlex>
            </LpCard>
          </CardContent>
          <CardContent collapse={!collapseLiquidity}>
            <LpCard>
              <StyledFlex flexDirection="column">
                <StyledText fontSize="13px" display="flex" color="homeTitle">
                  {t('Total Staked')}&nbsp;
                  <SectorIcon fill="primaryText" width="15px" />
                </StyledText>
                {allStakings.map((data, index) => {
                  if (data > 0) {
                    return (
                      <StyledText fontSize="16px" key={allConfig[index].pid}>
                        $ {data.toFixed(2)} {allConfig[index].lpSymbol}
                      </StyledText>
                    )
                  }
                  return null
                })}
              </StyledFlex>
            </LpCard>
          </CardContent>
        </Flex>
      </SubColumn>
      <SubColumn>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          height="40px"
          onClick={collapseClicked}
        >
          <Text fontSize="10px" fontWeight={600} color="homeTitle" display="flex">
            {t('EARN APR REWARDS')} &nbsp;
            <RewardsIcon fill="primaryText" width="15px" />
          </Text>
          <IconButton onClick={collapseClicked}>
            {collapseRewards ? <DropDownBottomIcon width="24px" mr={20} /> : <DropDownUpIcon width="24px" mr={20} />}
          </IconButton>
        </Flex>
        <StyledTitle onClick={collapseClicked}>
          <Text fontSize="26px" fontWeight={500} lineHeight="29px" mt={10}>
            {t('Rewards')}
          </Text>
        </StyledTitle>
        <Flex flexDirection={isMobile ? 'column' : 'row'}>
          <CardContent collapse={!collapseRewards}>
            <Flex flexDirection="column">
              <StyledText fontSize="13px" display="flex" color="homeTitle">
                {t('Farm Rewards')} &nbsp; <ClaimIcon fill="primaryText" width="15px" />
              </StyledText>
              <StyledText fontSize="16px">
                $ {dataIsLoaded ? <>{farmRewards.toFixed(2)}</> : <Skeleton width="60px" />}
              </StyledText>
            </Flex>
          </CardContent>
          <CardContent collapse={!collapseRewards}>
            <Flex flexDirection="column">
              <StyledText fontSize="13px" display="flex" color="homeTitle">
                {t('Pool Rewards')}
                &nbsp; <WalletIcon fill="primaryText" width="15px" />
              </StyledText>
              <StyledText fontSize="16px">
                $ {dataIsLoaded ? <>{poolRewards.toFixed(2)}</> : <Skeleton width="60px" />}
              </StyledText>
            </Flex>
          </CardContent>
        </Flex>
      </SubColumn>
    </Container>
  )
}

export default CardsArea
