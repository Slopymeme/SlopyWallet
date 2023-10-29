import styles from "./welcome.module.scss"
import cn from "classnames"
import {useTranslation} from "react-i18next";
import {toUpper} from "lodash";
import {Link} from "react-router-dom";
import {PageRoutes} from "../../../config";

export function Welcome() {
	const {t} = useTranslation()
	return (
		<div className={styles.page}>
			<div className={styles.page__name}>Slopy Wallet</div>
			<img className={styles.page__image} src="/static/images/main.png"/>
			<div className={styles.page__buttons}>
				<Link to={PageRoutes.CreateWallet}>
					<button className={cn("button")}>{toUpper(t("wallet.create"))}</button>
				</Link>
				<Link to={PageRoutes.ImportWallet}>
					<button className={cn("button", "button_transparent")}>{toUpper(t("wallet.import"))}</button>
				</Link>
			</div>
		</div>
	)
}