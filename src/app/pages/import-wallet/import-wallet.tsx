import styles from "./import-wallet.module.scss"
import cn from "classnames";
import {useTranslation} from "react-i18next";
import PageInfoHeading from "../../widgets/page-info-heading";
import Yup from "../../../modules/core/yup";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {FormProvider, useFieldArray} from "react-hook-form";
import TextField from "../../components/text-field";
import {useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../config";
import qs from "qs";
import {HDNodeWallet} from "ethers";
import {ToastService} from "../../../modules/core/toast.service";


type FormValues = {
	words: { value: string }[]
}

// embody spice patrol gold sing ostrich scatter shine sketch hope document square
let range = (n: number) => Array.from(Array(n).keys())

export function ImportWallet() {
	const {t, i18n} = useTranslation()
	const navigate = useNavigate()

	const schema = useMemo(() => {
		return Yup.object().shape({
			words: Yup.array().of(Yup.object().shape({
				value: Yup.string().trim().required(t(`validation.required`))
			})).min(12).max(12)
		})

	}, [i18n.language])


	const {ref, methods} = useAppForm<FormValues>({
		schema: schema as any,
		onSubmit: async ({words}) => {
			const mnemonic = words.map((w) => w.value).join(" ")
			try {
				HDNodeWallet.fromPhrase(mnemonic)
				methods.reset()
				navigate(`${PageRoutes.SetWalletPassword}?${qs.stringify({mnemonic})}`)
			} catch (e: any) {
				ToastService.error(t("somethingWentWrong"))
				console.error(e, e.stack)
			}
		},
		formProps: {
			defaultValues: {
				words: range(12).map(() => {
					return {value: undefined}
				})
			}
		}
	})


	const {fields} = useFieldArray({
		name: "words",
		control: methods.control
	})


	return (
		<FormProvider {...methods}>
			<form className={cn("page")} ref={ref}>
				<PageInfoHeading
					title={t("importWallet.title")}
					text={t("importWallet.text")}
				/>

				<div className={styles.words}>
					{fields.map((field, i) => {
						return <TextField key={field.id} name={`words.${i}.value`} placeholder={`${i + 1}`}

						                  inputClassName={styles.wordInput}
						                  errorClassName="d-none"
						/>
					})}
				</div>

				<button type="submit" className={cn("button", "page__confirm")}>{t("confirmButtonText")}</button>
			</form>
		</FormProvider>
	)
}