import React, { useCallback, useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Text, Flex, Link, RewardsIcon } from '@crosswise/uikit'
import { useFarms, usePriceCrssBusd } from 'state/farms/hooks'
import useLpPrice from 'hooks/useLpPrice'
import useTheme from 'hooks/useTheme'
import { usdEarnedCompounding } from 'utils/compoundApyHelpers'
import { getDate } from 'utils/formatDate'
// import { ModalActions, ModalInput, ExpandButton } from 'components/Modal'
import { ModalActions, ExpandButton } from 'components/Modal'
import { Panel, TransparentInput } from 'components/ApyCalculatorModal/styled'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
// import { Farm } from 'state/types'
import {
  StyledModal as Modal,
  ModalNoPadContainer,
  ModalContainer,
  // ModalHeader
} from './styled'
import ApyButton from '../FarmCard/ApyButton'

interface DepositModalProps {
  max: BigNumber
  apr?: number
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  addLiquidityUrl?: string
  isLock?: boolean
  withdrawLock?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  apr,
  onConfirm,
  onDismiss,
  tokenName = '',
  addLiquidityUrl,
  isLock,
  withdrawLock,
}) => {
  const { theme } = useTheme()
  const [val, setVal] = useState('')
  const [roiAtCurrentRate, setRoiAtCurrentRate] = useState(0)
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, undefined, 2)
  }, [max])

  const crssPriceUsd = usePriceCrssBusd()

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const { data: farms } = useFarms()
  const selectedFarm = farms.find((item) => item?.lpSymbol?.toLowerCase() === tokenName.toLowerCase())
  const lpPriceInUsd = useLpPrice(selectedFarm)

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

  useEffect(() => {
    const valueInUSD = lpPriceInUsd.times(val).toNumber()
    const isChkCompound = selectedFarm?.userData?.isAuto || false

    const compoundOption = {
      balance: valueInUSD,
      numberOfDays: 365,
      farmApr: apr,
      roundingDecimals: 2,
      compoundFrequency: isChkCompound ? 24 * 6 : 0, // !compounding is achieved every 10 mins
      // compoundFrequency: isChkCompound ? 1 / compoundPeriod : 0,
      performanceFee: 0,
    }
    const usdEarned = usdEarnedCompounding(compoundOption)
    setRoiAtCurrentRate(usdEarned)
  }, [val, apr, selectedFarm, lpPriceInUsd])

  return (
    <Modal
      title={t('Stake LP tokens')}
      icon={<RewardsIcon color={theme.isDark ? 'contrast' : 'bluePalette.accent'} />}
      width="346px"
      onDismiss={onDismiss}
    >
      <ModalNoPadContainer>
        <ModalContainer>
          {isLock && (
            <Text fontSize="12px" color="primaryGray" textAlign="justify" mb="10px">
              {`You are about to deposit into a Locked farm. Your liquidity will be locked for ${getDate(
                new Date(Number(withdrawLock) * 1000),
              )} in return for a higher yield.`}
            </Text>
          )}
          <Panel flexDirection="column">
            <Flex justifyContent="space-between" mb="8px">
              <Text fontSize="11px" fontWeight="600" color="primaryGray" textTransform="uppercase">
                {t('Stake')}
              </Text>
              <Text fontSize="11px" fontWeight="600" color="primaryGray" textTransform="uppercase">
                {t('Balance: ')}
                {fullBalance}
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
          </Panel>
          {/* <ModalInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={fullBalance}
            symbol={tokenName}
            addLiquidityUrl={addLiquidityUrl}
            inputTitle={t('Stake')}
          /> */}
          <Flex alignItems="center" justifyContent="space-between" mt="32px" mb="8px">
            <Text fontSize="10px" fontWeight="600" color="primaryGray" textTransform="uppercase">
              {t('Annual ROI at current rates:')}
            </Text>
            <Flex alignItems="center">
              <Text fontSize="16px" color="primaryGray">
                {roiAtCurrentRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Text>
              <ApyButton
                lpLabel={tokenName}
                addLiquidityUrl={addLiquidityUrl}
                crssPrice={crssPriceUsd}
                apr={apr}
                // displayApr={displayApr}
              />
            </Flex>
          </Flex>
          <ModalActions>
            <Button
              width="100%"
              disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
              onClick={async () => {
                setPendingTx(true)
                try {
                  await onConfirm(val)
                  toastSuccess(t('Staked!'), t('Your funds have been staked in the farm'))
                  onDismiss()
                } catch (e) {
                  toastError(t('Error'), e)
                } finally {
                  setPendingTx(false)
                }
              }}
              variant="primaryGradient"
            >
              {pendingTx ? t('Confirming') : t('Confirm')}
            </Button>
          </ModalActions>
        </ModalContainer>

        <Link href={addLiquidityUrl} target="_blank" style={{ alignSelf: 'center', width: '100%' }}>
          <ExpandButton width="100%" title={t('Get %symbol%', { symbol: tokenName })} />
        </Link>
      </ModalNoPadContainer>
    </Modal>
  )
}

export default DepositModal
