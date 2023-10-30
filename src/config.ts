export const NODE_ENV = process.env.NODE_ENV as any as string
export const MAIN_SERVER_HOST = process.env.MAIN_SERVER_HOST as any as string


export const PageRoutes = {
	Welcome: "welcome",
	CreateWallet: "create-wallet",
	ImportWallet: "import-wallet",
	SetWalletPassword: "set-wallet-password", // mnemonic as query parameter.

	Home: "home",

	// Process. Нужно использовать контекст со стоянием выбора сети.
	AddToken: "add-token",
	// выбор сети на отдельной странице, после выбора ставим в стейт этот токен, и перемещаемся на add-token страницу.
	ChoiceChain: "choice-chain",


	// Разблокировка кошелька через пароль, вход в кошелек. Показывать только после бездействия 5 минут. localStorage.
	Unblock: "unblock", // via password

	// main: "main", // Общий баланс, токены (обновляемые через swr), хедер и тд.
	SlopyConnect: "slopy-connect",
	Settings: "settings",

	Receive: "receive",
	Send: "send",


	History: "history"
} as const

Object.entries(PageRoutes).forEach(([key, value]) => {
	// @ts-ignore
	PageRoutes[key] = `/${value}`
})



export const SlopyConfig = {
	Token: {
		contract: "0x28d6CEFDC7a57cB3E2958f61c95B20C76103Fd79",
		decimals: 18,
	},
	NFT: {
		contract: "0xb6876309AaFe1ef6d839aaE21A7126A99D105a53",
	},
	walletStatuses: {
		TIDY: 1776e9,
		Master: 22200e9
	},
	meta: {
		website: "https://slopy.io",
		nftCollection: "https://opensea.io/collection/slopy"
	}

}