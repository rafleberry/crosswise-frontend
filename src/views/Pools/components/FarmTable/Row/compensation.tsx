import React, { useState, useEffect, useRef } from 'react'
import { orderBy } from 'lodash'
import { FarmWithStakedValue } from 'views/Pools/components/FarmCard/FarmCard'
import { useMatchBreakpoints, Flex, Text, useModal, Skeleton, ExpandableButton } from '@crosswise/uikit'
import BigNumber from 'bignumber.js'
// import { useTranslation } from 'contexts/Localization'
import { usePriceCrssBusd } from 'state/pools/hooks'
import { useThemeManager } from 'state/user/hooks'
import { TokenImage } from 'components/TokenImage'
import UnclaimedRewardsModal from 'components/UnclaimedCompensationRewardsModal'
// import SettingModal from 'components/SettingsModal'
// import useDelayedUnmount from 'hooks/useDelayedUnmount'
// import useToast from 'hooks/useToast'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { formatDate } from 'utils/formatDate'

import { AprProps } from '../Apr'
import { FarmProps } from '../Farm'
import { EarnedProps } from '../Earned'
import { DepositFeeProps } from '../DepositFee'
import { MultiplierProps } from '../Multiplier'
import { LiquidityProps } from '../Liquidity'
import { StakedProps } from '../Staked'
import { FarmOptionProps } from '../FarmOption'
import ExpandButton from '../ExpandButton'
// import ActionPanel from '../Actions/ActionPanel'
import CellLayout from '../CellLayout'
import useCompensation from '../../../hooks/useCompensation'

import {
  CellInner,
  StyledTr,
  RowBody,
  TokenWrapper,
  ActionButton,
  VestingListTable,
  VestingListTableRow,
  VestingListTableCell,
  VestingListTableHeaderCell,
  EarningRow,
  NextUnlockPanel,
  // StyledSettingIcon as SettingIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExpandMainInfoButton,
} from './styled'

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  staked: StakedProps
  depositFee: DepositFeeProps
  farmOption: FarmOptionProps
  details: FarmWithStakedValue
  userData: {
    accumulatedRewards: number
    pendingCrss: number
    vestingRewards: number
  }
  account: string
  index?: number
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

type VestingItemType = {
  principal: BigNumber
  withdrawn: BigNumber
  withdrawableAmount: BigNumber
  startTime: any
  nextWithdrawableDate: any
  remainDate: string
}

type UserInfo = {
  pendingCrss?: number
  staked?: number
  isLoaded: boolean
  withdrawable?: number
  vestList: any[]
}
const thirtyDays = 1000 * 60 * 60 * 24 * 30

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const [showVestingList, setShowVestingList] = useState(false)
  const [showMainInfo, setShowMainInfo] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    pendingCrss: 0,
    staked: 0,
    isLoaded: false,
    vestList: [],
    withdrawable: 0,
  })
  const poolNameElement = useRef(null)
  const [isDark] = useThemeManager()
  const { index, farm, userDataReady } = props // props has userDataReady
  const { getUserState, handleClaim } = useCompensation()

  useEffect(() => {
    async function getState() {
      const data = await getUserState()
      setUserInfo(data)
    }
    getState()
  }, [getUserState])
  // const poolNameELementWidth = poolNameElement.current?.offsetWidth || 0

  const { isXs, isSm } = useMatchBreakpoints()

  const isMobile = isXs || isSm

  const crssPrice = usePriceCrssBusd()
  let crrDate = null
  let crrItem: VestingItemType = {
    principal: BIG_ZERO,
    withdrawn: BIG_ZERO,
    withdrawableAmount: BIG_ZERO,
    startTime: null,
    nextWithdrawableDate: null,
    remainDate: null,
  }
  const vestingList = []
  const now = new Date()
  let totalWithdrawable = BIG_ZERO
  userInfo.vestList.map((vesting) => {
    // TODO: Summarize daa per 30 days after a month
    const principal = new BigNumber(vesting.principal._hex)
    const withdrawn = new BigNumber(vesting.withdrawn._hex)

    const startTime = +vesting.startTime * 1000
    if (!crrDate) crrDate = formatDate(new Date(startTime))
    const withdrawnCount = Math.floor((Number(now) - startTime) / thirtyDays)
    const nextWithdrawableDate = new Date(startTime)
    nextWithdrawableDate.setDate(nextWithdrawableDate.getDate() + 30 * (withdrawnCount + 1))
    // nextWithdrawableDate = formatDate(nextWithdrawableDate)
    const remainDate = Math.ceil((Number(nextWithdrawableDate) - Number(now)) / (1000 * 60 * 60 * 24))

    const withdrawableAmount = principal.multipliedBy(withdrawnCount / 5).minus(withdrawn)
    totalWithdrawable = totalWithdrawable.plus(withdrawableAmount)

    if (formatDate(new Date(startTime)) === crrDate) {
      crrItem.principal = crrItem.principal.plus(principal)
      crrItem.startTime = vesting.startTime
      crrItem.withdrawn = crrItem.withdrawn.plus(withdrawn)
      crrItem.withdrawableAmount = crrItem.withdrawableAmount.plus(withdrawableAmount)
      crrItem.nextWithdrawableDate = formatDate(nextWithdrawableDate)
      crrItem.remainDate = `${remainDate} days`
    } else {
      vestingList.push(crrItem)
      crrDate = formatDate(new Date(startTime))
      crrItem = {
        principal: BIG_ZERO,
        withdrawn: BIG_ZERO,
        withdrawableAmount: BIG_ZERO,
        startTime: null,
        nextWithdrawableDate: null,
        remainDate: null,
      }
    }
    return true
  })
  if (crrItem.startTime) vestingList.push(crrItem)

  const orderedVestingList = orderBy(vestingList, 'startTime', 'desc')

  const nowDate = Number(new Date())
  const orderedVestingListByDate = orderBy(
    vestingList,
    (vesting) => {
      return (nowDate - +vesting.startTime * 1000) % thirtyDays
    },
    'desc',
  )
  let latestDateAsNumber = +orderedVestingListByDate[0]?.startTime * 1000
  latestDateAsNumber += latestDateAsNumber ? Math.ceil((nowDate - latestDateAsNumber) / thirtyDays) * thirtyDays : 0
  const latestDate = new Date(latestDateAsNumber)

  // const handleClaimRewards = async (vestStatus) => {
  //   const result = await handleClaim(vestStatus)
  //   if (result) setUserInfo({ ...userInfo, pendingCrss: 0 });

  // }

  const [onPresentUnclaimedRewardsModal] = useModal(
    <UnclaimedRewardsModal
      pairName={farm.label}
      pendingCrss={new BigNumber(userInfo.pendingCrss)}
      onHandleClaim={handleClaim}
    />,
  )

  const renderRewardsItem = (rewardsInToken: string | number, rewardsInUsd: string | number) => {
    return isMobile ? (
      <Flex justifyContent="space-between" alignItems="center" mt="10px" mb="10px">
        <Text>{userInfo.isLoaded ? `${rewardsInToken} CRSS` : <Skeleton width={60} />}</Text>
        <Text>{userInfo.isLoaded ? `~ ${rewardsInUsd} USD` : <Skeleton width={60} />}</Text>
      </Flex>
    ) : (
      <>
        <Text>{userInfo.isLoaded ? `${rewardsInToken} CRSS` : <Skeleton width={60} />}</Text>
        <Text mt="5px">{userInfo.isLoaded ? `~ ${rewardsInUsd} USD` : <Skeleton width={60} />}</Text>
      </>
    )
  }

  return (
    <StyledTr index={index} expanded={showMainInfo} isMobile={isMobile}>
      <RowBody
        columnsTemplate="1.5fr 0.8fr 0.8fr 0.8fr"
        isMobile={isMobile}
        onClick={() => setShowMainInfo(!showMainInfo)}
      >
        <Flex ref={poolNameElement} justifySelf="left" flexDirection="column" mb={isMobile ? 10 : 0}>
          <Flex alignItems="center">
            <TokenWrapper>
              <TokenImage token={farm.token} width={40} height={40} />
            </TokenWrapper>
            <Text fontWeight="bold" fontSize="16px" color={isDark ? '#fff' : '#060514'}>
              {farm.label} - Compensation
            </Text>
          </Flex>
          <Flex alignItems="center" />
        </Flex>
        <CellInner>
          <CellLayout label="Earned">
            <Flex flexDirection={isMobile ? 'row' : 'column'} alignItems={isMobile && 'center'}>
              <Text
                fontSize={isMobile ? '15px' : '17px'}
                mr={isMobile ? '10px' : '0px'}
                color={isDark ? '#fff' : '#060514'}
              >
                {userInfo.isLoaded ? `${userInfo.pendingCrss.toFixed(2)} CRSS` : <Skeleton width={60} />}
              </Text>
              <Text
                fontSize="13px"
                mr={!isMobile && '0px'}
                mt={!isMobile && '5px'}
                color={isDark ? '#bfc8da' : '#818ea3'}
              >
                {userInfo.isLoaded ? (
                  `~ ${crssPrice.times(userInfo.pendingCrss).toFixed(2)} USD`
                ) : (
                  <Skeleton width={60} />
                )}
              </Text>
            </Flex>
          </CellLayout>
        </CellInner>
        <CellInner alignItems="flex-start">
          <CellLayout label="">{/* <Apr {...apr} hideButton={isMobile} /> */}</CellLayout>
        </CellInner>
        <CellInner>
          <CellLayout label="Total Reserve">
            <Flex flexDirection={isMobile ? 'row' : 'column'} alignItems={isMobile && 'center'}>
              <Text
                fontSize={isMobile ? '15px' : '17px'}
                mr={isMobile ? '10px' : '0px'}
                color={isDark ? '#fff' : '#060514'}
              >
                {userInfo.isLoaded ? `${userInfo.staked.toFixed(2)} CRSS` : <Skeleton width={60} />}
              </Text>
              <Text
                fontSize="13px"
                mr={!isMobile && '0px'}
                mt={!isMobile && '5px'}
                color={isDark ? '#bfc8da' : '#818ea3'}
              >
                {userInfo.isLoaded ? `~ ${crssPrice.times(userInfo.staked).toFixed(2)} USD` : <Skeleton width={60} />}
              </Text>
            </Flex>
          </CellLayout>
        </CellInner>
        <ExpandMainInfoButton>
          <ExpandableButton direction={showMainInfo ? 'up' : 'down'} />
        </ExpandMainInfoButton>
      </RowBody>
      <Flex flexDirection="column" alignItems="center" p={20}>
        <EarningRow isMobile={isMobile}>
          <Text
            // width={poolNameELementWidth}
            style={{ justifySelf: 'left' }}
            color={isDark ? 'white' : '#00b8b9'}
          >
            Pending Rewards
          </Text>
          {renderRewardsItem(userInfo.pendingCrss.toFixed(2), crssPrice.times(userInfo.pendingCrss).toFixed(2))}
          <Flex justifyContent="center" alignItems="center">
            <ActionButton
              variant="primaryGradient"
              onClick={onPresentUnclaimedRewardsModal}
              disabled={userInfo.pendingCrss === 0}
              {...(isMobile ? { width: '100%' } : { width: '150px' })}
            >
              Harvest
            </ActionButton>
          </Flex>
        </EarningRow>
        <EarningRow isMobile={isMobile}>
          <Text
            // width={poolNameELementWidth}
            style={{ justifySelf: 'left' }}
            color={isDark ? 'white' : '#00b8b9'}
          >
            Vesting Rewards
          </Text>
          {renderRewardsItem(userInfo.withdrawable.toFixed(2), crssPrice.times(userInfo.withdrawable).toFixed(2))}
          <NextUnlockPanel flexDirection="column" alignItems="center" justifyContent="center" isMobile={isMobile}>
            <Text fontSize="12px">Next Unlock</Text>
            <Text fontSize="12px">
              {userDataReady ? Number(latestDate) ? formatDate(latestDate) : 'None' : <Skeleton width={75} />}
            </Text>
          </NextUnlockPanel>
        </EarningRow>
      </Flex>

      <VestingListTable expanded={showVestingList} isMobile={isMobile}>
        <VestingListTableRow style={{ borderBottom: 'solid 1px #C4C4C4' }}>
          <VestingListTableHeaderCell textAlign="left">Date</VestingListTableHeaderCell>
          <VestingListTableHeaderCell>Amount Token</VestingListTableHeaderCell>
          <VestingListTableHeaderCell>Amount FIAT</VestingListTableHeaderCell>
          <VestingListTableHeaderCell textAlign="right">Duration</VestingListTableHeaderCell>
        </VestingListTableRow>
        {orderedVestingList.map((vestingItem) => {
          const principalAmount = new BigNumber(vestingItem.principal).dividedBy(5)
          const principal = getBalanceNumber(principalAmount).toFixed(isMobile ? 0 : 2)
          const principalBusd = getBalanceNumber(principalAmount.multipliedBy(crssPrice)).toFixed(isMobile ? 0 : 2)
          const startDate = new Date(+vestingItem.startTime * 1000)

          return (
            <VestingListTableRow key={vestingItem.startTime}>
              <VestingListTableCell textAlign="left" color={isDark ? '#04F8AD' : '#00b8b9'}>
                {formatDate(startDate)}
              </VestingListTableCell>
              <VestingListTableCell>{`${principal} CRSS`}</VestingListTableCell>
              <VestingListTableCell>{`~ ${principalBusd} USD`}</VestingListTableCell>
              <VestingListTableCell textAlign="right">{vestingItem.remainDate}</VestingListTableCell>
            </VestingListTableRow>
          )
        })}
      </VestingListTable>
      <ExpandButton
        title={<>Vesting Details {showVestingList ? <ChevronUpIcon /> : <ChevronDownIcon />}</>}
        onClick={() => setShowVestingList(!!vestingList && vestingList.length > 0 && !showVestingList)}
      />
    </StyledTr>
  )
}

export default Row
