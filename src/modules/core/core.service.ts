import {isPast} from "date-fns";
import addMinutes from "date-fns/addMinutes";

export class CoreService {

	static copyTextToClipboard(text: string) {
		if (!navigator.clipboard) {
			CoreService.fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}

	protected static fallbackCopyTextToClipboard(text: string) {
		var textArea = document.createElement("textarea");
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}

		document.body.removeChild(textArea);
	}


	isUnlockNeeded(_unBlockAt: string | undefined) {
		if (!_unBlockAt) {
			return false
		}
		const unBlockAt = new Date(_unBlockAt)
		return isPast(addMinutes(unBlockAt, 5))
	}


}