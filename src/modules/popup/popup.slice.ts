import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SlopyConfig} from "../../config";

export type Network = {
	name: string
	chainId: number,
	rpcURLs: string[],
	asset: string
}

export type Token = {
	symbol: string,
	contract?: string
	asset: string,
	chainId: number,
	decimals: number
}

type State = {
	language: "en" | "ru",

	chains: Network[]
	selectedChainId: number,

	wallet?: {
		mnemonic: string,
		password: string,
		address: string,
		privateKey: string,
		publicKey: string
	}

	tokens: Token[]

	unBlockedAt?: string

	lastOpenPage: string | null
}

// static tokens
const initialState: State = {
	language: "en",
	chains: [
		{
			chainId: 1,
			name: "Ethereum",
			rpcURLs: [
				"https://mainnet.infura.io/v3/e755a5760a35419eae9e0d1a8c3b9b0d",
				"https://eth-mainnet.diamondswap.org/rpc",
				"https://rpc.payload.de",
				"https://rpc.flashbots.net",
				// "https://rpc.ankr.com/eth",
				"https://eth.drpc.org",
				"https://rpc.mevblocker.io/fast",
				"https://ethereum.publicnode.com",
				"https://rpc.mevblocker.io"
			],
			asset: "static/icons/chains/mainnet.png"
		},
		{
			chainId: 56,
			name: "BSC",
			rpcURLs: [
				"https://bsc-dataseed1.binance.org",
				"https://binance.llamarpc.com",
				"https://bsc-dataseed3.bnbchain.org",
				"https://binance.nodereal.io",
				"https://bsc.drpc.org",
				"https://1rpc.io/bnb",
				"https://binance.nodereal.io"
			],
			asset: "static/icons/chains/bsc.png"
		},
	],
	// wallet: {
	// 	mnemonic: "",
	// 	address: "0xFFcb520577799503054D0F4647E47d10dBb0F93E",
	// 	privateKey: "d9186a35b4d9350cdc15dfaf1e33176e28ac64870cd24aac35a508f551ddfe16",
	// 	password: "qwerty228"
	// },

	selectedChainId: 1,
	lastOpenPage: null,
	tokens: [

		{
			symbol: "ETH",
			chainId: 1,
			asset: "static/icons/chains/mainnet.png",
			decimals: 18
		},
		{
			symbol: "SLOPY",
			chainId: 1,
			asset: "static/icons/tokens/SLOPY.png",
			decimals: SlopyConfig.Token.decimals,
			contract: SlopyConfig.Token.contract
		},
		{
			symbol: "USDT",
			contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			chainId: 1,
			asset: "static/icons/tokens/USDT.png",
			decimals: 6
		},
		{
			symbol: "USDC",
			contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
			chainId: 1,
			asset: "static/icons/tokens/USDC.png",
			decimals: 6,
		},

		// bsc

		{
			symbol: "BNB",
			chainId: 56,
			asset: "static/icons/chains/bsc.png",
			decimals: 18
		},
		{
			symbol: "USDT",
			contract: "0x55d398326f99059fF775485246999027B3197955",
			chainId: 56,
			asset: "static/icons/tokens/USDT.png",
			decimals: 18
		},
		{
			symbol: "USDC",
			contract: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
			chainId: 56,
			asset: "static/icons/tokens/USDC.png",
			decimals: 18,

		},
		{
			symbol: "BUSD",
			contract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
			chainId: 56,
			asset: "static/icons/tokens/BUSD.png",
			decimals: 18,
		},

	],


}


const slice = createSlice({
	name: "popup",
	initialState,
	reducers: {
		setWalletData(state, action: PayloadAction<State["wallet"]>) {
			state.wallet = action.payload
		},
		addToken(state, action: PayloadAction<Token>) {
			state.tokens.push(action.payload)
		},
		setUnblockedAt(state, action: PayloadAction<State["unBlockedAt"]>) {
			state.unBlockedAt = action.payload
		},
		setLastOpenPage(state, action: PayloadAction<State["lastOpenPage"]>) {
			state.lastOpenPage = action.payload
		},
		setLanguage(state, action: PayloadAction<State["language"]>) {
			state.language = action.payload
		}
	}
})

export const popupActions = slice.actions
export const popupReducer = slice.reducer