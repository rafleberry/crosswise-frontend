// import { BASE_URL } from 'config'

// const getTokenLogoURL = (address: string) => `${BASE_URL}/images/tokens/${address}.png`
const getTokenLogoURL = (address: string) => `/images/tokens/${address}.svg`

export default getTokenLogoURL

// `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
