import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import cn from "classnames";
import PageInfoHeading from "../../widgets/page-info-heading";
import {QrCode} from "../../components/qr-code/qr-code";
import {useAppSelector} from "../../../shared/store";
import {build} from 'eth-url-parser';
import {useEffect, useState} from "react";
import styles from "./receive.module.scss"
import {PageRoutes} from "../../../config";
import qs from "qs";
import TextField from "../../components/text-field";
import Yup from "../../../modules/core/yup";
import {isEthereumAddress} from "class-validator";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {FormProvider, useWatch} from "react-hook-form";

const schema = Yup.object().shape({
	recipient: Yup.string().trim().test("is-ethereum-address", (value) => isEthereumAddress(value))
		.required()
})

export function Receive() {
	const {t, i18n} = useTranslation()
	const navigate = useNavigate()
	const {wallet, chains} = useAppSelector((state) => state.popup)
	const [searchParams] = useSearchParams()
	const chainId = Number(searchParams.get("chainId"))
	let chain = chains.find((chain) => chain.chainId === chainId)
	if (!chain) {
		chain = chains[0]
	}

	const {ref, methods} = useAppForm({
		schema,
		onSubmit: async () => {
			navigate(PageRoutes.Home)
		}
	})

	const [qrData, setQrData] = useState<string | null>(null)

	const recipient = useWatch({control: methods.control, name: "recipient"})


	useEffect(() => {
		methods.setValue("recipient", wallet?.address as string)
	}, [wallet?.address]);


	useEffect(() => {
		const data = build({
			chain_id: chain?.chainId as any,
			target_address: recipient || ""
		})
		setQrData(data)
	}, [chain, recipient]);


	return (
		<FormProvider {...methods}>
			<form className="page" ref={ref}>
				<PageInfoHeading
					title={t("receive.title")}
				/>
				<div className={styles.inputs}>
					<TextField
						label={t("receive.network")}
						name="chainId"
						errorClassName="d-none"
						rightIcon={<img src="static/icons/right-arrow.png"/>}
						leftIcon={<img src={chain.asset} style={{width: "24px", height: "24px"}}/>}
						onClick={() => navigate(
							`${PageRoutes.ChoiceChain}?${qs.stringify({routeTo: PageRoutes.Receive})}`)}
						placeholder={chain.name}
					/>
					<TextField
						label={t("receive.recipient")}
						name="recipient"
						errorClassName="d-none"
					/>
				</div>

				<div className={styles.qrCodeWrapper}>
					<QrCode data={qrData as string}/>
				</div>

				<button
					className={cn("button", "page__confirm")}
					onClick={() => navigate(PageRoutes.Home)}

				>{t("receive.title")}</button>
			</form>
		</FormProvider>
	)
}