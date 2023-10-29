import {capitalize} from "lodash";

export type SelectOptions = {
	value: string,
	label: string
}[]

export type SelectOption = {
	value: string,
	label: string
}


export class SelectService {

	static toOptions(values: string[]): SelectOptions {
		return values.map((v) => ({
			label: capitalize(v),
			value: v
		}))
	}



	static fromOptions(optionOrOptions: SelectOption | SelectOptions) {
		if (!optionOrOptions) {
			return null
		}

		if (Array.isArray(optionOrOptions)) {
			return optionOrOptions.map((o) => o.value)
		} else {
			return optionOrOptions.value
		}
	}

	static isSelectOption(o: any): o is SelectOption {
		return "value" in o && "label" in o
	}

}