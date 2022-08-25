import { useCallback } from 'react'
// import { harvestFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { sendTransactionByBiconomy } from 'utils/useBiconomy'
import masterChef from 'config/abi/masterchef.json'
import { useWeb3React } from '@web3-react/core'
import {
  // massHarvestFarm,
  massStakeFarm,
} from 'utils/calls'

const useMassFarm = () => {
  const masterChefContract = useMasterchef()
  const { account } = useWeb3React()

  const massHarvest = useCallback(async () => {
    const status = await sendTransactionByBiconomy(
      masterChefContract.address,
      masterChef,
      account,
      'massHarvestRewards',
      [],
    )
    return status
  }, [account, masterChefContract])

  const massStakeReward = useCallback(
    async (library: any, pids: number[]) => {
      await massStakeFarm(masterChefContract, pids)
    },
    [masterChefContract],
  )

  return { onMassHarvest: massHarvest, onMassStakeReward: massStakeReward }
}

export default useMassFarm
