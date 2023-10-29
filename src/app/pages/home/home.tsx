import styles from "./home.module.scss"
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../shared/store";
import {Link} from "react-router-dom";
import {PageRoutes} from "../../../config";
import Header from "../../components/header";
import useSWR from "swr";
import api from "../../api";
import {Chain} from "@ethereumjs/common";
import {Network, Token} from "../../../modules/popup/popup.slice";
import {isEmpty} from "lodash";
import {useWeb3Services} from "../../contexts/web3-context";
import Spinner from "../../components/spinner";
import {formatUnits} from "ethers";
import cn from "classnames";
import Web3 from "web3";
import {ERC20ABI} from "../../../modules/crypto/contracts/erc20-abi";
import {Web3Service} from "../../../modules/crypto/web3.service";


type TokenWithPriceInfo = {
	usdPrice: number
	usdChangePercent: number,
	balance: string
} & Token


function useTokenBalancesCorrect() {
	const {tokens, wallet} = useAppSelector((state) => state.popup)
	const ownerAddress = wallet?.address as string

	const {mainnet, bsc} = useWeb3Services()

	const {chains} = useAppSelector((state) => state.popup)

	async function getTokenBalances(web3: Web3, chainId: number) {
		const data: { contract: string, balance: string, }[] = []

		const chainTokens = tokens.filter((t) => t.contract && t.chainId === chainId)

		for (let token of chainTokens) {
			const contract = new web3.eth.Contract<typeof ERC20ABI>(ERC20ABI, token.contract)
			const balance = (await contract.methods.balanceOf(ownerAddress).call()).toString()
			data.push({
				contract: token.contract as string,
				balance
			})
		}
		return data
	}


	const {data: nativeTokensBalances} = useSWR(!isEmpty(chains) && "native-token-balances", async () => {
		const mainnet = chains.find((chain) => chain.chainId === 1) as Network
		const bsc = chains.find((chain) => chain.chainId === 56) as Network

		const mainnetWeb3s = mainnet.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl)).slice(0, 2)
		const bscWeb3 = bsc.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl)).slice(0, 2)

		return {
			ethBalance: await Promise.any(mainnetWeb3s.map(async (web3) => {
				const balance = await web3.eth.getBalance(ownerAddress)
				return balance.toString()
			})),
			bnbBalance: await Promise.any(bscWeb3.map(async (web3) => {
				const balance = await web3.eth.getBalance(ownerAddress)
				return balance.toString()
			})),
		}
	})

	const {data: mainnetTokenBalances} = useSWR(!isEmpty(chains) && 'token-balances-1', async () => {
		const chain = chains.find((chain) => chain.chainId === 1) as Network
		// const web3s = chain.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl))
		const web3s = [mainnet]
		const calls = web3s.map((web3) => getTokenBalances(web3, chain.chainId))
		return await Promise.any(calls)
	})

	const {data: bscTokenBalances} = useSWR(!isEmpty(chains) && 'token-balances-56', async () => {
		const chain = chains.find((chain) => chain.chainId === 56) as Network
		// const web3s = chain.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl))

		const web3s = [bsc]
		const calls = web3s.map((web3) => getTokenBalances(web3, chain.chainId))
		return await Promise.any(calls)
	})


	if (isEmpty(chains)) {
		return
	}


	if (!mainnetTokenBalances || !bscTokenBalances || !nativeTokensBalances) {
		return
	}


	return {
		contractBalances: [...mainnetTokenBalances, ...bscTokenBalances,],
		ethBalance: nativeTokensBalances.ethBalance,
		bnbBalance: nativeTokensBalances.bnbBalance
	}

}


// function useTokenBalances() {
// 	const {tokens, wallet} = useAppSelector((state) => state.popup)
// 	const ownerAddress = wallet?.address as string
// 	const {mainnet, bsc} = useWeb3Services()
//
// 	const {data: mainnetTokenBalances} = useSWR("contract-token-balances-1", async () => {
// 		const chainTokens = tokens.filter((t) => t.contract && t.chainId === Chain.Mainnet)
// 		return api.market.getTokenBalances(chainTokens.map((t) => t.contract as string), ownerAddress, Chain.Mainnet)
// 	})
//
// 	const {data: bscTokenBalances} = useSWR("contract-token-balances-56", async () => {
// 		const chainTokens = tokens.filter((t) => t.contract && t.chainId === 56)
// 		return api.market.getTokenBalances(chainTokens.map((t) => t.contract as string), ownerAddress, 56)
// 	})
//
// 	const {data: nativeTokensBalances} = useSWR(`native-token-balances`, async () => {
// 		const ethBalance = (await mainnet.eth.getBalance(ownerAddress)).toString()
// 		const bnbBalance = (await bsc.eth.getBalance(ownerAddress)).toString()
//
// 		return {
// 			ethBalance,
// 			bnbBalance
// 		}
//
// 	})
//
// 	if (!mainnetTokenBalances || !bscTokenBalances || !nativeTokensBalances) {
// 		return
// 	}
//
// 	return {
// 		contractBalances: [...mainnetTokenBalances, ...bscTokenBalances,],
// 		ethBalance: nativeTokensBalances.ethBalance,
// 		bnbBalance: nativeTokensBalances.bnbBalance
// 	}
// }


function useInfoTokens() {
	const {tokens} = useAppSelector((state) => state.popup)
	const balancesData = useTokenBalancesCorrect()


	const {data: mainnetTokenPrices} = useSWR(`contract-token-prices-1`, async () => {
		const chainTokens = tokens.filter((t) => t.contract && t.chainId === Chain.Mainnet)
		return api.market.getTokenPrices(chainTokens.map((t) => t.contract as string), Chain.Mainnet)
	})

	const {data: bscTokenPrices} = useSWR(`contract-token-prices-56`, async () => {
		const chainTokens = tokens.filter((t) => t.contract && t.chainId === 56)
		return api.market.getTokenPrices(chainTokens.map((t) => t.contract as string), 56)
	})

	const {data: nativeTokenPrices} = useSWR("native-token-prices", async () => {
		return api.market.getNativeTokenPrices()
	})

	if (!mainnetTokenPrices || !bscTokenPrices || !nativeTokenPrices || !balancesData) {
		return undefined
	}
	const {contractBalances, ethBalance, bnbBalance} = balancesData

	const infoTokens: TokenWithPriceInfo[] = []


	tokens.filter((t) => !t.contract).forEach((t) => {

		infoTokens.push({
			...t,
			usdChangePercent: t.symbol === "ETH" ? nativeTokenPrices.ethVsUsdChange : nativeTokenPrices.bnbVsUsdChange,
			usdPrice: t.symbol === "ETH" ? nativeTokenPrices.ethVsUsd : nativeTokenPrices.bnbVsUsd,
			balance: t.symbol === "ETH" ? ethBalance : bnbBalance
		})
	})


	const contractTokenPrices = ([...mainnetTokenPrices, ...bscTokenPrices])
	for (let info of contractTokenPrices) {
		for (let token of tokens) {
			if (token.contract?.toLowerCase() === info.contract.toLowerCase()) {

				const tokenBalance = contractBalances.find((item) => item.contract.toLowerCase() === token.contract?.toLowerCase())


				infoTokens.push({
					...token,
					usdChangePercent: +info.usdPrice,
					usdPrice: +info.usdPrice,
					balance: tokenBalance?.balance || "0"
				})
			}
		}

	}


	return infoTokens

}


export function Home() {
	const {t} = useTranslation()

	const tokens = useInfoTokens()
	const {chains} = useAppSelector(state => state.popup)

	let totalUsdBalance = 0

	if (tokens) {
		tokens.forEach((t) => {
			const usdBalance = +formatUnits(t.balance, t.decimals) * t.usdPrice
			totalUsdBalance += usdBalance
		})
	}



	return (
		<div className={styles.page}>

			<Header/>

			<hr className="separator" style={{marginTop: "20px"}}/>


			<div className={styles.balance}>{totalUsdBalance.toFixed(2)}$</div>

			<div className={styles.actions}>
				<Link className={styles.action} to={PageRoutes.Send}>
					<div className={styles.action__circle}>
						<img className={styles.action__icon} src="static/icons/send.png"/>
					</div>
					<div className={styles.action__text}>{t("home.send")}</div>
				</Link>
				<Link className={styles.action} to={PageRoutes.Receive}>
					<div className={styles.action__circle}>
						<img className={styles.action__icon} src="static/icons/receive.png"/>
					</div>
					<div className={styles.action__text}>{t("home.receive")}</div>
				</Link>
				<Link className={styles.action} to={PageRoutes.AddToken}>
					<div className={styles.action__circle}>
						<img className={styles.action__icon} src="static/icons/import.png"/>
					</div>
					<div className={styles.action__text}>{t("home.import")}</div>
				</Link>
				<div className={styles.action}>
					<div className={styles.action__circle}>
						<img className={styles.action__icon} src="static/icons/tx-history.png"/>
					</div>
					<div className={styles.action__text}>{t("home.history")}</div>
				</div>
			</div>
			<hr className="separator" style={{marginTop: "30px"}}/>

			{!tokens && (
				<div className={styles.loaderWrapper}>
					<Spinner width={50} height={50} color="var(--violet-color)"/>
				</div>
			)}

			<div className={styles.tokens}>
				{tokens && tokens.map((token) => {


						const formattedTokenBalance = +formatUnits(token.balance, token.decimals)

						const usdBalance = formattedTokenBalance * token.usdPrice
						const chain = chains.find((c) => c.chainId === token.chainId) as Network

						return (
							<div className={styles.token} key={`${token.chainId}-${token.contract}`}>
								<img src={token.asset} className={styles.token__logo}/>
								<div className={styles.token__left}>
									<div className={styles.token__wrapper}>
										<span className={styles.token__symbol}>{token.symbol}</span>
										<img width="20px" height="20px" src={chain.asset}/>
									</div>
									<div className={styles.token__wrapper}>
										<div className={styles.token__usdBalance}>$ {token.usdPrice.toFixed(4)}</div>

										<div className={cn(styles.token__changePercent, {
											[styles.token__changePercent__red]: token.usdChangePercent < 0,
											[styles.token__changePercent__green]: token.usdChangePercent > 0,
										})}>
											{token.usdChangePercent.toFixed(2)}%
										</div>

									</div>
								</div>
								<div className={styles.token__right}>
									<div className={styles.token__symbol}>{formattedTokenBalance.toFixed(4)}</div>
									<div className={styles.token__usdBalance}>$ {usdBalance.toFixed(2)}</div>
								</div>
							</div>
						)
					}
				)}
			</div>


		</div>
	)
}