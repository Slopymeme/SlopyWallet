import "./styles/global.scss"
import './styles/react-toastify.scss';
import {
	createMemoryRouter,
	createRoutesFromElements, Outlet,
	Route,
	RouterProvider,
	Routes,
	useLocation,
	redirect, useNavigate
} from "react-router-dom";
import "./i18n"
import {Link} from "react-router-dom";
import {useTranslation, withTranslation} from "react-i18next";
import {StaticFileService} from "../modules/core/static-file.service";
import React, {createContext, FC, useCallback, useEffect, useMemo, useState} from "react";
import Welcome from "./pages/welcome";
import {Pages} from "./pages";
import {PageRoutes, SlopyConfig} from "../config";
import {Entries} from "type-fest";
import {Provider} from "react-redux";
import {useAppDispatch, useAppSelector, withRedux} from "../shared/store";
import {popupActions} from "../modules/popup/popup.slice";
import Web3 from "web3";
import ReactConfetti from "react-confetti";
import {useIsFirstRender, useWindowSize} from "@uidotdev/usehooks";
import addMinutes from "date-fns/addMinutes"
import {isFuture, isPast} from "date-fns";
import {SWRConfig} from "swr";
import {ToastContainer} from "react-toastify";
import {Web3Service} from "../modules/crypto/web3.service";
import {Web3Context, Web3ContextDataType} from "./contexts/web3-context";
import {ERC20ABI} from "../modules/crypto/contracts/erc20-abi";
import {LastOpenPageUpdater} from "./components/last-open-page-updater";


function App() {
	const dispatch = useAppDispatch()
	const data = useAppSelector((state) => state.popup)
	const {chains, language, unBlockedAt, wallet} = data
	const [web3Data, setWeb3Data] = useState<Web3ContextDataType | null>(null)
	const {i18n} = useTranslation()


	const isFirstRender = useIsFirstRender()

	useEffect(() => {
		if (!isFirstRender) {
			return
		}

		const isRussian = chrome.i18n.getUILanguage().toLowerCase().includes("ru")
		const lang = isRussian ? "ru" : "en"
		void i18n.changeLanguage(lang)

		dispatch(popupActions.setLanguage(lang))


		const [mainnet, bsc] = chains
		setWeb3Data({
			mainnet: new Web3Service(mainnet.rpcURLs[0]),
			bsc: new Web3Service(bsc.rpcURLs[0])
		})


	}, []);


	const router = useMemo(() => {


		let InitialPage = Pages.Welcome

		const routes = createRoutesFromElements((
			<>
				<Route element={<LastOpenPageUpdater/>}>
					{/*<Route>*/}
					<Route path="/" element={<InitialPage/>}/>


					<Route path={PageRoutes.Welcome} element={<Pages.Welcome/>}/>
					<Route path={PageRoutes.CreateWallet} element={<Pages.CreateWallet/>}/>
					<Route path={PageRoutes.ImportWallet} element={<Pages.ImportWallet/>}/>
					<Route path={PageRoutes.SetWalletPassword} element={<Pages.SetWalletPassword/>}/>


					<Route path={PageRoutes.Home} element={<Pages.Home/>}/>


					{/* Нужен контекст, это для добавления токена. add-token, choice-chain,      */}
					<Route>
						<Route path={PageRoutes.AddToken} element={<Pages.AddToken/>}/>
						<Route path={PageRoutes.ChoiceChain} element={<Pages.ChoiceChain/>}/>
					</Route>


					{/*<Route path={PageRoutes.Welcome} element={<Pages.Welcome/>}/>*/}
					<Route path={PageRoutes.SlopyConnect} element={<Pages.SlopyConnect/>}/>
					<Route path={PageRoutes.Settings} element={<Pages.Settings/>}/>

					<Route path={PageRoutes.Receive} element={<Pages.Receive/>}/>
					<Route path={PageRoutes.Send} element={<Pages.Send/>}/>


					<Route path={PageRoutes.Unblock} element={<Pages.Unblock/>}/>
					<Route path={PageRoutes.History} element={<Pages.History/>}/>
				</Route>
			</>
		))
		return createMemoryRouter(routes)
	}, [JSON.stringify(data)])


	if (!web3Data) {
		return (
			<div className="app">
				<h1>Loading...</h1>
			</div>
		)
	}

	return (
		<div className="app">
			<SWRConfig>
				<ToastContainer limit={5} autoClose={2500}/>
				<Web3Context.Provider value={web3Data}>
					<RouterProvider router={router}/>
				</Web3Context.Provider>
			</SWRConfig>
		</div>
	)
}

export default withRedux(withTranslation()(App) as FC)