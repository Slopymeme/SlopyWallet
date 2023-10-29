import styles from "./page-info-heading.module.scss"
import GoBack from "../../components/go-back";


type Props = {
	title: string
	text?: string
}

export function PageInfoHeading({title, text}: Props) {

	return (
		<div className={styles.info}>
			<GoBack/>
			<div className={styles.info__title}>{title}</div>
			{text && <div className={styles.info__text}>{text}</div>}
		</div>
	)
}