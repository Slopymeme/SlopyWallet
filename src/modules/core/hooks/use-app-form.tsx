import * as yup from "yup";
import {useForm} from "react-hook-form";
import {UseFormProps} from "react-hook-form/dist/types";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useRef} from "react";
import {debounceTime, fromEvent, tap} from "rxjs";


type AppFormParams<T extends object> = {
	schema: yup.ObjectSchema<T>
	onSubmit: (data: T) => Promise<void>
	formProps?: Partial<Omit<UseFormProps<T>, "resolver">>,
}

// debounceSupporting
export function useAppForm<T extends object>(
	{
		formProps = {},
		onSubmit: _onSubmit,
		schema
	}: AppFormParams<T>) {

	const formMethods = useForm<T>({
		resolver: yupResolver(schema) as any,
		...{
			mode: "onSubmit",
			reValidateMode: "onSubmit",
		},

		...formProps
	})
	const {reset, handleSubmit} = formMethods

	const formRef = useRef<HTMLFormElement | null>(null)

	async function onSubmit(data: T) {
		await _onSubmit(data)
		// reset()
	}


	useEffect(() => {
		const sub = fromEvent(formRef.current as HTMLFormElement, "submit").pipe(
			tap((e) => e.preventDefault()),
			debounceTime(1000)
		).subscribe((ev: any) => handleSubmit(onSubmit as any)(ev))
		return () => sub.unsubscribe()
	}, []);


	return {
		methods: formMethods,
		ref: formRef
	}
}