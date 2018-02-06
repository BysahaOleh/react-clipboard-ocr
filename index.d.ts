import { Component } from 'react'

export namespace ImageOCR {
	interface Props {

	}

	interface State {
		fetch: boolean
		documents: string[]
		currentPage: number
		alert: string
		error?: string
		flipping: boolean
		progress?: {
			text: string
			percent: number
		}
		metaKey: boolean
		clipboard: string
	}
}

export namespace Tesseract {
	interface Progress {
		progress: number,
		status: string
	}

	interface Result {
		text: string
	}
}

export namespace Button {
	interface NavigationButton {
		disabled?: boolean
	}
}

export default class ReactImageOCR extends Component<ImageOCR.Props, ImageOCR.State> {}