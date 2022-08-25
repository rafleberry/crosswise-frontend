import React from 'react'
import { Button, Text, CrosswiseFailIcon, Flex } from '@crosswise/uikit'
import { useTranslation } from 'contexts/Localization'
import { AutoColumn } from '../Layout/Column'
import { Wrapper } from './styled'

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <CrosswiseFailIcon color="failure" width="150px" />
        <Text color="failure" style={{ textAlign: 'center', width: '85%' }}>
          {message}
        </Text>
      </AutoColumn>

      <Flex justifyContent="center" pt="24px">
        <Button onClick={onDismiss} variant="primaryGradient">
          {t('Dismiss')}
        </Button>
      </Flex>
    </Wrapper>
  )
}
