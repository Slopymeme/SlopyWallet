import {useState} from "react";

export const useModalState = (initialState: boolean = false) => {
	const [isOpen, setIsOpen] = useState(initialState);

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsOpen(false);
	};

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return {isOpen, toggle, open, close};
};