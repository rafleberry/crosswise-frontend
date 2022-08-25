import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useEffect, useState } from 'react'
import useRefresh from 'hooks/useRefresh'
import { useMasterchef } from 'hooks/useContract'
import { getCrssReferralContract } from 'utils/contractHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { withdrawOutstandingRewards } from 'utils/calls'

function useReferralCommissions() {
  const [referralRewards, setReferralCommissions] = useState(BIG_ZERO)
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()
  const referralContract = getCrssReferralContract()
  const masterChefContract = useMasterchef()

  // const getReferralRewards = useCallback(async () => {
  //   if (account) {
  //     const data = await referralContract.outstandingCommissions(account)
  //     setReferralCommissions(new BigNumber(data._hex))
  //   }
  // }, [referralContract, account])
  const getReferralRewards = async () => {
    if (account) {
      const data = await referralContract.outstandingCommissions(account)
      setReferralCommissions(new BigNumber(data._hex))
    }
  }

  const claimReferralCommission = useCallback(
    async () => {
      if (account) {
        try {
          const txHash = await withdrawOutstandingRewards(masterChefContract, referralRewards.toJSON())
          const receipt = await txHash.wait()
          await getReferralRewards()
          return receipt.status
        } catch (err) {
          return false
        }
      } else {
        return false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masterChefContract, referralRewards, account],
  )

  useEffect(() => {
    getReferralRewards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slowRefresh])

  return { referralRewards, claimReferralCommission }
}

export default useReferralCommissions
