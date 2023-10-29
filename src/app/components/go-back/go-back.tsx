import styles from "./go-back.module.scss"
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {camelCase, capitalize} from "lodash";
import {useTranslation} from "react-i18next";
import {PageRoutes} from "../../../config";

export function GoBack() {
	const _navigate = useNavigate();
	const {t} = useTranslation()
	const location = useLocation()

	function navigate() {
		const currentPath = `${location.pathname}`

		if (
			currentPath.includes(PageRoutes.CreateWallet)
			|| currentPath.includes(PageRoutes.ImportWallet)
			|| currentPath.includes(PageRoutes.SetWalletPassword)
			|| currentPath.includes(PageRoutes.ChoiceChain)
		) {
			_navigate(-1)
		} else {
			_navigate(PageRoutes.Home)
		}

	}


	return (
		<div className={styles.goBack} onClick={() => navigate()}>
			<img src="static/icons/left-arrow.png" className={styles.goBack__image}/>
			<div className={styles.goBack__text}>{capitalize(t(`goBack`))}</div>
		</div>
	)

}