import { getCrossPairContract, getChainLinkContract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'
import { usefulTestTokens } from 'config/constants/chainLinkTokens'
import { BIG_TEN } from 'utils/bigNumber'
import { getCrssAddress, getAddress } from 'utils/addressHelpers'

const compareAddress = (addr1: string, addr2: string) => {
  return new BigNumber(addr1.toLowerCase()).isGreaterThan(new BigNumber(addr2.toLowerCase()))
}

const getLpPriceInUsd = async (farm: any, crssPriceBusd: any) => {
  let price = new BigNumber(0)
  const tokenAddress = getAddress(farm.token.address)
  const quoteTokenAddress = getAddress(farm.quoteToken.address)
  const crossPairContract = getCrossPairContract(getAddress(farm.lpAddresses))
  const chainLinkContract = getChainLinkContract()

  const { _reserve0, _reserve1 } = await crossPairContract.getReserves()
  const reservedTokenAmount = new BigNumber(
    compareAddress(tokenAddress, quoteTokenAddress) ? _reserve1._hex : _reserve0._hex,
  )
  const reservedQuoteTokenAmount = new BigNumber(
    compareAddress(tokenAddress, quoteTokenAddress) ? _reserve0._hex : _reserve1._hex,
  )

  if (tokenAddress === getCrssAddress()) {
    price = reservedTokenAmount.multipliedBy(crssPriceBusd).multipliedBy(BIG_TEN.pow(8))
  } else if (quoteTokenAddress === getCrssAddress()) {
    price = reservedQuoteTokenAmount.multipliedBy(crssPriceBusd).multipliedBy(BIG_TEN.pow(8))
  } else if (usefulTestTokens.includes(tokenAddress)) {
    const reservedTokenInUsd = await chainLinkContract.getTokenPrice(tokenAddress)
    const reservedTokenInUsdInBigNumber = new BigNumber(reservedTokenInUsd._hex)
    price = reservedTokenAmount.multipliedBy(reservedTokenInUsdInBigNumber)
  } else if (usefulTestTokens.includes(quoteTokenAddress)) {
    const reservedQuoteTokenInUsd = await chainLinkContract.getTokenPrice(quoteTokenAddress)
    const reservedQuoteTokenInBigNumber = new BigNumber(reservedQuoteTokenInUsd._hex)
    price = reservedQuoteTokenAmount.multipliedBy(reservedQuoteTokenInBigNumber)
  }
  return price.div(BIG_TEN.pow(26)).times(2).toNumber()
}

export default getLpPriceInUsd
