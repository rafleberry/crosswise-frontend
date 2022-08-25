import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Text, Modal, InjectedModalProps, useModal, Flex } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { formatDate } from 'utils/formatDate'
import { Container, FlexBox, Divider, StyledBtn, Common, StyledSpan, StyledToggle, ToggleWrapper } from './styled'

interface UnclaimedRewardsModalProps extends InjectedModalProps {
  pairName: string
  pendingCrss: BigNumber
  onHandleClaim?: any
}

const UnclaimedRewardsModal: React.FC<UnclaimedRewardsModalProps> = ({
  onDismiss,
  pairName,
  pendingCrss,
  onHandleClaim,
}) => {
  const [pendingTx, setPendingTx] = useState(false)
  const [isVest, setVest] = useState(false)
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()

  const rawBonusCrss = pendingCrss.div(4)
  const bonusCrssDisplay = rawBonusCrss.toFixed(5)

  const rawTotalRewardsCrss = pendingCrss
  const totalRewardsCrssDisplay = rawTotalRewardsCrss.toFixed(5)

  const rawPendingCrss = rawTotalRewardsCrss.minus(rawBonusCrss)
  const pendingCrssDisplay = rawPendingCrss.toFixed(5)

  const rawEveryMonthCrss = rawTotalRewardsCrss.div(10)
  const everyMonthCrssDisplay = rawEveryMonthCrss.toFixed(5)

  const limitDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 150)

  const handleClaim = async () => {
    if (!onHandleClaim) return
    setPendingTx(true)
    try {
      await onHandleClaim(isVest)
      toastSuccess(t('Claimed!'), t('Your rewards have been claimed'))
      onDismiss()
    } catch (e) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }

  return (
    <Modal minWidth="300px" maxWidth="550px" width="100%" onDismiss={onDismiss}>
      <Container>
        <Text fontSize="24px">{t('Unclaimed Rewards')}</Text>
        <Common>
          <Text>{t('Unlocked Rewards Balance')}</Text>
          <FlexBox flexDirection="column">
            <Text>{`${pendingCrssDisplay} CRSS`}</Text>
            <Text>{`~${pendingCrssDisplay} USD`}</Text>
          </FlexBox>
        </Common>
        <Divider />
        <Common>
          <Text textAlign="center">{t('Select Reward Vesting')}</Text>
          <Text margin={10} fontSize="20px" textAlign="center">
            {t('5 Months')}
          </Text>
        </Common>
        <Common>
          <Flex justifyContent="end" alignItems="center">
            <Flex flexDirection="column" mr={10}>
              <ToggleWrapper>
                <Text mr={10} fontSize="20px">
                  Enable Reward Vesting{' '}
                  {/* {account && isVest !== customIsVest && <CrossedText checked={isVest}>{isVest ? 'ON' : 'OFF'}</CrossedText>} */}
                </Text>
                <StyledToggle
                  scale="md"
                  checked={isVest}
                  onChange={() => {
                    setVest(!isVest)
                  }}
                />
              </ToggleWrapper>
            </Flex>
          </Flex>
        </Common>
        <Common>
          {isVest ? (
            <Text textAlign="center">{`Rewards Unlock: ${everyMonthCrssDisplay} CRSS every 30 days until ${formatDate(
              limitDate,
            )}`}</Text>
          ) : (
            <Text>Enable Reward Vesting to earn your Vesting Bonus</Text>
          )}
          <FlexBox flexDirection="column">
            <Text>{t('Bonus')}</Text>
            <Text>{`${bonusCrssDisplay} CRSS ~ ${bonusCrssDisplay} USD`}</Text>
          </FlexBox>
          <FlexBox flexDirection="column">
            <Text>{t('Total Rewards')}</Text>
            <Text>{`${totalRewardsCrssDisplay} CRSS ~ ${totalRewardsCrssDisplay} USD`}</Text>
          </FlexBox>
        </Common>
        <StyledBtn variant="primaryGradient" onClick={handleClaim} isLoading={pendingTx}>
          {t('Claim')}
        </StyledBtn>
      </Container>
    </Modal>
  )
}

export default UnclaimedRewardsModal
