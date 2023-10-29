import {useEffect, useRef, useState} from "react";
import styles from "./qr-code.module.scss"
import QRCodeStyling from "qr-code-styling";
import {useIsFirstRender} from "@uidotdev/usehooks";
import {useTranslation} from "react-i18next";



type Props = {
	data: string
}


const qrCode = new QRCodeStyling({
	width: 130,
	height: 130,
	type: "canvas",
	dotsOptions: {
		color: "black",
		type: "rounded"
	},
	backgroundOptions: {
		color: "white",
	},
	imageOptions: {
		imageSize: 25
	},

	// image: "/static/images/main.png",
	qrOptions: {
		errorCorrectionLevel: "L"
	}
})

export function QrCode({data}: Props) {
	// const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null)

	const {t} = useTranslation()

	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const div = (ref.current as HTMLDivElement)
		qrCode.append(div);
	}, []);


	useEffect(() => {
		qrCode.update({data})
	}, [data]);

	return (
		<div className={styles.qrCode}>
			<div className={styles.qrCode__title}>{t("qrCode")}</div>
			<div className={styles.qrCode__container}>
				<div ref={ref} onClick={() => qrCode.download({name: "qr", extension: "jpeg"})}/>
			</div>
		</div>
	)
}