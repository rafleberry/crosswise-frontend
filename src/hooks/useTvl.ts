import { BigNumber } from 'bignumber.js'
import { useEffect, useState } from 'react'
import { farmsConfig } from 'config/constants'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { usePriceCrssBusd } from 'state/farms/hooks'
import { getCrssContract } from 'utils/contractHelpers'
import getReservesPriceInUsd from './getReservesPriceInUsd'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
const useTVL = () => {
  const [balances, setBalance] = useState(0)
  const crssContract = getCrssContract()
  const crssPriceBusd = usePriceCrssBusd()
  const masterChefAddress = getMasterChefAddress()
  useEffect(() => {
    const fetchBalances = async () => {
      let totalLiquidity = 0
      await Promise.all(
        farmsConfig.map(async (farm) => {
          const lpPriceInUsd = await getReservesPriceInUsd(farm, crssPriceBusd)
          totalLiquidity += lpPriceInUsd
          return true
        }),
      )
      const depositedCrss = await crssContract.balanceOf(masterChefAddress)
      const depositedCrssInBigNumber = new BigNumber(depositedCrss._hex)
      totalLiquidity += depositedCrssInBigNumber.div(DEFAULT_TOKEN_DECIMAL).multipliedBy(crssPriceBusd).toNumber()
      setBalance(totalLiquidity)
    }
    fetchBalances()
  }, [crssPriceBusd, crssContract, masterChefAddress])
  return balances.toFixed(2)
}

export default useTVL
