import Web3 from 'web3'
import { Biconomy } from '@biconomy/mexa'
import { simpleRpcProvider } from './providers'

const biconomy = new Biconomy(simpleRpcProvider, {
  walletProvider: window.ethereum,
  apiKey: 'V7AKieLKW.80f53044-f280-473e-817f-7088966d8ae4',
  debug: true,
})
const biconomyWeb3 = new Web3(biconomy)

export const sendTransactionByBiconomy = async (
  contractAddress: string,
  abi: any,
  account: string,
  func: string,
  params: any,
) => {
  const biconomyContract = new biconomyWeb3.eth.Contract(abi, contractAddress)
  try {
    const tx = await biconomyContract.methods[func](...params).send({
      from: account,
      signatureType: biconomy.EIP712_SIGN,
    })
    return tx
    // tx.on('transactionHash', function (hash) {
    //   console.log('transactionHash: ', hash)
    // }).once('confirmation', function (confirmationNumber, receipt) {
    //   console.log('receipt: ', receipt)
    //   return true
    // })
  } catch (err: any) {
    console.error('biconomy error', JSON.stringify(err))
    throw err.message
  }
  return null
}
