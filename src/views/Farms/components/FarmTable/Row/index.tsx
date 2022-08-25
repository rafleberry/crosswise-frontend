import React, { useState, useEffect, useCallback, useRef } from 'react'
import { orderBy } from 'lodash'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useMatchBreakpoints, Flex, Text, useModal, Skeleton, ExpandableButton } from '@crosswise/uikit'
import BigNumber from 'bignumber.js'
// import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useFarmUser, usePriceCrssBusd } from 'state/farms/hooks'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useThemeManager } from 'state/user/hooks'
import { AutoOption } from 'state/farms/fetchFarmUser'
import { TokenPairImage } from 'components/TokenImage'
import ConnectWalletButton from 'components/ConnectWalletButton'
import UnclaimedRewardsModal from 'components/UnclaimedRewardsModal'
import HarvestModal from 'components/HarvestModal'
// import SettingModal from 'components/SettingsModal'
import SaveIconButton from 'components/SaveIconButton'
import { useERC20 } from 'hooks/useContract'
// import useDelayedUnmount from 'hooks/useDelayedUnmount'
import useToast from 'hooks/useToast'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { formatDate, getDate } from 'utils/formatDate'
import { BASE_ADD_LIQUIDITY_URL, BASE_BSC_SCAN_URL } from 'config'
import QuestionHelper from 'components/QuestionHelper'
import Apr, { AprProps } from '../Apr'
import { FarmProps } from '../Farm'
import { EarnedProps } from '../Earned'
import { DepositFeeProps } from '../DepositFee'
import Multiplier, { MultiplierProps } from '../Multiplier'
import { LiquidityProps } from '../Liquidity'
import Staked, { StakedProps } from '../Staked'
import { FarmOptionProps } from '../FarmOption'
import ExpandButton from '../ExpandButton'
// import ActionPanel from '../Actions/ActionPanel'
import CellLayout from '../CellLayout'
import DepositModal from '../../DepositModal'
import WithdrawModal from '../../WithdrawModal'
import useApproveFarm from '../../../hooks/useApproveFarm'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import useSwitchCollectOption from '../../../hooks/useSwitchCollectOption'
import useClaimFarm from '../../../hooks/useClaimFarm'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

import {
  Wrapper,
  CellInner,
  StyledTr,
  RowBody,
  TokenWrapper,
  StyledLinkExternal,
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
  ToggleWrapper,
  StyledToggle as Toggle,
  // CrossedText,
  ExpandMainInfoButton,
  LockIcon,
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

const thirtyDays = 1000 * 60 * 60 * 24 * 30

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [showVestingList, setShowVestingList] = useState(false)
  const [showMainInfo, setShowMainInfo] = useState(false)
  const [customIsAuto, setCustomIsAuto] = useState(false)
  const [customIsVest, setCustomIsVest] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const farmNameElement = useRef(null)
  const { toastSuccess, toastError } = useToast()
  // const { t } = useTranslation()
  const [isDark] = useThemeManager()
  const { details, index, farm, multiplier, account, liquidity, apr, userDataReady, farmOption } = props // props has userDataReady
  const { pid, apr: aprAsNumber, lpSymbol, quoteToken, token, isLock, withdrawLock } = details

  const {
    allowance,
    tokenBalance,
    vestingRewards,
    isAuto,
    isVest,
    earnings: earningsAsString = 0,
    stakedBalance: stakedBalanceAsString,
    accumulatedRewards: accumulatedRewardsAsString,
    pendingCrss: pendingCrssAsString,
    vestingList: rawVestingList,
    depositList: rawDepositList,
  } = useFarmUser(pid)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const { onSwitchCollectOption } = useSwitchCollectOption(pid)
  const { onClaimFarm } = useClaimFarm(pid)
  const {
    onHarvestStake,
    onHarvestWithdraw,
    // onVestWithdraw
  } = useHarvestFarm(pid)

  useEffect(() => {
    if (account) {
      setCustomIsAuto(isAuto)
      setCustomIsVest(isVest)
    } else {
      setCustomIsAuto(false)
      setCustomIsVest(false)
    }
  }, [isAuto, isVest, account])

  // const farmNameELementWidth = farmNameElement.current?.offsetWidth || 0

  const lpAddress = getAddress(details.lpAddresses)
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  const bscScanUrl = `${BASE_BSC_SCAN_URL}/address/${lpAddress}`
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()
  const { onApprove } = useApproveFarm(lpContract)

  // const shouldRenderChild = useDelayedUnmount(true, 300)
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const { isXs, isSm } = useMatchBreakpoints()

  const isMobile = isXs || isSm

  const displayLiquidity =
    liquidity && liquidity.liquidity?.gt(0)
      ? `${liquidity.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })} USD`
      : '0 USD'

  const earnings = new BigNumber(earningsAsString)
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN)
  const crssPrice = usePriceCrssBusd()
  const earningsBusd = rawEarningsBalance
    ? rawEarningsBalance.multipliedBy(crssPrice).toFixed(3, BigNumber.ROUND_DOWN)
    : 0

  const rawClaimedRewards = Number.isNaN(accumulatedRewardsAsString.toNumber())
    ? BIG_ZERO
    : getBalanceAmount(accumulatedRewardsAsString)
  const claimedRewardsDisplay = rawClaimedRewards.toFixed(2)
  const claimedRewardsBusd = rawClaimedRewards.multipliedBy(crssPrice).toFixed(2)

  const rawPendingCrss = Number.isNaN(pendingCrssAsString.toNumber()) ? BIG_ZERO : getBalanceAmount(pendingCrssAsString)
  const pendingCrssDisplay = rawPendingCrss.toFixed(2)
  const pendingCrssBusd = rawPendingCrss.multipliedBy(crssPrice).toFixed(2)

  const depositList = rawDepositList.map((depositListItem) => ({
    amount: new BigNumber(depositListItem.amount),
    depositAt: new Date(+depositListItem.depositAt * 1000),
  }))

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
  rawVestingList.map((vesting) => {
    // TODO: Summarize daa per 30 days after a month
    const principal = new BigNumber(vesting.principal)
    const withdrawn = new BigNumber(vesting.withdrawn)

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

  const vestingRewardsBusd = vestingRewards.multipliedBy(crssPrice)

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

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))

      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, dispatch, account, pid])

  const handleStake = async (amount: string) => {
    // Deposit with referrer link
    await onStake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleUnstake = async (amount: string) => {
    await onUnstake(amount)
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleSwitchCollectionOption = async ({ isVesting, autoCompound }) => {
    if (isAuto === autoCompound && isVest === isVesting) return
    setPendingTx(true)
    const value = AutoOption.findIndex((item) => item.autoCompound === autoCompound && item.isVesting === isVesting)
    try {
      await onSwitchCollectOption(value)
      toastSuccess('Success', 'Farm settings updated.')
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    } catch (err) {
      toastError('Error', err)
    } finally {
      setPendingTx(false)
    }
  }
  const handleClaimRewards = async () => {
    await onClaimFarm()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleHarvestStake = async () => {
    await onHarvestStake()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  const handleHarvestWithdraw = async () => {
    await onHarvestWithdraw()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
  }

  // const handleVestWithdraw = async () => {
  //   setPendingTx(true)
  //   try {
  //     await onVestWithdraw(totalWithdrawable.toFixed())
  //     toastSuccess(t('Success!'), t('Successfully withdraw vest.'))
  //   } catch (e) {
  //     toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
  //     console.error(e)
  //   } finally {
  //     setPendingTx(false)
  //   }
  // }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      apr={aprAsNumber}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      addLiquidityUrl={addLiquidityUrl}
      isLock={isLock}
      withdrawLock={withdrawLock}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalanceAsString}
      onConfirm={handleUnstake}
      tokenName={lpSymbol}
      depositList={depositList}
      withdrawLock={details.withdrawLock}
    />,
  )

  const [onPresentUnclaimedRewardsModal] = useModal(
    <UnclaimedRewardsModal
      pairName={farm.label}
      pendingCrss={rawPendingCrss}
      collectOption={{ isAuto, isVest }}
      onHandleClaim={handleClaimRewards}
      onHandleSetting={handleSwitchCollectionOption}
    />,
  )

  const [onPresentHarvestModal] = useModal(
    <HarvestModal
      claimedRewards={rawClaimedRewards}
      onHandleHarvestStake={handleHarvestStake}
      onHandleHarvestWithdraw={handleHarvestWithdraw}
    />,
  )

  const handleSaveSetting = () => {
    if (pendingTx) return
    handleSwitchCollectionOption({ isVesting: customIsVest, autoCompound: customIsAuto })
  }

  const renderOuterLinks = () => (
    <Flex flexDirection={isMobile ? 'row' : 'column'} justifySelf="left" justifyContent={isMobile && 'space-between'}>
      <StyledLinkExternal isMobile={isMobile} href={addLiquidityUrl}>
        Get LP
      </StyledLinkExternal>
      <StyledLinkExternal isMobile={isMobile} href={bscScanUrl}>
        Contract
      </StyledLinkExternal>
      {/* <StyledLinkExternal href="/">Info</StyledLinkExternal> */}
    </Flex>
  )

  const renderClaimOptions = () => (
    <Flex justifyContent="end" justifySelf="end" alignItems="center">
      <Flex flexDirection="column" mr={10}>
        <ToggleWrapper isMobile={isMobile}>
          <Text mr={10} fontSize={isMobile ? '15px' : '16px'}>
            Cosmic Accumulator{' '}
            {/* {account && isVest !== customIsVest && <CrossedText checked={isVest}>{isVest ? 'ON' : 'OFF'}</CrossedText>} */}
          </Text>
          <Toggle
            disabled={!account || !userDataReady || pendingTx}
            // displayValueOption={{ visible: true }}
            scale="md"
            checked={customIsVest}
            onChange={() => setCustomIsVest(!customIsVest)}
          />
          <QuestionHelper
            icon="help"
            ml="10px"
            text="Turn on the Cosmic Accumulator to earn 25% more CRSS in return for vesting your rewards over 5 months. 20% unlocks every 30 days."
          />
        </ToggleWrapper>
        <ToggleWrapper isMobile={isMobile}>
          <Text mr={10} fontSize={isMobile ? '15px' : '16px'}>
            Hyper Accelerator{' '}
            {/* {account && isAuto !== customIsAuto && <CrossedText checked={isAuto}>{isAuto ? 'ON' : 'OFF'}</CrossedText>} */}
          </Text>
          <Toggle
            disabled={!account || !userDataReady || pendingTx}
            // displayValueOption={{ visible: true }}
            scale="md"
            checked={customIsAuto}
            onChange={() => setCustomIsAuto(!customIsAuto)}
          />
          <QuestionHelper
            icon="help"
            ml="10px"
            text="Turn on the Hyper Accelerator to start auto-compounding your rewards, and achieve maximum yields."
          />
        </ToggleWrapper>
        {/* <Text>{`Vesting ${isVest ? 'On' : 'Off'}`}</Text>
            <Text>{`Auto-compound ${isAuto ? 'On' : 'Off'}`}</Text> */}
      </Flex>
      {/* <Text mr={10}>{`Vesting ${isVest ? 'On' : 'Off'}${isAuto ? ' / Auto-compound' : ''}`}</Text> */}
      {/* <SettingIcon onClick={onPresentSettingModal} /> */}
      <SaveIconButton
        onClick={handleSaveSetting}
        visible={account && !(isAuto === customIsAuto && isVest === customIsVest)}
      />
    </Flex>
  )

  const renderRewardsItem = (rewardsInToken: string | number, rewardsInUsd: string | number) => {
    return isMobile ? (
      <Flex justifyContent="space-between" alignItems="center" mt="10px" mb="10px">
        <Text>{userDataReady ? `${rewardsInToken} CRSS` : <Skeleton width={60} />}</Text>
        <Text>{userDataReady ? `~ ${rewardsInUsd} USD` : <Skeleton width={60} />}</Text>
      </Flex>
    ) : (
      <>
        <Text>{userDataReady ? `${rewardsInToken} CRSS` : <Skeleton width={60} />}</Text>
        <Text mt="5px">{userDataReady ? `~ ${rewardsInUsd} USD` : <Skeleton width={60} />}</Text>
      </>
    )
  }

  // const test = () => {
  //   toastSuccess('Success', 'Success Description')
  //   toastError('Error', 'Error Description')
  //   toastInfo('Info', 'Info Description')
  //   toastWarning('Warning', 'Warning Toast')
  // }
  return (
    <Wrapper>
      <StyledTr isLock={isLock} index={index} expanded={showMainInfo} isMobile={isMobile}>
        <RowBody
          columnsTemplate="1.5fr 0.8fr 0.8fr 0.8fr"
          isMobile={isMobile}
          onClick={() => setShowMainInfo(!showMainInfo)}
        >
          <Flex ref={farmNameElement} justifySelf="left" flexDirection="column" mb={isMobile ? 10 : 0}>
            <Flex alignItems="center">
              <TokenWrapper>
                <TokenPairImage primaryToken={farm.token} secondaryToken={farm.quoteToken} width={40} height={40} />
              </TokenWrapper>
              <Text fontWeight="bold" fontSize="16px" color={isDark ? '#fff' : '#060514'}>
                {farm.label}
              </Text>
              <Multiplier {...multiplier} />
              {isLock && <LockIcon />}
            </Flex>
            <Flex alignItems="center">
              <Text fontSize="16px" color={isDark ? '#fff' : '#060514'} mr={10}>
                {displayLiquidity}
              </Text>
              <Text>Liquidity</Text>
            </Flex>
          </Flex>
          <CellInner>
            <CellLayout label="Earned">
              <Flex
                flexDirection={isMobile ? 'row' : 'column'}
                // alignItems={isMobile && 'center'}
                alignItems="center"
              >
                <Text
                  fontSize={isMobile ? '15px' : '17px'}
                  // mr={isMobile ? '10px' : '24px'}
                  color={isDark ? '#fff' : '#060514'}
                >
                  {userDataReady ? (
                    `${(+displayBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} CRSS`
                  ) : (
                    <Skeleton width={60} />
                  )}
                </Text>
                <Text
                  fontSize="13px"
                  // mr={!isMobile && '24px'}
                  mt={!isMobile && '5px'}
                  color={isDark ? '#bfc8da' : '#818ea3'}
                >
                  {userDataReady ? (
                    `~ ${(+earningsBusd).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`
                  ) : (
                    <Skeleton width={60} />
                  )}
                </Text>
              </Flex>
            </CellLayout>
          </CellInner>
          <CellInner alignItems="flex-start">
            <CellLayout label={farmOption.isAuto ? 'APY' : 'APR'}>
              <Apr {...apr} hideButton={isMobile} />
              {/* <Apr {...props.apr} hideButton /> */}
            </CellLayout>
          </CellInner>
          <CellInner>
            <CellLayout label="STAKED">
              <Staked farm={details} staked={stakedBalanceAsString ?? BIG_ZERO} userDataReady={userDataReady} />
            </CellLayout>
          </CellInner>
          <ExpandMainInfoButton>
            <ExpandableButton direction={showMainInfo ? 'up' : 'down'} />
          </ExpandMainInfoButton>
        </RowBody>
        {isLock && (
          <RowBody columnsTemplate="1fr" isMobile={isMobile}>
            <Text fontSize="16px" textAlign="center" color={isDark ? '#fff' : '#060514'} mr={10}>
              {`Earn even higher rewards in return for locking your liquidity for ${getDate(
                Number(withdrawLock) * 1000,
              )}.`}
            </Text>
          </RowBody>
        )}
        <RowBody alignItems="center" isMobile={isMobile}>
          {renderOuterLinks()}
          <Flex justifyContent="center" mt={isMobile && 10} mb={isMobile && 10}>
            {account ? (
              isApproved ? (
                <>
                  <ActionButton
                    width={isMobile ? '100px' : '150px'}
                    variant="primaryGradient"
                    mr={20}
                    onClick={onPresentDeposit}
                  >
                    Deposit
                  </ActionButton>
                  <ActionButton
                    width={isMobile ? '100px' : '150px'}
                    variant="primaryGradient"
                    disabled={!account || earnings.eq(accumulatedRewardsAsString)}
                    onClick={onPresentWithdraw}
                  >
                    Withdraw
                  </ActionButton>
                </>
              ) : (
                <ActionButton
                  width={isMobile ? '100px' : '150px'}
                  variant="primaryGradient"
                  disabled={requestedApproval}
                  onClick={handleApprove}
                  {...(isMobile ? { width: '100%' } : { width: '150px' })}
                >
                  Enable
                </ActionButton>
              )
            ) : (
              <ConnectWalletButton scale="md" variant="primaryGradient" width={isMobile ? '100%' : '150px'} />
            )}
          </Flex>
          {renderClaimOptions()}
        </RowBody>

        {/* <RowBody> */}
        <Flex flexDirection="column" alignItems="center" p={20}>
          {/* <Flex flexDirection="column" justifyContent="center" alignItems="center"> */}
          <EarningRow isMobile={isMobile}>
            <Text
              // width={farmNameELementWidth}
              style={{ justifySelf: 'left' }}
              color={isDark ? 'white' : '#00b8b9'}
            >
              Claimed Rewards
            </Text>
            {/* <Flex flexDirection="column" alignItems="center" mt={10} mb={10}>
            <Text>{userDataReady ? `${claimedRewardsDisplay} CRSS` : <Skeleton width={60} />}</Text>
            <Text mt="5px">{userDataReady ? `~ ${claimedRewardsBusd} USD` : <Skeleton width={60} />}</Text>
          </Flex> */}
            {renderRewardsItem(claimedRewardsDisplay, claimedRewardsBusd)}
            <Flex justifyContent="center" alignItems="center">
              <ActionButton
                variant="primaryGradient"
                onClick={onPresentHarvestModal}
                disabled={rawClaimedRewards.eq(0)}
                {...(isMobile && { width: '100%' })}
              >
                Harvest
              </ActionButton>
            </Flex>
          </EarningRow>
          {/* </Flex> */}
          {/* <Flex flexDirection="column" justifyContent="center" alignItems="center"> */}
          <EarningRow isMobile={isMobile}>
            <Text
              // width={farmNameELementWidth}
              style={{ justifySelf: 'left' }}
              color={isDark ? 'white' : '#00b8b9'}
            >
              Unclaimed Rewards
            </Text>
            {/* <Flex flexDirection="column" alignItems="center" mt={10} mb={10}>
            <Text>{userDataReady ? `${pendingCrssDisplay} CRSS` : <Skeleton width={60} />}</Text>
            <Text mt="5px">{userDataReady ? `~ ${pendingCrssBusd} USD` : <Skeleton width={60} />}</Text>
          </Flex> */}
            {renderRewardsItem(pendingCrssDisplay, pendingCrssBusd)}
            <Flex justifyContent="center" alignItems="center">
              <ActionButton
                variant="primaryGradient"
                onClick={onPresentUnclaimedRewardsModal}
                disabled={rawPendingCrss.eq(0)}
                {...(isMobile && { width: '100%' })}
              >
                Claim
              </ActionButton>
            </Flex>
          </EarningRow>
          {/* </Flex> */}
          {/* <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          onClick={() => setShowVestingList(!!vestingList && vestingList.length > 0 && !showVestingList)}
        > */}
          <EarningRow isMobile={isMobile}>
            <Text
              // width={farmNameELementWidth}
              style={{ justifySelf: 'left' }}
              color={isDark ? 'white' : '#00b8b9'}
            >
              Vesting Rewards
            </Text>
            {/* <Flex flexDirection="column" alignItems="center" mt={10} mb={10}>
            <Text>{userDataReady ? `${getBalanceNumber(vestingRewards)} CRSS` : <Skeleton width={60} />}</Text>
            <Text mt="5px">
              {userDataReady ? `~ ${getBalanceNumber(vestingRewardsBusd)} USD` : <Skeleton width={60} />}
            </Text>
          </Flex> */}
            {renderRewardsItem(
              getBalanceNumber(vestingRewards).toFixed(2),
              getBalanceNumber(vestingRewardsBusd).toFixed(2),
            )}
            <NextUnlockPanel flexDirection="column" alignItems="center" justifyContent="center" isMobile={isMobile}>
              <Text fontSize="12px">Next Unlock</Text>
              <Text fontSize="12px">
                {userDataReady ? Number(latestDate) ? formatDate(latestDate) : 'None' : <Skeleton width={75} />}
              </Text>
            </NextUnlockPanel>
            {/* <Flex justifyContent="space-evenly" alignItems="center">
            <Flex flexDirection="column" alignItems="center">
              <Text>Next Unlock</Text>
              <Text>
                {userDataReady ? Number(latestDate) ? formatDate(latestDate) : 'None' : <Skeleton width={60} />}
              </Text>
            </Flex>
            <ActionButton
              ml={20}
              variant="primaryGradient"
              disabled={totalWithdrawable.eq(0) || pendingTx}
              onClick={handleVestWithdraw}
            >
              Vest Withdraw
            </ActionButton>
          </Flex> */}
          </EarningRow>
          {/* </Flex> */}
        </Flex>
        {/* </RowBody> */}

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
            // const withdrawn = getBalanceNumber(new BigNumber(vestingItem.withdrawn))
            // const withdrawable = getBalanceNumber(new BigNumber(vestingItem.withdrawableAmount))
            const startDate = new Date(+vestingItem.startTime * 1000)

            return (
              <VestingListTableRow key={vestingItem.startTime}>
                <VestingListTableCell
                  textAlign="left"
                  //  color={isDark ? '#04F8AD' : '#00b8b9'}
                  color={isDark ? '#04F8AD' : 'black'}
                >
                  {formatDate(startDate)}
                </VestingListTableCell>
                <VestingListTableCell>{`${principal} CRSS`}</VestingListTableCell>
                <VestingListTableCell>{`~ ${principalBusd} USD`}</VestingListTableCell>
                {/* <VestingListTableCell>{withdrawn}</VestingListTableCell>
            <VestingListTableCell>{withdrawable}</VestingListTableCell> */}
                {/* <VestingListTableCell>{vestingItem.nextWithdrawableDate}</VestingListTableCell> */}
                <VestingListTableCell textAlign="right">{vestingItem.remainDate}</VestingListTableCell>
              </VestingListTableRow>
            )
          })}
        </VestingListTable>

        {/* {showVestingList && (
        <>
          <ExpandButton title="" />
        </>
      )} */}
        <ExpandButton
          title={<>Vesting Details {showVestingList ? <ChevronUpIcon /> : <ChevronDownIcon />}</>}
          onClick={() => setShowVestingList(!!vestingList && vestingList.length > 0 && !showVestingList)}
        />
      </StyledTr>
    </Wrapper>
  )
}

export default Row
