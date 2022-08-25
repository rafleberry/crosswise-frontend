import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { useWeb3React } from '@web3-react/core'
import { useRepay } from 'hooks/useContract'
import { getBalanceNumber } from 'utils/formatBalance'

export const fetchCompensationInfo = async (address) => {
  const { data } = await axios.get(`https://api.crosswise.finance/v1/compensation/${address}`)
  return !!data.doc
}

const useCompensation = () => {
  const repayContract = useRepay()
  const { account } = useWeb3React()
  const getUserState = useCallback(async () => {
    try {
      const data = await repayContract.getUserState(account)
      const vestList = await repayContract.getVestList(account)
      return {
        pendingCrss: getBalanceNumber(new BigNumber(data.pendingCrss._hex)),
        staked: getBalanceNumber(new BigNumber(data._deposit._hex)),
        withdrawable: getBalanceNumber(new BigNumber(data.withdrawable._hex)),
        isLoaded: true,
        vestList,
      }
    } catch (e) {
      return {
        pendingCrss: 0,
        staked: 0,
        withdrawable: 0,
        isLoaded: true,
        vestList: [],
      }
    }
  }, [repayContract, account])
  const handleClaim = useCallback(
    async (isVesting) => {
      try {
        await repayContract.harvestRepay(isVesting)
        return true
      } catch (e) {
        console.log('Error: ', e)
        throw e
      }
    },
    [repayContract],
  )
  // useEffect(()=>{})
  return { getUserState, handleClaim }
}

export default useCompensation
