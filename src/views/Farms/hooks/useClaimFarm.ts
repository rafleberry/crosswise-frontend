import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useMasterchef } from 'hooks/useContract'
import masterChef from 'config/abi/masterchef.json'
import { sendTransactionByBiconomy } from 'utils/useBiconomy'

const useClaimFarm = (pid) => {
  const masterChefContract = useMasterchef()
  const { account } = useWeb3React()

  const handleClaimFarm = useCallback(
    async () => {
      const txHash = await sendTransactionByBiconomy(masterChefContract.address, masterChef, account, 'deposit', [
        pid,
        0,
      ])
      return txHash
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masterChefContract, pid, account],
  )
  return { onClaimFarm: handleClaimFarm }
}

export default useClaimFarm
