import {useState} from "react";


export function useIsShowSpinner(defaultValue = false) {
	return useState<boolean>(defaultValue)
}