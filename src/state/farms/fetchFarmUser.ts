import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'

export const AutoOption = [
  { autoCompound: false, isVesting: false },
  { autoCompound: true, isVesting: false },
  { autoCompound: true, isVesting: true },
  { autoCompound: false, isVesting: true },
]

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAddress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserInfo = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()
  let userStateCalls = []
  const userInfoCalls = []
  // const subPoolCrssCall = []
  const vestingListCall = []

  userStateCalls = farmsToFetch.map((farm) => {
    userInfoCalls.push({
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    })
    // subPoolCrssCall.push({
    //   address: masterChefAddress,
    //   name: 'getSubPooledCrss',
    //   params: [farm.pid, account],
    // })
    vestingListCall.push({
      address: masterChefAddress,
      name: 'getVestList',
      params: [farm.pid, account],
    })
    return {
      address: masterChefAddress,
      // name: 'userInfo',
      name: 'getUserState',
      params: [farm.pid, account],
    }
  })

  const rawUserState = await multicall(masterchefABI, userStateCalls)

  const rawUserInfo = await multicall(masterchefABI, userInfoCalls)

  // const rawSubPooledCrss = await multicall(masterchefABI, subPoolCrssCall)

  const rawVestingList = await multicall(masterchefABI, vestingListCall)

  try {
    const parsedStakedBalances = rawUserState.map((userStateItem, index) => {
      const userState = userStateItem[0]
      const userInfo = rawUserInfo[index]
      // const subPooledCrss = rawSubPooledCrss[index][0]
      const vestingList = rawVestingList[index][0]
      const {
        pendingCrss: pending,
        pendingPerBlock,
        rewardPayroll,
        // thresholdBusdWei,
      } = userState.behavior
      const parseBignumber = (value) => new BigNumber(value._hex).toJSON()
      const depositList = userState.assets.depositList.map((depositListItem) => ({
        amount: parseBignumber(depositListItem.amount),
        depositAt: parseBignumber(depositListItem.depositAt),
      }))

      // const pendingCrss = userState.behavior.pendingCrss.add(subPooledCrss.toAccumulate).add(subPooledCrss.toVest)
      const { pendingCrss } = userState.behavior
      let vestingRewards = BIG_ZERO
      const vestingListResult = vestingList.map((listItem) => {
        vestingRewards = vestingRewards
          .plus(parseBignumber(listItem.principal))
          .minus(parseBignumber(listItem.withdrawn))
        return listItem && listItem.length
          ? {
              principal: new BigNumber(listItem.principal._hex).toJSON(),
              startTime: new BigNumber(listItem.startTime._hex).toJSON(),
              withdrawn: new BigNumber(listItem.withdrawn._hex).toJSON(),
            }
          : []
      })

      return {
        // stakedBalance: new BigNumber(userState.amount._hex).toJSON(),
        // accumulatedRewards: new BigNumber(userState.accumulatedRewards._hex).toJSON(),
        // ...AutoOption[rawUserState.autoOption || 0],
        stakedBalance: new BigNumber(userState.behavior.rewardPayroll._hex).toJSON(),
        accumulatedRewards: new BigNumber(userState.assets.accRewards._hex).toJSON(),
        // pendingCrss: new BigNumber(userState.pendingCrss._hex).toJSON(),
        pendingCrss: new BigNumber(pendingCrss._hex).toJSON(),
        // claimedRewards: new BigNumber(userInfo.accumulatedRewards._hex).toJSON(),
        claimedRewards: new BigNumber(userInfo.accumulated._hex).toJSON(),
        vestingRewards: vestingRewards.toJSON(),
        // vestingRewards: new BigNumber(userState.assets.totalVest._hex).toJSON(),
        vestingList: vestingListResult,
        depositList,
        behavior: [
          parseBignumber(pending),
          parseBignumber(pendingPerBlock),
          parseBignumber(rewardPayroll),
          parseBignumber({ _hex: '100000000000000' }),
        ],
        ...AutoOption[userState.assets.collectOption || 0],
      }
    })
    return parsedStakedBalances
  } catch (err) {
    console.error('here', err)
    return []
  }
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'stakedTokens',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'getUserState',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchFarmUserOption = async (account: string, farmsToFetch: FarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawOption = await multicall(masterchefABI, calls)
  const parsedOption = rawOption.map((auto) => {
    return [auto.isAuto, auto.isVest]
  })
  return parsedOption
}
