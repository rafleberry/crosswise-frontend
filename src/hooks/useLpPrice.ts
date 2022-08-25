import { useState, useEffect } from 'react'
import { usePriceCrssBusd } from 'state/farms/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import getLpPriceInUsd from 'utils/getLpPriceInUsd'

const useLpPrice = (farm: any) => {
  const [price, setPrice] = useState(BIG_ZERO)
  const crssPriceBusd = usePriceCrssBusd()
  useEffect(() => {
    const getValue = async () => {
      const calculatedValue = await getLpPriceInUsd(farm, crssPriceBusd)
      setPrice(calculatedValue)
    }
    if (farm) getValue()
  }, [crssPriceBusd, farm])

  return price
}

export default useLpPrice
