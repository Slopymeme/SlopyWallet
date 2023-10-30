import styles from "./history.module.scss"
import PageInfoHeading from "../../widgets/page-info-heading";
import React, {Fragment, useState} from "react";
import {useAppSelector} from "../../../shared/store";
import useSWR from "swr";
import {format, parse} from "date-fns";
import {TX} from "../../api/market.api";
import useSWRImmutable from "swr/immutable";
import api from "../../api";
import {fromPairs, groupBy, sortBy, toPairs} from "lodash";
import {formatUnits, parseUnits} from "ethers";
import {Entries} from "type-fest";
import {BigNumber} from "@ethersproject/bignumber";
import {useInfoTokens} from "../home/home";
import {Token} from "../../../modules/popup/popup.slice";
import Decimal from "decimal.js";
import Spinner from "../../components/spinner";
import {Link} from "react-router-dom";


class Address {
	static isEq(addr1: string, addr2: string) {
		return addr1.toLowerCase() === addr2.toLowerCase()
	}
}

const dateFormat = `MMM d, yyyy`

type HistoryTx = (TX & { logo: string, decimals: number, symbol: string, usdPrice: number })

function useGetTransactions(address: string) {
	// const {tokens} = useAppSelector((state) => state.popup)
	const tokens = useInfoTokens()

	let {data: transactions} = useSWRImmutable(tokens && `transactions-${address}`, async () => {
		const mainnetTxs = await api.market.getNormalTransactions(1, address)
		const bscTxs = await api.market.getNormalTransactions(56, address)
		const txs = sortBy([...mainnetTxs, ...bscTxs], (tx) => tx.createdAt.getTime()).reverse() as
			HistoryTx[]

		return txs.filter((tx) => {
			const isNativeTx = !Boolean(tx.transferData) || !BigNumber.from(tx.value).isZero()
			const isERC20Tx = Boolean(tx.transferData) && (tokens as Token[]).filter(
				(t) => t.contract?.toLowerCase() === tx.to.toLowerCase())
			return isNativeTx || isERC20Tx
		})

	})

	if (!transactions || !tokens) {
		return undefined
	}


	transactions = transactions.map((tx) => {
		const isContract = tx.isContract
		const token = tokens.find((token) => token.contract?.toLowerCase() === tx.to.toString())

		if (token) {
			console.log(token.symbol, token.asset)
			tx.logo = token.asset
			tx.decimals = token.decimals
			tx.symbol = token.symbol
			tx.usdPrice = token.usdPrice

		} else {
			tx.logo = tx.chainId === 1 ? "static/icons/chains/mainnet.png" : "static/icons/chains/bsc.png"
			tx.decimals = 18
			tx.symbol = tx.chainId === 1 ? "ETH" : "BNB"
		}

		const isNativeTx = !Boolean(tx.transferData) || !BigNumber.from(tx.value).isZero()

		if (isNativeTx) {
			const eth = tokens.find((t) => t.symbol === "ETH")
			const bnb = tokens.find((t) => t.symbol === "BNB")

			if (tx.chainId === 1) {
				// @ts-ignore
				tx.usdPrice = eth.usdPrice
			} else {
				// @ts-ignore
				tx.usdPrice = bnb.usdPrice
			}


		}

		return {...tx}
	}) as any[]


	let groups = groupBy(transactions, (tx) => format(tx.createdAt, dateFormat))

	groups = fromPairs(toPairs(groups).sort((v) => parse(v[0], dateFormat, new Date()).getTime()))

	return groups
}

export function History() {
	const {wallet, chains} = useAppSelector((state) => state.popup)


	const txGroups = useGetTransactions(wallet?.address as string)


	console.log(txGroups)

	function isInboxed(tx: TX) {
		return !Address.isEq(tx.from, wallet?.address as string)
	}


	return (
		<div className="page">
			<PageInfoHeading
				title="History"
			/>

			<div className={styles.transactions}>
				{!txGroups && (
					<div className={styles.loaderWrapper}>
						<Spinner width={50} height={50} color="var(--violet-color)"/>
					</div>
				)}


				{txGroups && (Object.entries(txGroups as object) as Entries<Record<string, HistoryTx[]>>).map(
					([dayDate, txs]) => {


						return (
							<Fragment key={dayDate}>
								<div className={styles.transactionsDayDate}>{dayDate}</div>
								{txs.map((tx) => {
									const isReceived = isInboxed(tx)

									const _tokenValue = tx.transferData ? tx.transferData.value : tx.value
									const tokenValue = (+formatUnits(_tokenValue, (tx).decimals))

									const usdValue = new Decimal(tokenValue).mul(tx.usdPrice).toFixed(6)
									const explorerLink = tx.chainId === 1
										? `https://etherscan.io/tx/${tx.txid}`
										: `https://bscscan.io/tx/${tx.txid}`

									return (
										<a
											className={styles.transaction} key={tx.txid}
											target="_blank"
											href={explorerLink}
										>
											<img src={(tx as any).logo as any} className={styles.transaction__logo}/>
											<div
												className={styles.transaction__direction}
											>
												{isReceived ? "Receive" : "Send"}
											</div>

											<div className={styles.transaction__amountContainer}>
												<div className={styles.transaction__tokenAmount}>
													{tokenValue.toFixed(6)} {tx.symbol}
												</div>
												<div className={styles.transaction__usdAmount}>
													{usdValue} USD
												</div>
											</div>

										</a>
									)
								})}
							</Fragment>
						)

					})}
			</div>

		</div>
	)
}