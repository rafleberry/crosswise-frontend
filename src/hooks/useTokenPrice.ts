import { useEffect, useState } from 'react'
// import BigNumber from 'bignumber.js'
import { usePriceCrssBusd } from 'state/farms/hooks'
import { useWeb3React } from '@web3-react/core'
import { getCrssAddress } from 'utils/addressHelpers'
// import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from './useRefresh'

const useTokenPrice = (token: any) => {
  const { account, chainId } = useWeb3React()
  const { slowRefresh } = useRefresh()
  const [balance, setBalance] = useState(0)
  const crssPrice = usePriceCrssBusd()
  useEffect(() => {
    const fetchBalance = async () => {
      if (token.address[chainId] === getCrssAddress()) {
        setBalance(crssPrice.toNumber())
      }
    }
    if (account) {
      fetchBalance()
    }
  }, [account, token, slowRefresh, crssPrice, chainId])

  return balance
}

export default useTokenPrice
