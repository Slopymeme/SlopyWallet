
// @ts-ignore
import {privateKeyToAccount, create} from 'web3-eth-accounts';
import {remove0xPrefix} from "../hex.utiils";
export class AccountService {

	static fromPrivateKey(privateKey: string) {
		const acc = privateKeyToAccount(privateKey)
		return acc.address
	}
	static createAccount() {

		const account = create()
		return {
			...account,
			privateKey: remove0xPrefix(account.privateKey)
		}
	}
}