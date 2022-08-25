import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import moment from 'moment'
import { Button, ExpandableButton, Modal } from '@crosswise/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { formatDate } from 'utils/formatDate'
import useToast from 'hooks/useToast'
import { BIG_ZERO } from 'utils/bigNumber'
import { ExpandMainInfoButton, PopupBox, DepositListItem, DepositListItemContent } from './styled'

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
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [popupDescriptionVisible, setPopupDescriptionVisible] = useState(false)
  const { t } = useTranslation()
  const { fullBalance, displayDepositList, extraString } = useMemo(() => {
    const displayDepositListTmp = []
    let extraStringResult = ''
    let latestDate = Number(new Date())
    if (withdrawLock && depositList && depositList.length) {
      let withdrawableAmount = BIG_ZERO
      const now = Number(new Date())
      depositList.forEach((depositListItem) => {
        const depositAt = Number(depositListItem.depositAt)
        const amount = getBalanceNumber(depositListItem.amount).toFixed(2)
        const displayDepositAt = formatDate(depositListItem.depositAt)
        if ((now - depositAt) / 1000 > Number(withdrawLock)) {
          withdrawableAmount = withdrawableAmount.plus(depositListItem.amount)
          displayDepositListTmp.push({
            amount,
            depositAt: displayDepositAt,
            passed: true,
          })
        } else {
          const withdrawable = depositAt + withdrawLock * 1000
          if (latestDate === now || withdrawable < latestDate) {
            latestDate = withdrawable
            extraStringResult = moment(withdrawable).fromNow()
          }
          displayDepositListTmp.push({
            amount,
            depositAt: displayDepositAt,
            passed: false,
          })
        }
      })
      return {
        fullBalance: getFullDisplayBalance(withdrawableAmount),
        displayDepositList: displayDepositListTmp,
        extraString: extraStringResult,
      }
    }
    return {
      fullBalance: getFullDisplayBalance(max),
      displayDepositList: displayDepositListTmp,
      extraString: extraStringResult,
    }
  }, [max, depositList, withdrawLock])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={t('Unstake LP tokens')} onDismiss={onDismiss} onClick={() => setPopupDescriptionVisible(false)}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        balanceLabel="Withdrawable"
        inputTitle={t('Unstake')}
        hideNoneBalanceString
        extraString={extraString}
      />
      {!!withdrawLock && !!depositList && depositList.length > 0 && (
        <ExpandMainInfoButton
          onClick={(e) => {
            e.stopPropagation()
            setPopupDescriptionVisible(!popupDescriptionVisible)
          }}
        >
          <ExpandableButton direction={popupDescriptionVisible ? 'left' : 'right'} />
        </ExpandMainInfoButton>
      )}
      <ModalActions>
        <Button variant="secondaryGradient" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
          onClick={async () => {
            setPendingTx(true)
            try {
              await onConfirm(val)
              toastSuccess(t('Unstaked!'), t('Your earnings have also been harvested to your wallet'))
              onDismiss()
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              console.error(e)
            } finally {
              setPendingTx(false)
            }
          }}
          variant="primaryGradient"
          width="100%"
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </ModalActions>
      {popupDescriptionVisible && (
        <PopupBox>
          <DepositListItem color="">
            <DepositListItemContent textAlign="">Amount</DepositListItemContent>
            <DepositListItemContent textAlign="">Deposited At</DepositListItemContent>
          </DepositListItem>
          {displayDepositList?.map((depositListItem, index) => {
            return (
              <DepositListItem
                color={depositListItem.passed ? '#04F8AD' : '#EF1E3B'}
                // eslint-disable-next-line react/no-array-index-key
                key={`${depositListItem.depositAt}-${depositListItem.amount}-${index}`}
              >
                <DepositListItemContent textAlign="">{depositListItem.amount}</DepositListItemContent>
                <DepositListItemContent textAlign="">{depositListItem.depositAt}</DepositListItemContent>
              </DepositListItem>
            )
          })}
        </PopupBox>
      )}
    </Modal>
  )
}

export default WithdrawModal
