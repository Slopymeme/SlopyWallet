import {randomBytes} from "web3-utils";
import {HDNodeWallet, Mnemonic} from "ethers";

export class CryptoService {
	static createMnemonic() {
		const bytes = randomBytes(16)
		const mnemonic = Mnemonic.fromEntropy(bytes, undefined)
		return mnemonic.phrase
	}

	static fromMnemonic(mnemonic: string) {
		return HDNodeWallet.fromPhrase(mnemonic)
	}
}