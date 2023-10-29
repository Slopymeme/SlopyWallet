import styles from "./settings.module.scss"
import cn from "classnames";
import {useTranslation} from "react-i18next";
import PageInfoHeading from "../../widgets/page-info-heading";
import {Link, useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../config";
import Switch from "react-switch";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {popupActions} from "../../../modules/popup/popup.slice";


export function Settings() {
	const navigate = useNavigate()
	const [isChecked, setIsChecked] = useState(false)

	const dispatch = useDispatch()


	const {t} = useTranslation()
	return (
		<div className="page">
			<PageInfoHeading
				title={t("settings.title")}
			/>

			<div className={styles.links}>

				<div className={styles.link} onClick={() => {
					dispatch(popupActions.setUnblockedAt(undefined))
					navigate(PageRoutes.Unblock)
				}}>
					<div className={styles.link__wrapper}>
						<div className={styles.link__iconWrapper}>
							<img src="static/icons/wallet-management.png"/>
						</div>

						<div className={styles.link__text}>Lock Wallet</div>
					</div>
					<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>
				</div>


				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/wallet-management.png"/>*/}
				{/*		</div>*/}

				{/*		<div className={styles.link__text}>{t("settings.walletManagement")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}

				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/wallet-security.png"/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.walletSecurity")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}
				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/settings.png"/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.settings")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}
				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/address-book.png"/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.addressBook")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}


				{/*<div className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/clip.png" className={styles.clipIcon}/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.setCurrentWalletAsDefault")}</div>*/}
				{/*	</div>*/}

				{/*	<Switch*/}
				{/*		checked={isChecked}*/}
				{/*		onChange={setIsChecked}*/}
				{/*		offColor="#E8E6E6"*/}
				{/*		onColor="#AA4EAC"*/}
				{/*		width={40}*/}
				{/*		height={20}*/}
				{/*		checkedIcon={false}*/}
				{/*		uncheckedIcon={false}*/}
				{/*	/>*/}
				{/*</div>*/}


				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/about.png"/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.aboutWallet")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}

				{/*<Link to={PageRoutes.Settings} className={styles.link}>*/}
				{/*	<div className={styles.link__wrapper}>*/}
				{/*		<div className={styles.link__iconWrapper}>*/}
				{/*			<img src="static/icons/support.png"/>*/}
				{/*		</div>*/}
				{/*		<div className={styles.link__text}>{t("settings.support")}</div>*/}
				{/*	</div>*/}
				{/*	<img src="static/icons/right-arrow.png" className={styles.link__arrow}/>*/}
				{/*</Link>*/}

			</div>

			{/*<button className={cn("button", "page__confirm")}>{t("confirmButtonText")}</button>*/}
		</div>
	)
}