import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { sendTransactionByBiconomy } from 'utils/useBiconomy'
import masterChef from 'config/abi/masterchef.json'
import { useMasterchef } from 'hooks/useContract'

const useSwitchCollectOption = (pid) => {
  const masterChefContract = useMasterchef()
  const { account } = useWeb3React()

  const handleSwitchCollectOption = useCallback(
    async (option) => {
      const txHash = await sendTransactionByBiconomy(
        masterChefContract.address,
        masterChef,
        account,
        'switchCollectOption',
        [pid, option],
      )
      return txHash
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masterChefContract, pid, account],
  )
  return { onSwitchCollectOption: handleSwitchCollectOption }
}

export default useSwitchCollectOption
