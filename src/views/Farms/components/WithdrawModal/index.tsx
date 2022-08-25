import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import moment from 'moment'
import { Button, Flex, Modal, RewardsIcon, Text } from '@crosswise/uikit'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { formatDate } from 'utils/formatDate'
import useToast from 'hooks/useToast'
import useTheme from 'hooks/useTheme'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  // ExpandMainInfoButton,
  // PopupBox,
  DepositListItem,
  DepositListItemContent,
  ModalNoPadContainer,
  ModalContainer,
  TransparentInput,
  Panel,
  DepositHistoryTable,
  ChevronUpIcon,
  ChevronDownIcon,
  StyledExpandButton as ExpandButton,
  HorizontalDivider,
  TotalBalance,
} from './styled'

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  depositList?: any
  withdrawLock?: any
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = '',
  depositList,
  withdrawLock,
}) => {
  const { theme } = useTheme()
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [popupDescriptionVisible, setPopupDescriptionVisible] = useState(false)
  const { t } = useTranslation()
  const { rawFullBalance, fullBalance, displayDepositList, extraString, totalAmount } = useMemo(() => {
    const displayDepositListTmp = []
    let extraStringResult = ''
    let latestDate = Number(new Date())
    let totalAmountResult = BIG_ZERO
    if (withdrawLock && depositList && depositList.length) {
      // let withdrawableAmount = BIG_ZERO
      let withdrawableAmount = max
      const now = Number(new Date())
      depositList.forEach((depositListItem) => {
        const depositAt = Number(depositListItem.depositAt)
        const amount = getBalanceNumber(depositListItem.amount).toFixed(2)
        const displayDepositAt = formatDate(depositListItem.depositAt)
        const withdrawable = depositAt + withdrawLock * 1000
        totalAmountResult = totalAmountResult.plus(depositListItem.amount)
        if ((now - depositAt) / 1000 > Number(withdrawLock)) {
          // withdrawableAmount = withdrawableAmount.plus(depositListItem.amount)
          displayDepositListTmp.push({
            amount,
            depositAt: displayDepositAt,
            unlockTime: formatDate(new Date(withdrawable)),
            passed: true,
          })
        } else {
          withdrawableAmount = withdrawableAmount.minus(depositListItem.amount)
          if (latestDate === now || withdrawable < latestDate) {
            latestDate = withdrawable
            extraStringResult = moment(withdrawable).fromNow()
          }
          displayDepositListTmp.push({
            amount,
            depositAt: displayDepositAt,
            unlockTime: formatDate(new Date(withdrawable)),
            passed: false,
          })
        }
      })
      return {
        rawFullBalance: withdrawableAmount,
        fullBalance: getFullDisplayBalance(withdrawableAmount, undefined, 2),
        displayDepositList: displayDepositListTmp,
        extraString: extraStringResult,
        totalAmount: getFullDisplayBalance(totalAmountResult, undefined, 2),
      }
    }
    return {
      rawFullBalance: max,
      fullBalance: getFullDisplayBalance(max),
      displayDepositList: displayDepositListTmp,
      extraString: extraStringResult,
      totalAmount: getFullDisplayBalance(totalAmountResult, undefined, 2),
    }
  }, [max, depositList, withdrawLock])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        // setVal(e.currentTarget.value.replace(/,/g, '.'))
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const isBalanceZero = rawFullBalance.eq(BIG_ZERO)

  return (
    <Modal
      title={t('Unstake LP tokens')}
      icon={<RewardsIcon color={theme.isDark ? 'contrast' : 'bluePalette.accent'} />}
      width="346px"
      onDismiss={onDismiss}
    >
      <ModalNoPadContainer>
        <ModalContainer>
          <Panel flexDirection="column">
            <Flex justifyContent="space-between" mb="8px">
              <Text fontSize="11px" fontWeight="600" color="primaryGray" textTransform="uppercase">
                {t('Unstake')}
              </Text>
              <Text fontSize="11px" fontWeight="600" color="primaryGray" textTransform="uppercase">
                {withdrawLock && Number(withdrawLock) ? t('Unlocked Balance: ') : t('Balance: ')}
                {Number(fullBalance).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <TransparentInput type="number" placeholder="0.00" value={val} step="0.01" onChange={handleChange} />
              <Flex alignItems="center">
                <Button
                  variant="primaryGradientOutline"
                  scale="xs"
                  padding="0px 12px"
                  ml="auto"
                  mr="12px"
                  onClick={handleSelectMax}
                >
                  {t('MAX')}
                </Button>
                <Text fontSize="11px" fontWeight="600" color="primaryGray" textTransform="uppercase" textAlign="right">
                  {tokenName}
                </Text>
              </Flex>
            </Flex>
            {!!withdrawLock && !!depositList && depositList.length > 0 && (
              <TotalBalance
                fontSize="11px"
                fontWeight="600"
                color="primaryGray"
              >{`Total Balance: ${totalAmount}`}</TotalBalance>
            )}
            {/* {!!withdrawLock && !!depositList && depositList.length > 0 && (
              <ExpandMainInfoButton
                onClick={(e) => {
                  e.stopPropagation()
                  setPopupDescriptionVisible(!popupDescriptionVisible)
                }}
              >
                <Text fontSize="12px">Deposit History</Text>
              </ExpandMainInfoButton>
            )} */}
          </Panel>

          <ModalActions>
            <Button
              width="100%"
              disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true)
                try {
                  await onConfirm(val)
                  toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
                  onDismiss()
                } catch (e) {
                  toastError(t('Error'), e)
                } finally {
                  setPendingTx(false)
                }
              }}
              variant="primaryGradient"
            >
              {!!extraString && isBalanceZero
                ? `${displayDepositList.length > 1 ? 'Next Unlock' : 'Unlocks'} ${extraString}`
                : pendingTx
                ? t('Confirming')
                : t('Confirm')}
            </Button>
          </ModalActions>
        </ModalContainer>
      </ModalNoPadContainer>
      {/* {popupDescriptionVisible && (
        <PopupBox>
          <DepositListItem color="">
            <DepositListItemContent>Amount</DepositListItemContent>
            <DepositListItemContent>Deposited At</DepositListItemContent>
          </DepositListItem>
          {displayDepositList?.map((depositListItem, index) => {
            return (
              <DepositListItem
                color={depositListItem.passed ? '#04F8AD' : '#EF1E3B'}
                // eslint-disable-next-line react/no-array-index-key
                key={`${depositListItem.depositAt}-${depositListItem.amount}-${index}`}
              >
                <DepositListItemContent>{depositListItem.amount}</DepositListItemContent>
                <DepositListItemContent>{depositListItem.depositAt}</DepositListItemContent>
              </DepositListItem>
            )
          })}
        </PopupBox>
      )} */}
      <DepositHistoryTable expanded={popupDescriptionVisible}>
        <DepositListItem color="">
          <DepositListItemContent textAlign="left">Amount</DepositListItemContent>
          <DepositListItemContent textAlign="center">Deposited</DepositListItemContent>
          <DepositListItemContent textAlign="right">Unlock</DepositListItemContent>
        </DepositListItem>
        <HorizontalDivider />
        {displayDepositList?.map((depositListItem, index) => {
          return (
            <DepositListItem
              color={depositListItem.passed ? '#04F8AD' : '#EF1E3B'}
              // eslint-disable-next-line react/no-array-index-key
              key={`${depositListItem.depositAt}-${depositListItem.amount}-${index}`}
            >
              <DepositListItemContent textAlign="left">{depositListItem.amount}</DepositListItemContent>
              <DepositListItemContent textAlign="center">{depositListItem.depositAt}</DepositListItemContent>
              <DepositListItemContent textAlign="right">{depositListItem.unlockTime}</DepositListItemContent>
            </DepositListItem>
          )
        })}
      </DepositHistoryTable>
      {!!withdrawLock && !!depositList && depositList.length > 0 && (
        <ExpandButton
          title={<>Deposit History {popupDescriptionVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}</>}
          onClick={() => {
            setPopupDescriptionVisible(!popupDescriptionVisible)
          }}
        />
      )}
    </Modal>
  )
}

export default WithdrawModal
