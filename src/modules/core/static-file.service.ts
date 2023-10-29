

export class StaticFileService {


	static getFileURL(relativePath: string) {
		return chrome.runtime.getURL(`static/${relativePath}`)
	}

}