import {FetchInstance} from "./fetch-instance";
import qs from "qs";


class Reward {
	id: string
	address: string
	text: string
	read: boolean
}

export class RewardApi {
	protected instance =  FetchInstance.getInstance("reward")


	async retrieve(address: string, publicKey: string) {
		return await this.instance.get(`retrieve?${qs.stringify({address, publicKey})}`) as Reward
	}

	async setReadFlag(address: string, publicKey: string) {
		return await this.instance.post("set-read-flag", {address, publicKey})
	}

}