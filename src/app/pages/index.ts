import Welcome from "./welcome";
import Unblock from "./unblock";
import SlopyConnect from "./slopy-connect";
import CreateWallet from "./create-wallet";
import ImportWallet from "./import-wallet";
import SetWalletPassword from "./set-wallet-password";
import {PageRoutes} from "../../config";
import Home from "./home";
import Settings from "./settings";
import AddToken from "./add-token";
import ChoiceChain from "./choice-chain";
import Receive from "./receive";
import Send from "./send";
import {Entries} from "type-fest";
// import { withLastOpenPageUpdater } from "../hooks/use-last-open-page-updater";


export const Pages: Record<keyof typeof PageRoutes, () => JSX.Element> = {
	Welcome: Welcome,
	CreateWallet: CreateWallet,
	ImportWallet: ImportWallet,
	SetWalletPassword: SetWalletPassword,
	Home: Home,

	Unblock: Unblock,
	SlopyConnect: SlopyConnect,
	Settings: Settings,

	AddToken: AddToken,
    ChoiceChain: ChoiceChain,
	Receive: Receive,
	Send: Send
}


// Object.entries(Pages).forEach(([key, component]) => {
// 	// @ts-ignore
// 	Pages[key] = withLastOpenPageUpdater(component)
// })
//

