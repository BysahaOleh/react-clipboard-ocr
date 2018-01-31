import {Component} from 'react'

export namespace ImageOCR {
	interface Props {
		
	}

	interface State {
		fetch: boolean
		document: string
		alert: string
		error?: string
		progress?: {
			text: string
			percent: number
		}
		clipboard: string
	}
}

export default class ReactImageOCR extends Component<ImageOCR.Props, ImageOCR.State> {}