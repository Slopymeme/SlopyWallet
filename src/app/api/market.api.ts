import {FetchInstance} from "./fetch-instance";
import qs from "qs";


export type TX = {
	chainId: number
	txid: string
	from: string
	createdAt: Date
	to: string,
	value: string
	isContract: boolean
	transferData?: {
		to: string,
		value: string
	}



}

export class MarketApi {
	protected instance = FetchInstance.getInstance("market")


	async getNftCount(contractAddress: string, ownerAddress: string) {
		const data = await this.instance.get(`get-nft-count?${qs.stringify({
			contractAddress,
			ownerAddress
		})}`) as { count: number }
		return data.count
	}

	async getNormalTransactions(chainId: number, address: string) {
		const txs = await this.instance.get(`get-normal-transactions?${qs.stringify({chainId, address})}`) as TX[]
		return txs.map((tx) => {
			return {
				...tx,
				createdAt: new Date(tx.createdAt)
			}
		})
	}


	async getTokenBalances(tokenContracts: string[], ownerAddress: string, chain: number) {
		return await this.instance.get(`get-token-balances?${qs.stringify({
			tokenContracts,
			ownerAddress,
			chain
		})}`) as { name: string, contract: string, balance: string, }[]
	}

	async getTokenPrices(tokenContracts: string[], chain: number) {

		return await this.instance.get(`get-token-prices?${qs.stringify({tokenContracts, chain})}`) as {
			name: string,
			contract: string,
			usdPrice: string,
			usdChangePercent: string
		}[]
	}

	async getNativeTokenPrices() {
		return await this.instance.get(`get-native-token-prices`) as {
			ethVsUsd: number,
			bnbVsUsd: number,
			ethVsUsdChange: number,
			bnbVsUsdChange: number
		}
	}


	async getTokenLogo(chain: number, address: string) {
		const {logo} = await this.instance.get(`get-token-logo?${qs.stringify({chain, address})}`) as {logo: string | null}
		return logo
	}




}