import React from 'react'
// import { useTranslation } from 'contexts/Localization'
import { Skeleton } from '@crosswise/uikit'
import { usePriceCrssBusd } from 'state/farms/hooks'
import { useTotalSupply } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'

const MarketCap = () => {
  // const { t } = useTranslation()
  const crssPriceBusd = usePriceCrssBusd().toNumber()
  const totalSupply = useTotalSupply()
  const marketCap = getBalanceNumber(totalSupply) * crssPriceBusd

  return marketCap ? <>$ {marketCap.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</> : <Skeleton width={60} />
}

export default MarketCap
