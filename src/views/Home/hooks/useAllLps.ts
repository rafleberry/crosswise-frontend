import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { usePriceCrssBusd } from 'state/farms/hooks'
import { Farm } from 'state/types'

const getLpPriceInUsd = (farm: Farm) => {
  const lpPriceInUsd = new BigNumber(farm.quoteToken.busdPrice).times(
    new BigNumber(farm.quoteTokenAmountTotal).times(2),
  )
  return lpPriceInUsd
}

const useAllLps = () => {
  const crssPriceBusd = usePriceCrssBusd()
  const farms = useSelector((state: any) => state.farms.data)
  const pools = useSelector((state: any) => state.pools.data)
  const allConfig = farms.concat(pools)
  const cells = allConfig.map((data) => {
    if (data.pid === 2 || data.pid === 4) return null
    const rewardPayroll = data.userData.stakedBalance
    const { lpTotalSupply } = data
    const lpTokenBalance = data.userData.tokenBalance
    if (data.pid === 0) {
      const stakedCrssInBigNumber = new BigNumber(rewardPayroll)
      return stakedCrssInBigNumber.div(DEFAULT_TOKEN_DECIMAL).multipliedBy(crssPriceBusd).toNumber()
    }
    const lpPriceInUsd = getLpPriceInUsd(data)
    return lpPriceInUsd.times(lpTokenBalance).div(lpTotalSupply).toNumber()
  })
  return cells
}

export default useAllLps
