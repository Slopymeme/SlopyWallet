import styles from "./text-field.module.scss"
import {useController, useFormContext} from "react-hook-form";
import {InputHTMLAttributes} from "react";
import cn from "classnames";
import {get} from "lodash";


type Props = {
	name: string
	label?: string
	inputClassName?: string
	errorClassName?: string

	placeholder?: string


	type?: InputHTMLAttributes<HTMLInputElement>["type"]


	leftIcon?: JSX.Element
	rightIcon?: JSX.Element

	onClick?: () => void
	disabled?: boolean
}

export function TextField({
	                          name,
	                          label,
	                          inputClassName,
	                          errorClassName,
	                          type = "text",
	                          placeholder,
	                          leftIcon,
	                          rightIcon,
	                          onClick,

                          }: Props) {
	const {control} = useFormContext()
	const {field, formState} = useController({control, name})


	function getDefaultValue() {
		const v = field.value as unknown

		if (typeof v === "number") {
			return v
		}

		if (typeof v === "string") {
			if (!v.trim()) {
				return ""
			}
			return v
		}
		return  ""
	}
		const v = getDefaultValue()

	return (
		<div className={styles.field}>
			{label && (
				<div className={styles.field__label}>{label}</div>
			)}


			<div className={cn(styles.field__inputContainer, inputClassName)} onClick={onClick}>
				{leftIcon && (
					<div className={styles.leftIconWrapper}>{leftIcon}</div>
				)}
				<input

					type={type}
					value={v}
					onChange={field.onChange}
					className={cn(styles.field__input)}
					placeholder={placeholder}
				/>

				{rightIcon && (
					<div className={styles.rightIconWrapper}>{rightIcon}</div>
				)}
			</div>


			{get(formState.errors, name) && (
				<div className={cn(styles.field__error, errorClassName)}>
					{get(formState.errors, name)?.message}
				</div>
			)}
		</div>
	)

}