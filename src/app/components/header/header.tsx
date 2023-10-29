import styles from "./header.module.scss"
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {PageRoutes} from "../../../config";
import {useAppSelector} from "../../../shared/store";
import {CoreService} from "../../../modules/core/core.service";
import cn from "classnames";


export function Header() {
	const {t} = useTranslation()
	const {pathname: currentPath} = useLocation()
	const {wallet} = useAppSelector((state) => state.popup)

	return (
		<div className={styles.header}>
			<img src="static/icons/avatar.png" className={styles.header__avatar}/>
			<div className={styles.header__accountName}>Account</div>
			<img
				src="static/icons/copy.png"
				className={styles.header__copy}
				onClick={() => CoreService.copyTextToClipboard(wallet?.address || "")}
			/>

			<Link
				className={cn(
					styles.header__slopyConnect,
					{[styles.violet]: currentPath.includes(PageRoutes.SlopyConnect)}
					)}
				to={PageRoutes.SlopyConnect}>

				Slopy Connect
			</Link>

			<Link className={styles.hamburger} to={PageRoutes.Settings}>
				<img src="static/icons/hamburger-lines.png"/>
			</Link>

			<Link
				className={cn(
					styles.header__walletName,
					{[styles.violet]: currentPath.includes(PageRoutes.Home)}
				)}

				to={PageRoutes.Home}>
				Wallet
			</Link>

		</div>
	)
}