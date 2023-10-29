import {FetchInstance} from "./fetch-instance";
import qs from "qs";


export class MarketApi {
	protected instance = FetchInstance.getInstance("market")


	async getNftCount(contractAddress: string, ownerAddress: string) {
		const data = await this.instance.get(`get-nft-count?${qs.stringify({
			contractAddress,
			ownerAddress
		})}`) as { count: number }
		return data.count
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


}