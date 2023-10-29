import {toast, ToastPosition} from "react-toastify";

export class ToastService {

	protected static position: ToastPosition = "top-right"

	static config = {
		position: ToastService.position,
		type: "info",
	} as const

	static info(content: string) {
		toast(content, {
			position: ToastService.position,
			type: "info",

		})
	}

	static error(content: string) {
		toast(content, {
			position: ToastService.position,
			type: "error"
		})
	}

	static success(content: string) {
		toast(content, {
			position: ToastService.position,
			type: "success"
		})
	}


}