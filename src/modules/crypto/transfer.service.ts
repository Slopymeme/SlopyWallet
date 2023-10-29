import {Contract} from "web3-eth-contract";
import {Chain, Common, Hardfork} from "@ethereumjs/common";
import Web3, {TransactionReceipt} from "web3";
import {add0xPrefix, hexToBuffer, toHex, toWei} from "../hex.utiils";
import {BigNumber} from "@ethersproject/bignumber";
import {FeeMarketEIP1559Transaction, FeeMarketEIP1559TxData} from "@ethereumjs/tx";
import {AccountService} from "./account.service";
import {Buffer} from "buffer";
import {ERC20ABI} from "./contracts/erc20-abi";


export type TypicalTransferParams = {
	gasPrice: string
	gasLimit: number
	amount: string
	senderPrivateKey: string,
	to: string,
}

export type ERC20TokenTransferParams = {
	gasPrice: string
	gasLimit: number
	amount: string
	contract: Contract<typeof ERC20ABI>
	contractAddress: string

	senderPrivateKey: string,
	to: string,
}


export class TransferService {
	protected common: Common

	constructor(
		protected web3: Web3,
		protected chain: Chain | number,
	) {
		this.common = Common.custom({chainId: Number(this.chain), defaultHardfork: Hardfork.London})
	}

	protected gasPriceToEIP1559(_gasPrice: string) {
		const gasPrice = BigNumber.from(_gasPrice)
		const maxPriorityFeePerGas = BigNumber.from(toWei("1", "gwei"))
		const baseFeePerGas = gasPrice.sub(maxPriorityFeePerGas) // Можно использовать это block.baseFeePerGas
		const maxFeePerGas = baseFeePerGas.add(maxPriorityFeePerGas)
		return {
			maxFeePerGas,
			maxPriorityFeePerGas
		}
	}

	async transfer({gasPrice, gasLimit, amount, senderPrivateKey, to}: TypicalTransferParams) {
		const senderAddress = AccountService.fromPrivateKey(add0xPrefix(senderPrivateKey))
		const {maxFeePerGas, maxPriorityFeePerGas} = this.gasPriceToEIP1559(gasPrice)


		const txObject: FeeMarketEIP1559TxData = {
			maxFeePerGas: maxFeePerGas.toBigInt(),
			maxPriorityFeePerGas: maxPriorityFeePerGas.toBigInt(),
			to,
			gasLimit: gasLimit,
			nonce: BigInt((await this.web3.eth.getTransactionCount(senderAddress))),
			value: Web3.utils.toBigInt(amount),
			type: toHex(2),

		}
		const tx = FeeMarketEIP1559Transaction.fromTxData(txObject, {common: this.common})
		const signedTx = tx.sign(hexToBuffer(senderPrivateKey))
		const serializedTx = signedTx.serialize()
		return {
			txid: "0x" + Buffer.from(signedTx.hash()).toString("hex"),
			txRaw: "0x" + Buffer.from(serializedTx).toString("hex")
		}
	}

	async tokenTransfer({
		                    gasPrice,
		                    gasLimit,
		                    amount,
		                    senderPrivateKey,
		                    to,
		                    contractAddress,
		                    contract
	                    }: ERC20TokenTransferParams) {
		const senderAddress = AccountService.fromPrivateKey(add0xPrefix(senderPrivateKey))
		const encodedABI = contract.methods.transfer(to, BigInt(amount)).encodeABI() as string
		const {maxFeePerGas, maxPriorityFeePerGas} = this.gasPriceToEIP1559(gasPrice)

		const txObject: FeeMarketEIP1559TxData = {
			maxFeePerGas: maxFeePerGas.toBigInt(),
			maxPriorityFeePerGas: maxPriorityFeePerGas.toBigInt(),
			to: contractAddress,
			gasLimit: gasLimit,
			nonce: BigInt((await this.web3.eth.getTransactionCount(senderAddress)).toString()),
			value: BigInt(0),
			data: encodedABI,
			type: toHex(2)
		}
		const tx = FeeMarketEIP1559Transaction.fromTxData(txObject, {common: this.common})
		const signedTx = tx.sign(hexToBuffer(senderPrivateKey))
		const serializedTx = signedTx.serialize()
		return {
			txid: "0x" + Buffer.from(signedTx.hash()).toString("hex"),
			txRaw: "0x" + Buffer.from(serializedTx).toString("hex")
		}
	}


	async broadcast(rxRaw: string) {
		const events = this.web3.eth.sendSignedTransaction(rxRaw)
		events.on("receipt", (receipt) => {
			console.log(receipt)
		})

	}


}