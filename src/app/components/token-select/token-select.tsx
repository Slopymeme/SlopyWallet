import styles from "./token-select.module.scss"
import {useAppSelector} from "../../../shared/store";
import {HTMLProps} from "react";
import {SelectOption, SelectOptions, SelectService} from "../../../modules/core/select-service";
import {useController, useFormContext, useWatch} from "react-hook-form";
import LibSelect, {components, ValueContainerProps} from "react-select"
import {get} from "lodash";
import cn from "classnames";
import {Token} from "../../../modules/popup/popup.slice";

const {Option, ValueContainer} = components;

interface InputProps extends HTMLProps<HTMLInputElement> {
	name: string
	label?: string
	// placeholder?: string,
	// options: SelectOptions
	// isMulti?: boolean

	errorClassName?: string
	chainId: number,
	placeholder: string,
}


function TokenValueContainer({children, ...props}: ValueContainerProps) {
	// console.log(props)
	const {control} = useFormContext()
	const data = useWatch({name: "token", control}) as SelectOption & { token: Token }


	return (
		<ValueContainer {...props}>
			<div className={styles.valueContainerContent}>
				{data && <img src={data.token.asset} width="24px" height="24px"/>}
				{children}
			</div>
		</ValueContainer>
	)
}


function TokenOption(props: any) {

	const data = props.data as SelectOption & { token: Token }

	return (
		<Option {...props}>
			<div className={styles.optionContent}>
				<img src={data.token.asset} width="24px" height="24px"/>
				{props.data.label}
			</div>
		</Option>
	)


}


export function TokenSelect({name, label, errorClassName, chainId, placeholder}: InputProps) {
	const {control} = useFormContext()
	const {field, formState} = useController({control, name} as any)
	const _tokens = useAppSelector((state) => state.popup.tokens)
	const tokens = _tokens.filter((token) => token.chainId === chainId)

	const options: SelectOptions = tokens.map((token) => {
		return {
			label: token.symbol,
			value: token.contract as string,
			token
		}
	})


	return (
		<div className={styles.field}>
			{label && (
				<div className={styles.field__label}>
					<span className={styles.title__name}>{label}</span>
				</div>
			)}

			<LibSelect
				placeholder={placeholder}
				options={options}
				onChange={(optionOrOptions: any) => {
					field.onChange(optionOrOptions)
				}}
				value={field.value}

				isSearchable={false}


				styles={{
					dropdownIndicator: base => ({
						...base,
						color: "var(--violet-color)"
					}),
					control: base => ({
						...base,
						border: 0,
						// This line disable the blue border
						boxShadow: 'none'
					})
				}}

				classNames={{
					input: (state) => styles.select__input,
					container: state => styles.select__container,
					control: state => styles.select__control,
					placeholder: state => styles.select__placeholder,
					menu: (state) => styles.select__menu,
					option: state => styles.select__option,
					dropdownIndicator: state => styles.select__dropdwonIndicator,
					valueContainer: state => styles.select__valueContainer,
					singleValue: state => styles.select__singleValue,
				}}
				components={{
					Option: TokenOption,
					ValueContainer: TokenValueContainer
				}}
			/>

			{get(formState.errors, name) && (
				<div className={cn(styles.field__error, errorClassName)}>
					{get(formState.errors, name)?.message}
				</div>
			)}

		</div>
	)

}