import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const useAllAccRewards = (farms, pools, crssPriceBusd) => {
  const allConfig = pools.concat(farms)
  const cells = allConfig.map((data) => {
    const result = data.userData.accumulatedRewards
    const resultInBigNumber = new BigNumber(result)
    return resultInBigNumber.div(DEFAULT_TOKEN_DECIMAL).multipliedBy(crssPriceBusd).toNumber()
  })
  return cells
}

export default useAllAccRewards
