import {Oval, TailSpin} from "react-loader-spinner";

type Props = {
	color?: string
	height?: number
	width?: number
}


export function Spinner({color = "var(--violet-color)", width = 50, height = 50}: Props) {

	return (
		<TailSpin
			color={color}
			height={height}
			width={width}
			strokeWidth={3}
		/>
	)
}