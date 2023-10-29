import styles from "./modal.module.scss"
import LibModal from 'react-modal';
import {PropsWithChildren, useEffect} from "react";
import cn from "classnames";

type ModalProps = {
	open: boolean,
	onClose: () => void,
	shouldCloseOnOverlayClick?: boolean,

	className?: string

}


export function Modal({open, onClose, children, className, shouldCloseOnOverlayClick = true}: PropsWithChildren<ModalProps>) {

	useEffect(() => {
		LibModal.setAppElement(document.querySelector(".app") as HTMLDivElement)
	}, []);


	return (
		<LibModal
			isOpen={open}
			className={cn(styles.modal, className)}

			onRequestClose={onClose}
			shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}

			style={{
				overlay: {
					backgroundColor: "var(--overlay-color)",
					zIndex: 10000,
					// padding: "25px !important",
					opacity: "0.99"
				},
				content: {
					border: "none",
					borderRadius: "100px",
					outline: 'none',
				},


			}}

		>
			<div className={styles.modalHeader}>
				<img src="static/icons/cross.png"  onClick={onClose} />
			</div>

			{children}
		</LibModal>
	)
}