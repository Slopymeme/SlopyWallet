import styles from "./choice-chain.module.scss"
import PageInfoHeading from "../../widgets/page-info-heading";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../../shared/store";
import {useNavigate, useSearchParams} from "react-router-dom";
import cn from "classnames";
import TextField from "../../components/text-field";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {PageRoutes} from "../../../config";
import qs from "qs";

export function ChoiceChain() {
	const {t, i18n} = useTranslation()
	const chains = useAppSelector((state) => state.popup.chains)
	const navigate = useNavigate()

	const [searchParams] = useSearchParams()
	const routeTo = searchParams.get("routeTo") as string

	function handleChoiceChain(chainId: number) {
		// navigate + query paramater.

		navigate(`${routeTo}?${qs.stringify({chainId})}`)
	}



	return (
		<div className="page">
			<PageInfoHeading
				title={t("choiceChain.title")}
			/>

			{/*<div className={styles.popularChains}>{t("choiceChain.popularChains")}</div>*/}

			<div className={styles.chains}>
				{chains.map((chain) => (
					<div className={styles.chain} key={chain.chainId} onClick={() => handleChoiceChain(chain.chainId)} >
						<img src={chain.asset} className={styles.chain__icon} />
						<div className={styles.chain__symbol}>{chain.name}</div>
					</div>
				))}
			</div>


		</div>
	)
}