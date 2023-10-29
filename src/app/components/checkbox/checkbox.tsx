import LibCheckbox from 'rc-checkbox';
import {useController, useFormContext} from "react-hook-form";
import './checkbox.scss';
import cn from "classnames";


type Props = {
	name: string,
	disabled?: boolean
	text?: string
	textClassName?: string
}


export function Checkbox({name, disabled, text, textClassName}: Props) {
	const {control} = useFormContext()
	const {field} = useController({control, name})

	return (
		<div>
			<p>
				<label>
					<LibCheckbox
						value="checked"
						checked={!(Boolean(field.value))}
						onChange={(e) => {
							const checked = !e.target.checked

							if (!disabled) {
								field.onChange(checked)
							}

						}}
						// disabled={disabled}
						// disabled={disabled}

					/>
					<span className={cn("rc-checkbox--text", textClassName)}>&nbsp; {text}</span>
				</label>
				&nbsp;&nbsp;
			</p>
		</div>
	)
}