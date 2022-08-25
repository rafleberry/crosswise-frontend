import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import {
  Text,
  useMatchBreakpoints,
  UserIcon,
  CopyIcon,
  // DropDownBottomIcon,
  CheckmarkIcon,
  Checkbox,
  Flex,
  // Button,
} from '@crosswise/uikit'
// import { useThemeManager } from 'state/user/hooks'
import useToast from 'hooks/useToast'
import { useUserInfo, registerUserInfo } from 'state/personalAccount/hooks'
import { AutoColumn } from 'components/Layout/Column'
import { useTranslation } from 'contexts/Localization'

import {
  StyledPage,
  ResponsiveHeading,
  AccountCardWrapper,
  AccountCard,
  AccountCardMainInfo,
  SettingTitle,
  AddressContainer,
  SubTitle,
  AccountAreaContainer,
  GeneralSettingsInfo,
  SettingsInfo,
  StyledInput,
  StyledButton,
  CompensationLists,
  StyledText,
  TransactionLists,
  SubInput,
} from './styled'

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const { toastError, toastSuccess } = useToast()
  const [userError, setUserError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const { data, transacData, transacStatus } = useUserInfo()
  const [userName, setUserName] = useState(data.userName || '')
  const [email, setEmail] = useState(data.email || '')
  const [tgUsername, setTgUsername] = useState(data.tgUsername || '')
  const [optStatus, setOptStatus] = useState(data.optStatus || false)
  const [autoVesting, setAutoVesting] = useState(data.autoVesting || false)
  const [autoCompound, setAutoCompound] = useState(data.autoCompound || false)
  const [copied, setCopied] = useState(false)
  let { account } = useWeb3React()
  const { t } = useTranslation()
  const { isXs, isSm, isMd } = useMatchBreakpoints()
  const isMobile = isXs || isSm || isMd
  const tokenLists = Object.keys(transacData.reserve || {})
  const reserveLists = Object.values(transacData.reserve || {})
  const depositLists = Object.values(transacData.deposit || {})
  const txHistory = transacData.history || []
  if (isMobile && account) account = `${account.slice(0, 10)}  . . .  ${account.slice(37, 42)}`
  const onSuccess = () => {
    toastSuccess(t('Success'), t('Successfully Registered'))
    setUserError(false)
    setEmailError(false)
  }
  const onFailure = (err) => {
    toastError(t('Register Failed'), t(err.message))
  }
  const handleClick = () => {
    if (!userName) {
      toastError(t('Register Failed'), t('You must input your name'))
      setUserError(true)
      return
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toastError(t('Register Failed'), t('Invalid Email'))
      setEmailError(true)
      return
    }
    dispatch(
      registerUserInfo(
        {
          walletAddress: account,
          userName,
          email,
          tgUsername,
          optStatus,
          autoVesting,
          autoCompound,
        },
        onSuccess,
        onFailure,
      ),
    )
  }
  return (
    <>
      <StyledPage>
        <AutoColumn justify={isMobile ? 'center' : 'flex-start'}>
          <ResponsiveHeading isMobile={isMobile} mb="12px" color="text">
            {t('Moon Station')}
          </ResponsiveHeading>
          <Text fontFamily="genos" fontSize={isMobile ? '16px' : '26px'}>
            Your Account Settings
          </Text>
        </AutoColumn>
        <AccountCardWrapper>
          <AccountCard isMobile={isMobile}>
            <AccountCardMainInfo>
              <AddressContainer>
                <SubTitle>{t('Your Wallet')}</SubTitle>
                <AccountAreaContainer>
                  {account || 'Connect your wallet'}
                  {copied ? (
                    <CheckmarkIcon width="26px" />
                  ) : (
                    <CopyIcon
                      width="26px"
                      color="primaryText"
                      cursor="pointer"
                      onClick={() => {
                        setCopied(true)
                        setTimeout(() => {
                          setCopied(false)
                        }, 3000)
                        navigator.clipboard.writeText(account)
                      }}
                    />
                  )}
                </AccountAreaContainer>
              </AddressContainer>
            </AccountCardMainInfo>
            <SettingsInfo>
              <GeneralSettingsInfo>
                <SettingTitle>{t('Personal Settings')}</SettingTitle>
                <SubInput>
                  <SubTitle>{t('Username')}</SubTitle>
                  <StyledInput
                    err={userError}
                    placeholder={t('Set a username')}
                    onChange={(e) => {
                      setUserName(e.target.value)
                    }}
                    value={userName || data.userName}
                  />
                </SubInput>
                <SubInput>
                  <SubTitle>{t('Email')}</SubTitle>
                  <StyledInput
                    err={emailError}
                    placeholder={t('Your email address')}
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    value={email || data.email}
                  />
                </SubInput>
                <SubInput>
                  <SubTitle>{t('Telegram Username')}</SubTitle>
                  <StyledInput
                    placeholder={t('Your telegram username')}
                    onChange={(e) => {
                      setTgUsername(e.target.value)
                    }}
                    value={tgUsername || data.tgUsername}
                  />
                </SubInput>
                <Flex alignItems="center">
                  <div style={{ width: 25 }}>
                    <Checkbox
                      scale="sm"
                      checked={optStatus || data.optStatus}
                      onChange={() => {
                        setOptStatus(!optStatus)
                      }}
                    />
                  </div>
                  <SubTitle>{t('Opt-in for Email and Telegram notifications')}</SubTitle>
                </Flex>
              </GeneralSettingsInfo>
              <GeneralSettingsInfo>
                <SettingTitle>{t('DEX Settings')}</SettingTitle>
                <Flex alignItems="center" flexDirection="row">
                  <div style={{ width: 25 }}>
                    <Checkbox
                      scale="sm"
                      checked={autoVesting || data.autoVesting}
                      onChange={() => {
                        setAutoVesting(!autoVesting)
                      }}
                    />
                  </div>
                  <SubTitle>Cosmic Accumulator (Vesting)</SubTitle>
                </Flex>
                <Flex alignItems="center">
                  <div style={{ width: 25 }}>
                    <Checkbox
                      scale="sm"
                      checked={autoCompound || data.autoCompound}
                      onChange={() => {
                        setAutoCompound(!autoCompound)
                      }}
                    />
                  </div>
                  <SubTitle>{t('Hyper Accelerator (Auto - Compounding)')}</SubTitle>
                </Flex>
                <StyledButton variant="primaryGradient" onClick={handleClick}>
                  {t('Apply Changes')}
                </StyledButton>
              </GeneralSettingsInfo>
            </SettingsInfo>
          </AccountCard>
        </AccountCardWrapper>
      </StyledPage>
      {transacStatus && (
        <Flex justifyContent="space-between" padding="24px" flexDirection={isMobile ? 'column' : 'row'}>
          <CompensationLists flexDirection="column">
            {tokenLists.map((token, index) => (
              <div>
                {index === 0 && (
                  <Flex flexDirection="row">
                    <StyledText width="40%" color="homeTitle">
                      Asset
                    </StyledText>
                    <StyledText width="30%" color="homeTitle">
                      Reserve
                    </StyledText>
                    <StyledText width="30%" color="homeTitle">
                      Deposit
                    </StyledText>
                  </Flex>
                )}
                <Flex flexDirection="row">
                  <StyledText width="40%">{token}</StyledText>
                  <StyledText width="30%">{reserveLists[index]}</StyledText>
                  <StyledText width="30%">{depositLists[index]}</StyledText>
                </Flex>
              </div>
            ))}
          </CompensationLists>
          <TransactionLists flexDirection="column">
            {txHistory.map((tx, index) => (
              <div>
                {index === 0 && (
                  <Flex flexDirection="row">
                    <StyledText width="25%" color="homeTitle">
                      Tx
                    </StyledText>
                    <StyledText width="25%" color="homeTitle">
                      Asset
                    </StyledText>
                    <StyledText width="25%" color="homeTitle">
                      From
                    </StyledText>
                    <StyledText width="25%" color="homeTitle">
                      To
                    </StyledText>
                  </Flex>
                )}
                <Flex flexDirection="row">
                  <StyledText width="25%">{tx.tx}</StyledText>
                  <StyledText width="25%">{tx.asset}</StyledText>
                  <StyledText width="25%">{tx.from}</StyledText>
                  <StyledText width="25%">{tx.to}</StyledText>
                </Flex>
              </div>
            ))}
          </TransactionLists>
        </Flex>
      )}
    </>
  )
}

export default Home
