

export class NetworkError extends Error {
	constructor(
		message: string,
		protected code: string | undefined,
	) {
		super(message)
	}
}

export class InternalServerError extends Error {}

export class UnknownApiError extends Error {}


export type HttpBusinessErrorData = {
	errorCode: number,
	message?: string | object
}

export class HttpBusinessError {
	constructor(public data: HttpBusinessErrorData) {}
}

export async function resolveApiError(res: Response) {
		if (res.ok) {
			console.error("Response status code is okay, it shouldn't be called.")
		}

		if (res.status === 500) {
			throw new InternalServerError()
		} else if (res.status === 400) {
			throw new HttpBusinessError(await res.json())
		} else {
			throw new UnknownApiError()
		}
}

