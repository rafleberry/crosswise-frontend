import React from 'react'
import { Skeleton } from '@crosswise/uikit'
// import { useTranslation } from 'contexts/Localization'
import { useMaxSupply, useTotalSupply } from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'

const Circulation = () => {
  // const { t } = useTranslation()
  const maxSupply = useMaxSupply()
  // const totalSupply = useTotalSupply()

  const circulation = getBalanceNumber(maxSupply)

  return circulation > 0 ? <>{circulation}</> : <Skeleton width={60} />
}

export default Circulation
