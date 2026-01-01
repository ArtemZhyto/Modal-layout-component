"use client"

//@ Styles
import "@styles-modals/Modal.scss"

//@ Modules
import {
	useEffect,
	useRef,
	useState,
	cloneElement,
	isValidElement,
	ReactElement,
} from "react"

type WithCloseModalProp = {
	closeModal: () => void
}

const Modal = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => {
	const modalRef = useRef<HTMLDivElement | null>(null)
	const backdropRef = useRef<HTMLDivElement | null>(null)

	const [firstTabOnBackdrop, setFirstTabOnBackdrop] = useState(true)

	const initialScrollY = useRef(0)

	const preventBodyScroll = (event: Event) => {
		event.preventDefault()
	}

	useEffect(() => {
		const backdrop = backdropRef.current
		const modal = modalRef.current

		if (!backdrop || !modal) return

		backdrop.classList.add("modal--open")

		modal.focus()

		initialScrollY.current = window.scrollY

		document.body.style.position = 'fixed'
		document.body.style.top = `-${initialScrollY.current}px`
		document.body.style.left = '0'
		document.body.style.right = '0'
		document.body.style.width = '100%'

		document.addEventListener("touchmove", preventBodyScroll, { passive: false })

		setFirstTabOnBackdrop(true)

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!modal) return

			const focusables = modal.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
			const first = focusables[0]
			const last = focusables[focusables.length - 1]

			if (event.key === "Escape") {
				event.preventDefault()
				closeModal()

				return
			}

			if (event.key === "Tab") {
				const active = document.activeElement

				if (firstTabOnBackdrop && active === modal && !event.shiftKey) {
					event.preventDefault()
					first?.focus()
					setFirstTabOnBackdrop(false)

					return
				}

				if (event.shiftKey && active === first) {
					event.preventDefault()
					last?.focus()
				} else if (!event.shiftKey && active === last) {
					event.preventDefault()
					first?.focus()
				}
			}

			if (["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
				const activeEl = document.activeElement
				const isTextInput =
					activeEl &&
					["INPUT", "TEXTAREA"].includes(activeEl.tagName) ||
					(activeEl as HTMLElement).isContentEditable

				if (!isTextInput) {
					event.preventDefault()
				}
			}
		}

		const handleFocusIn = (event: FocusEvent) => {
			if (!modal.contains(event.target as Node)) {
				event.preventDefault()

				const focusables = modal.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
				const last = focusables[focusables.length - 1]
				last?.focus()
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		document.addEventListener("focusin", handleFocusIn)

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
			document.removeEventListener("focusin", handleFocusIn)

			document.removeEventListener("touchmove", preventBodyScroll)

			document.body.style.position = ''
			document.body.style.top = ''
			document.body.style.left = ''
			document.body.style.right = ''
			document.body.style.width = ''

			window.scrollTo(0, initialScrollY.current)
		}
	}, [children])

	const closeModal = () => {
		const backdrop = backdropRef.current
		if (!backdrop) return

		backdrop.classList.remove("modal--open")
		backdrop.classList.add("modal--closing")

		const handleAnimationEnd = () => {
			onClose()
			backdrop.removeEventListener("animationend", handleAnimationEnd)
		}

		backdrop.addEventListener("animationend", handleAnimationEnd)
	}

	const childrenWithClose = (() => {
		if (Array.isArray(children)) {
			return children.map(child => {
				if (isValidElement(child)) {
					return cloneElement(child as ReactElement<WithCloseModalProp>, { closeModal })
				}

				return child
			})
		}

		if (isValidElement(children)) {
			return cloneElement(children as ReactElement<WithCloseModalProp>, { closeModal })
		}

		return children
	})()

	return (
		<div ref={backdropRef}
				 className="modal-backdrop"
				 onClick={closeModal}>
			<div className="modal-content"
					 ref={modalRef}
					 onClick={event => event.stopPropagation()}
					 tabIndex={-1}>
				{childrenWithClose}
			</div>
		</div>
	)
}

export default Modal