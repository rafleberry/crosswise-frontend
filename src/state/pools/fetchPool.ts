import { Pool } from 'state/types'
import fetchPublicPoolData from './fetchPublicPoolData'

const fetchPool = async (farm: Pool): Promise<Pool> => {
  const farmPublicData = await fetchPublicPoolData(farm)
  // const farmPublicData = null
  return { ...farm, ...farmPublicData }
}

export default fetchPool
