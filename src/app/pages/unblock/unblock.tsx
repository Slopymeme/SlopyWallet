import styles from "./unblock.module.scss"
import {useTranslation} from "react-i18next";
import TextField from "../../components/text-field";
import cn from "classnames";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import Yup from "../../../modules/core/yup";
import {useAppDispatch, useAppSelector} from "../../../shared/store";
import React, {useEffect, useState} from "react";
import {FormProvider} from "react-hook-form";
import {Link, useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../config";
import {popupActions} from "../../../modules/popup/popup.slice";
import {ToastService} from "../../../modules/core/toast.service";
import Web3 from "web3";
import {CryptoService} from "../../../modules/crypto/crypto.service";
import jwt_decode from "jwt-decode";
import JSEncrypt from "jsencrypt"
import * as crypto from "crypto"
import api from "../../api";
import {Md5} from "ts-md5";

export function Unblock() {
	const {t} = useTranslation()
	const navigate = useNavigate()
	const {wallet} = useAppSelector((state) => state.popup)
	const dispatch = useAppDispatch()



	const {ref, methods} = useAppForm({
		schema: Yup.object().shape({
			password: Yup.string().required()
		}),
		onSubmit: async ({password}) => {
			if (wallet?.password === Md5.hashStr(password)) {
				dispatch(popupActions.setUnblockedAt(new Date().toISOString()))
				navigate(PageRoutes.Home)
			} else {
				ToastService.error(t("validation.incorrectPassword"))
			}
		}
	})


	const [isShowsPassword, setIsShowsPassword] = useState(false)

	function toggleShowPassword() {
		setIsShowsPassword((flag) => !flag)
	}

	return (
		<FormProvider {...methods}>
			<form className={styles.page} ref={ref}>
				<img className={styles.page__image} src="/static/images/main.png"/>
				<div className={styles.page__name}>Slopy Wallet</div>
				<div className={styles.info}>
					<div className={styles.info__item}>{t("unBlock.wallet")}</div>
					<div className={styles.info__dot}></div>
					<div className={styles.info__item}>{t("unBlock.trade")}</div>
					<div className={styles.info__dot}></div>
					<div className={styles.info__item}>{t("unBlock.NFT")}</div>
					<div className={styles.info__dot}></div>
					<div className={styles.info__item}>{t("unBlock.defi")}</div>
					<div className={styles.info__dot}></div>
					<div className={styles.info__item}>{t("unBlock.dapp")}</div>
				</div>

				<div className={styles.passwordField}>
					<TextField
						name="password"
						placeholder={t("unBlock.typePassword")}
						errorClassName="d-none"
						type={isShowsPassword ? "text" : "password"}
						rightIcon={isShowsPassword ?
							<img src="static/icons/eye-open.png" className="eyeIcon"
							     onClick={toggleShowPassword}/>
							: <img src="static/icons/eye-closed.png" className="eyeIcon" onClick={toggleShowPassword}/>}
					/>


				</div>

				<button className={cn("button", styles.submit)}>{t("unBlock.open")}</button>

				<Link to={PageRoutes.Welcome} className={styles.forgotPassword}>{t("unBlock.forgotPassword")}</Link>
			</form>
		</FormProvider>
	)
}