import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const useAllEarnings = (farms, pools, crssPriceBusd) => {
  const allConfig = farms.concat(pools)
  const cells = allConfig.map((data) => {
    const result = data.userData.pendingCrss
    const resultInBigNumber = new BigNumber(result)
    return resultInBigNumber.div(DEFAULT_TOKEN_DECIMAL).multipliedBy(crssPriceBusd).toNumber()
  })
  return cells
}

export default useAllEarnings
