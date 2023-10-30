import styles from "./add-token.module.scss"
import PageInfoHeading from "../../widgets/page-info-heading";
import {useTranslation} from "react-i18next";
import cn from "classnames";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../shared/store";
import {Network, popupActions} from "../../../modules/popup/popup.slice";
import TextField from "../../components/text-field";
import Yup from "../../../modules/core/yup";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {FormProvider, useWatch} from "react-hook-form";
import {useNavigate, useOutletContext, useSearchParams} from "react-router-dom";
import {PageRoutes} from "../../../config";
import qs from "qs";
import {isEthereumAddress} from "class-validator";
import {find, isEmpty} from "lodash";
import {useWeb3Services} from "../../contexts/web3-context";
import {Chain} from "@ethereumjs/common";
import Web3 from "web3";
import {ERC20ABI, NormalERC20ABI} from "../../../modules/crypto/contracts/erc20-abi";
import {ToastService} from "../../../modules/core/toast.service";
import {Web3Service} from "../../../modules/crypto/web3.service";
import {useIsShowSpinner} from "../../hooks/use-spinner";
import Spinner from "../../components/spinner";
import useSWR from "swr";
import api from "../../api";
import useSWRImmutable from "swr/immutable";


export function AddToken() {
	const {t, i18n} = useTranslation()

	const {chains, tokens} = useAppSelector((state) => state.popup)
	const [searchParams] = useSearchParams()
	const chainId = Number(searchParams.get("chainId"))
	let chain = chains.find((chain) => chain.chainId === chainId)
	if (!chain) {
		chain = chains[0]
	}
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	// const {mainnet, bsc} = useWeb3Services()

	// const [isDisabled, setIsDisabled] = useState(false)

	const [isShow, setIsShow] = useIsShowSpinner(false)




	const schema = useMemo(() => {
		return Yup.object().shape({
			// chainId: Yup.st().required(),
			contract: Yup.string().trim().test("is-ethereum-address", (value) => isEthereumAddress(value))
				.required(),
			// symbol: Yup.string().trim().optional(),
			// decimals: Yup.number().integer().max(18).optional()
		})
	}, [])
	const {ref, methods} = useAppForm({
		schema,
		onSubmit: async ({contract: contractAddress}) => {
			setIsShow(true)


			if (tokens.find(
				(t) => t.chainId === chain?.chainId && t.contract?.toLowerCase() === contractAddress.toLowerCase())) {
				ToastService.error(t(`validation.duplicat`))
				setIsShow(false)
				return
			}


			if (!chain) {
				throw new Error("[chain] is undefined")
			}

			const web3s = chain.rpcURLs.map((rpcUrl) => new Web3Service(rpcUrl)) as Web3[]

			if (isEmpty(web3s)) {
				throw new Error("[web3s] пустой.")
			}


			async function getData(web3: Web3) {
				const contract = new web3.eth.Contract<typeof NormalERC20ABI>(NormalERC20ABI, contractAddress)
				const decimals = Number((await contract.methods.decimals().call()))
				const symbol = (await contract.methods.symbol().call())

				return {
					decimals,
					symbol
				}
			}


			try {
				const {decimals, symbol} = await Promise.any(web3s.map((web3) => getData(web3)))

				let asset = chain?.chainId as number === 1
					? "static/icons/chains/mainnet.png"
					: "static/icons/chains/bsc.png"



				try {
					const logo = await api.market.getTokenLogo(chain.chainId, contractAddress)
					if (logo) {
					asset = `data:image/png;base64, ${logo}`
				}
				} catch (e) {
					console.error(e)
				}


				// setIsDisabled(true)
				dispatch(popupActions.addToken({
					chainId: chain.chainId,
					contract: contractAddress,
					decimals,
					symbol,
					asset
				}))
				console.log(`Added new token(${symbol}).`)
				ToastService.success(t(`actionPerfomed`))
				navigate(PageRoutes.Home)
				methods.reset()

			} catch (e) {
				console.error(e)
				ToastService.error(t("somethingWentWrong"))
			} finally {
				setIsShow(false)
			}

		}
	})

	const contractAddress = useWatch({control: methods.control, name: "contract"})




	return (
		<FormProvider {...methods}>
			<form className="page" ref={ref}>
				<PageInfoHeading
					title={t("addToken.title")}
				/>

				<div className={styles.inputs}>
					<TextField
						label={t("addToken.network")}
						name="chainId"
						errorClassName="d-none"
						rightIcon={<img src="static/icons/right-arrow.png"/>}
						leftIcon={<img src={chain.asset} style={{width: "24px", height: "24px"}}/>}
						onClick={() => navigate(
							`${PageRoutes.ChoiceChain}?${qs.stringify({routeTo: PageRoutes.AddToken})}`)}
						placeholder={chain.name}
					/>
					<TextField name="contract" errorClassName="d-none" label={t("addToken.contractAddress")}/>
					{/*<TextField name="symbol" errorClassName="d-none" label={t("addToken.symbol")} />*/}
					{/*<TextField name="decimals" errorClassName="d-none" label={t("addToken.decimals")} />*/}

				</div>

				<button
					className={cn("button", "page__confirm")}
				>{
					isShow ? <Spinner width={25} height={25} color="white"/> : t("confirmButtonText")
				}
				</button>
			</form>
		</FormProvider>
	)
}