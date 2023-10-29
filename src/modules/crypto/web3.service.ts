import Web3, {HttpProvider} from "web3";


export class Web3Service extends Web3 {

	constructor(rpcUrl: string) {
		const provider = new HttpProvider(rpcUrl)
		super(provider)
		const web3 = this as Web3
		const acc = web3.eth.accounts.create()
		web3.defaultAccount = acc.address
	}
}