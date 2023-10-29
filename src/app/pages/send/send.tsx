import styles from "./send.module.scss"
import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppSelector} from "../../../shared/store";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {PageRoutes} from "../../../config";
import Yup from "../../../modules/core/yup";
import React, {useState} from "react";
import {FormProvider} from "react-hook-form";
import PageInfoHeading from "../../widgets/page-info-heading";
import cn from "classnames";
import qs from "qs";
import TextField from "../../components/text-field";
import {TokenSelect} from "../../components/token-select/token-select";
import {Token} from "../../../modules/popup/popup.slice";
import {isEthereumAddress} from "class-validator";
import {useWeb3Services} from "../../contexts/web3-context";
import {TransferService} from "../../../modules/crypto/transfer.service";
import {Chain} from "@ethereumjs/common";
import {toWei} from "../../../modules/hex.utiils";
import Web3, {TransactionRevertInstructionError} from "web3";
import {ERC20ABI} from "../../../modules/crypto/contracts/erc20-abi";
import {AccountService} from "../../../modules/crypto/account.service";
import {parseUnits} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";
import {ToastService} from "../../../modules/core/toast.service";
import {useIsShowSpinner} from "../../hooks/use-spinner";
import Spinner from "../../components/spinner";
import {TFunction} from "i18next";
import {Web3Service} from "../../../modules/crypto/web3.service";
import {isEmpty} from "lodash";

const schema = Yup.object().shape({
	token: Yup.mixed().required(),
	recipient: Yup.string().trim().test("is-ethereum-address", (value) => isEthereumAddress(value)).required(),
	amount: Yup.number().required()
})


class ToastError extends Error {
	public msg: string

	constructor(msg: string) {
		super();
		this.msg = msg
	}
}

function canTransfer(nativeTokenBalance: BigNumber, feeCost: BigNumber, t: TFunction) {
	if (nativeTokenBalance.isZero()) {
		throw new ToastError(t("send.errors.emptyBalance"))
	}

	if (nativeTokenBalance.lte(feeCost)) {
		// Недостаточно ETH для совершения транзакции.
		throw new ToastError(t("send.errors.InsufficientFundsOnBalance"))
	}
}

function hasAmountForTransfer(balance: BigNumber, amount: BigNumber, t: TFunction) {

	if (balance.lt(amount)) {
		throw new ToastError(t("send.errors.balanceLessThenTransferAmount"))
	}

	return true
}


export function Send() {
	const {t} = useTranslation()

	const navigate = useNavigate()
	const {wallet, chains} = useAppSelector((state) => state.popup)
	const [searchParams] = useSearchParams()
	const chainId = Number(searchParams.get("chainId"))
	let chain = chains.find((chain) => chain.chainId === chainId)
	if (!chain) {
		chain = chains[0]
	}
	const [isShow, setIsShow] = useIsShowSpinner(false)




	const {ref, methods} = useAppForm({
		schema,
		onSubmit: async (data) => {
			try {
				setIsShow(true)
				await onSubmit(data)
				ToastService.success(t("actionPerfomed"))
				setIsShow(false)
				reset()

			} catch (e: any) {
				setIsShow(false)

				if (e instanceof ToastError) {
					ToastService.error(e.msg)
					return
				}

				if (e instanceof AggregateError) {
					if (!isEmpty(e.errors)) {
						const error = e.errors[0]
						console.error(error)
						if (error instanceof ToastError) {
							ToastService.error(error.msg)
						} else if (error instanceof TransactionRevertInstructionError) {
							console.log(error.toJSON())
							console.log(error.reason)
							ToastService.error(t("send.errors.transactionRevertInstructionError"))
						} else {
							ToastService.error(t("somethingWentWrong"))
						}

					} else {
						ToastService.error(t("somethingWentWrong"))
						console.error(e)
					}
				} else {
					console.error(e)
					ToastService.error(t("somethingWentWrong"))
				}
			}
		}
	})

	const {setValue, getValues, reset} = methods

	async function onSubmit({token: rawToken, amount: _amount, recipient}: any) {
		const token = (rawToken as any).token as Token

		const isERC20Token = Boolean(token.contract)

		const account = {
			address: wallet?.address as string,
			privateKey: wallet?.privateKey as string
		}

		if (account.address.toLowerCase() === recipient.toLowerCase()) {
			throw new ToastError(t("send.errors.youCantTransferToYourself"))
		}


		if (!chain) {
			throw new Error("[chain] is undefined")
		}

		const web3s = chain.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl)) as Web3[]

		if (isEmpty(web3s)) {
			throw new Error("[web3s] пустой.")
		}

		let amount = parseUnits(_amount.toString(), token.decimals).toString()


		let gasLimit = isERC20Token ? 150_000 : 21_000
		let gasPrice = await Promise.any(web3s.map(async (web3) => {
			const gasPrice = await web3.eth.getGasPrice()
			return gasPrice.toString()
		}))
		const feeCost = BigNumber.from(gasLimit).mul(gasPrice) // wei

		// gasPrice = BigNumber.from(gasPrice).add(toWei(3, "gwei")).toString()

		if (!isERC20Token) {
			amount = BigNumber.from(amount).sub(feeCost).toString()
		}


		if (BigNumber.from(amount).isNegative()) {
			throw new ToastError(t("send.errors.amountLessThenFeeCost"))
		}


		async function transfer(web3: Web3) {
			const transferService = new TransferService(web3, chain?.chainId as number)

			let broadcastData = {} as { txid: string, txRaw: string }

			if (isERC20Token) {
				const contract = new web3.eth.Contract<typeof ERC20ABI>(ERC20ABI, token.contract)
				let tokenBalance = BigNumber.from((await contract.methods.balanceOf(account.address).call()))

				const balance = BigNumber.from((await web3.eth.getBalance(account.address)))

				canTransfer(balance, feeCost, t)
				hasAmountForTransfer(tokenBalance, BigNumber.from(amount), t)


				const {txid, txRaw} = await transferService.tokenTransfer({
					to: recipient,
					gasPrice,
					gasLimit,
					amount,
					contract,
					contractAddress: token.contract as string,
					senderPrivateKey: account.privateKey,
				})

				broadcastData.txid = txid
				broadcastData.txRaw = txRaw
			} else {
				let balance = BigNumber.from((await web3.eth.getBalance(account.address)))

				canTransfer(balance, feeCost, t)
				hasAmountForTransfer(balance, BigNumber.from(amount), t)




				const {txid, txRaw} = await transferService.transfer({
					to: recipient,
					amount,
					gasPrice,
					gasLimit,
					senderPrivateKey: account.privateKey
				})
				broadcastData.txid = txid
				broadcastData.txRaw = txRaw
			}


			console.log(broadcastData.txRaw)


			const acc = web3.eth.accounts.privateKeyToAccount(wallet?.privateKey as string)
			web3.defaultAccount = acc.address
			// const result = await web3.eth.sendSignedTransaction(broadcastData.txRaw)
			// console.log(result)
			return await new Promise((resolve, reject) => {
				web3.eth.sendSignedTransaction(broadcastData.txRaw)
					.once("receipt", (receipt) => {
						resolve(receipt)
					})
					.once("error", (e) => {
						reject(e)
					})
			})


		}

		const receipt = await Promise.any(web3s.map((web3) => transfer(web3)))
		console.log(receipt)

	}


	return (
		<FormProvider {...methods}>
			<form className="page" ref={ref}>
				<PageInfoHeading
					title={t("send.title")}
				/>
				<div className={styles.inputs}>
					<TextField
						label={t("receive.network")}
						name="chainId"
						errorClassName="d-none"
						rightIcon={<img src="static/icons/right-arrow.png"/>}
						leftIcon={<img src={chain.asset} style={{width: "24px", height: "24px"}}/>}
						onClick={() => navigate(
							`${PageRoutes.ChoiceChain}?${qs.stringify({routeTo: PageRoutes.Send})}`)}
						placeholder={chain.name}

					/>

					<TokenSelect
						chainId={chain.chainId}
						name="token"
						label={t("send.token")}
						placeholder={t("send.selectTokenPlaceholder")}
						errorClassName="d-none"

					/>

					<TextField
						label={t("send.recipient")}
						name="recipient"
						errorClassName="d-none"
					/>

					<TextField
						label={t("send.amount")}
						name="amount"
						errorClassName="d-none"
					/>
				</div>
				{/*<div*/}
				{/*	className={styles.allAmount}*/}
				{/*	onClick={async () => {*/}


				{/*		setValue("amount", 0)*/}
				{/*	}}*/}
				{/*>*/}
				{/*	{t("send.useAvailableBalance")}*/}
				{/*</div>*/}

				<button
					className={cn("button", "page__confirm")}
					disabled={isShow}
				>{
					isShow ? <Spinner width={25} height={25} color="white"/> : t("send.sendBtn")
				}
				</button>
			</form>
		</FormProvider>
	)
}