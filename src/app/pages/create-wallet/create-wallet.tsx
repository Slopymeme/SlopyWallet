import styles from "./create-wallet.module.scss"
import cn from "classnames";
import {useTranslation} from "react-i18next";
import PageInfoHeading from "../../widgets/page-info-heading";
import Yup from "../../../modules/core/yup";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import {FormProvider, useFieldArray} from "react-hook-form";
import TextField from "../../components/text-field";
import {useEffect, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {PageRoutes} from "../../../config";
import qs from "qs";
import {HDNodeWallet, Mnemonic, wordlists} from "ethers";
import {randomBytes} from "web3-utils"
import {CryptoService} from "../../../modules/crypto/crypto.service";
import Checkbox from "../../components/checkbox";
import {ToastService} from "../../../modules/core/toast.service";


type FormValues = {
	words: { value: string }[]
}


export function CreateWallet() {
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
				navigate(`${PageRoutes.SetWalletPassword}?${qs.stringify({mnemonic})}`)
			} catch (e: any) {
				console.error(e, e.stack)
			}
		},
		formProps: {
			defaultValues: {
				words: CryptoService.createMnemonic().split(" ").map((word) => {
					return {value: word}
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
					title={t("createWallet.title")}
					text={t("createWallet.text")}
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