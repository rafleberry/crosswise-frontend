import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Flex, useMatchBreakpoints, Skeleton, useTooltip, Text } from '@crosswise/uikit'
import { useThemeManager } from 'state/user/hooks'
import useFetch from 'hooks/useFetch'
import useToast from 'hooks/useToast'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import { AutoColumn } from 'components/Layout/Column'
// import Page from 'components/Layout/Page'
// import { BaseLayout, Heading, Text } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
// import ConnectWalletButton from 'components/ConnectWalletButton'
// import { IconQuestionTag } from 'components/SvgIcons'
import { ThemeText, Texter } from 'components/Texts'
import { getBalanceNumber } from 'utils/formatBalance'
// import TotalCard from './components/TotalCard'
// import CommissionsCard from './components/CommissionsCard'
// import ProgramCard from './components/ProgramCard'
import useReferralCommissions from './hooks/useReferralCommissions'

import {
  // StyledCenter,
  StyledPage,
  // CardsRow,
  // Label,
  // ResponsiveHeading,
  ReferralCardWrapper,
  // ReferralCard,
  // ReferralCardMainInfo,
  // ReferralCardIconWrapper,
  // ReferralCardIcon,
  ReferralLinkContainer,
  ReferralLinkTitle,
  ReferralUrlContainer,
  StyledIconCopy,
  StyledIconCheck,
  // DropDownIcon,
  ReferralDetailInfoWrapper,
  ReferralDetailInfo,
  ReferralStatsContainer,
  ReferralStatsItem,
  // Divider,
  ReferralClaimButton,
  // ReferrerContainer,
  StyledTextBox as TextBox,
} from './styled'
import CrssBot from './CrssBot'

const BASE_URL = 'https://api.crosswise.finance/v1'

const Referral: React.FC = () => {
  // const [isExpanded, setIsExpanded] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralCount, setReferralCount] = useState(0)
  const [
    ,
    // referrer,
    setReferrer,
  ] = useState('')
  const [sendingTx, setSendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [isDark] = useThemeManager()
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const { toastSuccess, toastError } = useToast()
  const { getRequest, postRequest } = useFetch()
  const history = useHistory()
  const { pathname, search } = useLocation()
  const ref = new URLSearchParams(search).get('ref')

  const { origin } = window.location
  const referralUrl = `${origin}/${pathname.replace(/\//g, '')}?ref=${referralCode}`

  const { referralRewards, claimReferralCommission } = useReferralCommissions()
  const balanceNumber = getBalanceNumber(referralRewards).toLocaleString(undefined, { maximumFractionDigits: 2 })

  const { targetRef, tooltip } = useTooltip(<span>Copied!</span>, { placement: 'top' })

  useEffect(() => {
    const setRef = async () => {
      const response = await postRequest(`${BASE_URL}/set_referrer/${ref}/${account}`, {})
      if (response.success) {
        toastSuccess('Success', `You set referrer successfully.`)
        setReferrer(ref)
        history.push(pathname)
      } else if (response?.response?.data?.msg) {
        const errMsg = response.response.data.msg
        toastError('Error', errMsg)
        history.push(pathname)
      }
    }
    if (account && ref) setRef()
    if (!account) setReferrer('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, account])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRequest(`${BASE_URL}/referral_code/${account}`)
      setReferralCode(`${data?.code || ''}`)
      setReferralCount(data?.count || 0)
      setReferrer(data?.referrer || '')
    }
    if (account) fetchData()
  }, [getRequest, account])

  const isMobile = isXs || isSm || isMd

  const handleCopyLink = () => {
    if (!account) return
    navigator.clipboard.writeText(referralUrl)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  const handleClaimRewards = async () => {
    setSendingTx(true)
    await claimReferralCommission()
    setSendingTx(false)
  }

  return (
    <>
      <StyledPage isMobile={isMobile}>
        <Text
          bold
          gradient={isDark ? undefined : 'btngradprimary'}
          fontFamily="genos"
          color="white"
          // mb="12px"
          // mt="90px"
          mx="auto"
          fontSize="57px"
          fontWeight={800}
          fontStyle="normal"
          letterSpacing="-0.01em"
          maxWidth={920}
        >
          Moonwalkers!
        </Text>
        <ReferralCardWrapper isMobile={isMobile}>
          <CrssBot />
          <ReferralLinkContainer isMobile={isMobile}>
            <Text
              fontSize={isMobile ? '18px' : '20px'}
              // fontFamily="genos"
            >
              Share the referral link below to invite users and earn 1% of the referred user&apos;s earnings FOREVER!
            </Text>
            <ReferralLinkTitle>My referral Link</ReferralLinkTitle>
            <ReferralUrlContainer ref={targetRef} isMobile={isMobile} onClick={handleCopyLink}>
              {account ? referralUrl : <Skeleton width="100%" />}
              {account && (
                <>
                  <StyledIconCopy
                    visible={!isCopied}
                    stroke={isDark ? '#fff' : '#060514'}
                    fill={isDark ? '#fff' : '#060514'}
                  />
                  <StyledIconCheck visible={isCopied} />
                </>
              )}
            </ReferralUrlContainer>
          </ReferralLinkContainer>
          <ReferralDetailInfoWrapper>
            <ReferralDetailInfo>
              <ReferralStatsContainer>
                <ReferralStatsItem isMobile={isMobile}>
                  <TextBox
                    fSize={isMobile ? '20px' : '24px'}
                    letterSpacing="0.4px"
                    color={isDark ? '#04F8AD' : '#00b8b9'}
                  >
                    Total Referrals
                  </TextBox>
                  <Texter bold mt="10px" fSize={isMobile ? '17px' : '23px'} textAlign="left">
                    {account ? referralCount : <Skeleton width={50} />}
                  </Texter>
                </ReferralStatsItem>
                <ReferralStatsItem isMobile={isMobile}>
                  <TextBox
                    fSize={isMobile ? '20px' : '24px'}
                    letterSpacing="0.4px"
                    color={isDark ? '#04F8AD' : '#00b8b9'}
                  >
                    Pending Rewards
                  </TextBox>
                  <Texter bold mt="10px" fSize={isMobile ? '17px' : '23px'} textAlign="left">
                    {account ? `${balanceNumber} CRSS` : <Skeleton width={100} />}
                  </Texter>
                  <ThemeText
                    mt="18px"
                    isDarkTheme={isDark}
                    colors={['#E0E0FF', '#7A8596']}
                    fSize={isMobile ? '13px' : '16px'}
                    textAlign="left"
                  >
                    {account ? t(`~ ${balanceNumber} USD`) : <Skeleton width={100} />}
                  </ThemeText>
                </ReferralStatsItem>
              </ReferralStatsContainer>
              <Flex justifyContent="center" alignItems="center" mb={10}>
                {account ? (
                  <ReferralClaimButton
                    variant="primaryGradient"
                    isMobile={isMobile}
                    isLoading={sendingTx}
                    onClick={handleClaimRewards}
                  >
                    Claim Rewards
                  </ReferralClaimButton>
                ) : (
                  <ConnectWalletButton scale="sm" variant="primaryGradient" width="80%" />
                )}
              </Flex>
            </ReferralDetailInfo>
          </ReferralDetailInfoWrapper>
        </ReferralCardWrapper>

        {isCopied && tooltip}
      </StyledPage>
    </>
  )
}

export default Referral
