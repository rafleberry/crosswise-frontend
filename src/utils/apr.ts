import BigNumber from 'bignumber.js'
import { CAKE_PER_YEAR, CRSS_PER_TENMIN, TENMIN_IN_YEAR } from 'config'
import lpAprs from 'config/constants/lpAprs.json'

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  userTotalStaked: number,
  poolWeight: BigNumber,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(poolWeight)
    .times(CAKE_PER_YEAR)
    .div(totalStaked)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param crssPriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  crssPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
): { cakeRewardsApr: number; lpRewardsApr: number } => {
  let crssRewardsApr = new BigNumber(0)
  // if(isAuto) {
  //   const tenMinCrssRewardAllocationPercent = CRSS_PER_TENMIN.times(poolWeight).div(poolLiquidityUsd)
  //   crssRewardsApr = tenMinCrssRewardAllocationPercent.plus(new BigNumber(1)).pow(356).minus(new BigNumber(1))
  // }
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeight)
  crssRewardsApr = yearlyCakeRewardAllocation.times(crssPriceUsd).div(poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber = null
  if (!crssRewardsApr.isNaN() && crssRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = crssRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr }
}

export default null
