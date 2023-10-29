import styles from "./set-wallet-password.module.scss"
import GoBack from "../../components/go-back";
import {useTranslation} from "react-i18next";
import cn from "classnames";
import {FormProvider} from "react-hook-form";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import Yup from "../../../modules/core/yup";
import TextField from "../../components/text-field";
import {useMemo, useState} from "react";
import PageInfoHeading from "../../widgets/page-info-heading";
import {PageRoutes} from "../../../config";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAppDispatch} from "../../../shared/store";
import {popupActions} from "../../../modules/popup/popup.slice";
import {HDNodeWallet} from "ethers";
import {Md5} from 'ts-md5'
import {useSWRConfig} from "swr";

export function SetWalletPassword() {
	const {t, i18n} = useTranslation()
	const navigate = useNavigate()
	let [searchParams, setSearchParams] = useSearchParams();
	const {mutate} = useSWRConfig()
	const dispatch = useAppDispatch()

	const mnemonic = searchParams.get("mnemonic") as string


	const schema = useMemo(() => {
		return Yup.object().shape({
			password: Yup.string().required(t("setWalletPassword.passwordRequired")),
			passwordConfirmation: Yup.string()
				.test('passwords-match', t("setWalletPassword.passwordsMustMatch"), function (value) {
					return this.parent.password === value
				})
		})

	}, [i18n.language])


	const {ref, methods} = useAppForm({
		schema,
		onSubmit: async ({password}) => {
			const {address, privateKey, publicKey} = HDNodeWallet.fromPhrase(mnemonic)

			await mutate(key => true, undefined, {revalidate: false})
			dispatch(popupActions.setWalletData({
				mnemonic,
				password: Md5.hashStr(password),
				address,
				privateKey,
				publicKey
			}))
			navigate(PageRoutes.Home)
		},
	})


	const [isShowsPassword, setIsShowsPassword] = useState(false)
	const [isShowsConfirmPassword, setIsShowsConfirmPassword] = useState(false)

	function toggleShowPassword() {
		setIsShowsPassword((flag) => !flag)
	}

	function toggleShowConfirmPassword() {
		setIsShowsConfirmPassword((flag) => !flag)
	}


	return (
		<FormProvider {...methods}>
			<form className="page" ref={ref}>

				<PageInfoHeading
					title={t("setWalletPassword.title")}
					text={t("setWalletPassword.text")}
				/>

				<div className={styles.page__inputs}>
					<TextField
						name="password"
						label={t("setWalletPassword.passwordInput.label")}
						placeholder={t("setWalletPassword.passwordInput.placeholder")}
						type={isShowsPassword ? "text" : "password"}
						rightIcon={isShowsPassword ?
							<img src="static/icons/eye-open.png" className="eyeIcon"
							     onClick={toggleShowPassword}/>
							: <img src="static/icons/eye-closed.png" className="eyeIcon" onClick={toggleShowPassword}/>}
					/>
					<TextField
						name="passwordConfirmation"
						label={t("setWalletPassword.passwordConfirmationInput.label")}
						placeholder={t("setWalletPassword.passwordConfirmationInput.placeholder")}
						type={isShowsConfirmPassword ? "text" : "password"}
						rightIcon={isShowsConfirmPassword ?
							<img src="static/icons/eye-open.png" className="eyeIcon"
							     onClick={toggleShowConfirmPassword}/>
							: <img src="static/icons/eye-closed.png" className="eyeIcon"
							       onClick={toggleShowConfirmPassword}/>}

					/>
				</div>
				<button className={cn("button", "page__confirm")}>{t("confirmButtonText")}</button>
			</form>
		</FormProvider>
	)
}