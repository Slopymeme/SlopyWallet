import {NetworkError, resolveApiError} from "./api-errors"
import {MAIN_SERVER_HOST, NODE_ENV} from "../../config";



export type ReturnType = "json" | "text" | "blob"
export type NewRequestInitVersion = Partial<Omit<RequestInit, "method" | "body">> & Partial<{ returnType: ReturnType }>
export type SupportedBodyTypes = FormData | string | object
export type SupportedMethod = "GET" | "POST" | "PUT" | "PATCH"


export class FetchInstance {

	private constructor(
		protected config: NewRequestInitVersion & { baseURL: string },
	) {
	}

	public static create(config: NewRequestInitVersion & { baseURL: string }) {
		return new FetchInstance({
			...config,
			mode: "cors",
			credentials: "include",
			headers: {
				// 'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
	}


	protected getURL(path: string) {
		let baseURL = this.config.baseURL
		if (baseURL.endsWith("/")) {
			baseURL = baseURL.slice(0, baseURL.length - 1)
		}
		if (!path.startsWith("/")) {
			path = `/${path}`
		}
		if (path.endsWith("/")) {
			path = path.slice(0, path.length - 1)
		}
		return `${baseURL}${path}`

	}

	protected async getData(res: Response, returnType: ReturnType | undefined) {
		switch (returnType) {
			case "json":
				try {
					return await res.json()
				} catch (e) {
					return null
				}
			case "text":
				return await res.text()
			case "blob":
				return await res.blob()
			default:
				try {
					return await res.json()
				} catch (e) {
					return null
				}
		}
	}

	protected baseMethod<T>(method: Exclude<SupportedMethod, "GET">, path: string, config: NewRequestInitVersion, data: SupportedBodyTypes): Promise<T>
	protected baseMethod<T>(method: "GET", path: string, config: NewRequestInitVersion): Promise<T>
	protected async baseMethod<T>(method: SupportedMethod, path: string, config: NewRequestInitVersion, data?: SupportedBodyTypes): Promise<T> {
		const url = this.getURL(path)
		const genericConfig = {...this.config, ...config} as any
		if (method !== "GET") {
			if (data instanceof FormData) {
				genericConfig.headers = {
					// ["Content-Type"]: "multipart/form-data"
				}
				genericConfig.body = data
			} else if (typeof data === "object") {
				genericConfig.headers = {
					["Content-Type"]: "application/json"
				}
				genericConfig.body = JSON.stringify(data)
			} else {
				genericConfig.headers = {
					["Content-Type"]: "text/xml"
				}
				genericConfig.body = data
			}
		}

		let res: Response
		try {
			res = await fetch(url, {
				...genericConfig,
				method,
			})
		} catch (e: any) {
			throw new NetworkError(e.message, e.code)
		}
		if (!res.ok) {
			await resolveApiError(res)
		}
		return await this.getData(res, genericConfig.returnType) as T
	}

	async get<T>(path: string, config: NewRequestInitVersion = {}): Promise<T> {
		return await this.baseMethod<T>("GET", path, config)
	}

	async post<T>(path: string, data: SupportedBodyTypes, config: NewRequestInitVersion = {}) {
		return await this.baseMethod<T>("POST", path, config, data)
	}


	public static getInstance(domain: string) {
		const schema = NODE_ENV === "development" ? "http" : "https"

		return new FetchInstance({
			baseURL: `${schema}://${MAIN_SERVER_HOST}/api/${domain}`
		})
	}

}