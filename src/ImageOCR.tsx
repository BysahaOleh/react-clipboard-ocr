import * as React from 'react'
import { Line } from 'rc-progress'
const pdfJS = require('pdfjs-dist')
import ImageCropper from 'react-cropper'
const Tesseract = require('tesseract.js/dist/tesseract.js')

import { ImageOCR as Interface, Tesseract as TesseractInterface } from '../'

import {
	Container,
	DocumentContainer,
	Button,
	FileInput,
	HeaderContainer,
	Label,
	NavigationBlock,
	NavigationButton,
	PageCounter
} from './components/main'
import { Alert, LoaderContainer, LoaderText, LoaderWrapper } from './components/loader'

const styles = {
	clipboardInput: {
		opacity: 0,
		zIndex: -1,
		cursor: 'default',
		position: 'fixed',
		top: '0px',
		left: '10px',
		width: 'calc(100% - 20px)'
	}
} as React.CSSProperties

export default class ImageOCR extends React.Component<Interface.Props, Interface.State> {
	private cropper: any
	private clipboardInput: any
	private keyDownListener: any
	private keyUpListener: any

	constructor(props: any) {
		super(props)

		this.state = {
			fetch: false,
			documents: [],
			currentPage: 0,
			alert: null,
			clipboard: '',
			flipping: false,
			metaKey: false
		}

		this.onUploadImage = this.onUploadImage.bind(this)
		this.onCrop = this.onCrop.bind(this)
		this.setPage = this.setPage.bind(this)
		this.onMouseOver = this.onMouseOver.bind(this)
		this.onMouseOut = this.onMouseOut.bind(this)
		this.setOCRProcessStatus = this.setOCRProcessStatus.bind(this)
		this.uiNextPage = this.uiNextPage.bind(this)
		this.uiPrevPage = this.uiPrevPage.bind(this)
	}

	componentWillMount() {
		const ctrlKey = 17, cmdKey = 91, cKey = 67

		this.keyDownListener = document.addEventListener('keydown', event => {
			let {flipping} = this.state

			if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
				this.setMetaKey(true)
			} else if (event.keyCode === cKey) {
				if (flipping) {
					this.copyToClipboard()
				}
			}
		})

		this.keyUpListener = document.addEventListener('keyup', () => {
			this.setMetaKey(false)
		})
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.keyDownListener)
		document.removeEventListener('keyup', this.keyUpListener)
	}

	copyToClipboard() {
		this.clipboardInput.select()
		document.execCommand('copy')
		this.clipboardInput.blur()

		this.cropper.clear()
		this.uiCloseAlert()
	}
	cleanDocument() {
		this.setState({
			documents: [],
			currentPage: 0
		})
	}
	getImageBase64(file: Blob) {
		const reader = new FileReader()
		return new Promise((resolve) => {
			reader.readAsDataURL(file)
			reader.onloadend = function () {
				resolve(reader.result)
			}
		})

	}
	getPDFBase64(file: Blob) {
		const fileReader = new FileReader()
		return new Promise((resolve, reject) => {
			fileReader.onload = function () {
				pdfJS.getDocument(fileReader.result).then(function (pdf: any) {
					const pages = []

					for (let i = 1; i <= +pdf.numPages; i++) {
						pages.push(pdf.getPage(i))
					}

					Promise.all(pages).then(function (documents: any[]) {
						const canvases = []
						const tasks = documents.map(doc => {
							const scale = 1.5
							const viewport = doc.getViewport(scale)
							const canvas = document.createElement('canvas')
							const context = canvas.getContext('2d')
							canvas.height = viewport.height
							canvas.width = viewport.width

							canvases.push(canvas)
							return doc.render({canvasContext: context, viewport: viewport}).promise
						})

						Promise.all(tasks).then((elements) => {
							resolve(elements.map((element, key: number) => canvases[key].toDataURL('image/jpeg')))
						}).catch(error => {
							reject(error)
						})
					})
				})
			}

			fileReader.readAsArrayBuffer(file)
		})
	}

	onCrop() {
		this.cropper.getCroppedCanvas().toBlob((blob: Blob) => {
			this.processDocument(blob)
		})
	}
	onMouseOut() {
		this.setState({
			flipping: false
		})
	}
	onMouseOver() {
		this.setState({
			flipping: true
		})
	}
	onUploadImage(event: React.SyntheticEvent<HTMLInputElement>) {
		if (event.currentTarget.files.length) {
			this.cleanDocument()
			switch (event.currentTarget.files[0].type) {
				case 'image/png':
				case 'image/jpeg':
					this.getImageBase64(event.currentTarget.files[0]).then(this.setPage)
					break
				case 'application/pdf':
					this.getPDFBase64(event.currentTarget.files[0]).then(this.setPage)
					break
				default:
					this.uiOpenAlert('Incorrect format document')
			}
		}
	}

	processDocument(crop: Blob) {
		Tesseract.recognize(crop).progress(this.setOCRProcessStatus)
			.catch(() => this.uiOpenAlert('Error'))
			.then((result: TesseractInterface.Result) => {
				this.setOCRResult(result)
				this.uiOpenAlert('To copy, press "Ctrl + C / Cmd + C"')
			})
	}

	uiOpenAlert(text: string) {
		this.setState({
			alert: text
		})
	}
	uiCloseAlert() {
		this.setState({
			alert: null
		})
	}
	uiNextPage() {
		let {currentPage, documents} = this.state

		this.setState({
			currentPage: currentPage + 1 === documents.length ? currentPage : currentPage + 1
		})
	}
	uiPrevPage() {
		let {currentPage} = this.state

		this.setState({
			currentPage: currentPage !== 0 ? currentPage - 1 : currentPage
		})
	}

	setOCRProcessStatus(state: TesseractInterface.Progress) {
		this.setState({
			fetch: true,
			progress: {
				percent: state.progress,
				text: state.status
			}
		})
	}
	setOCRResult(result: TesseractInterface.Result) {
		this.setState({
			fetch: false,
			progress: null,
			clipboard: result.text
		})
	}
	setMetaKey(status: boolean) {
		this.setState({
			metaKey: status
		})
	}
	setPage(documents: string[]) {
		this.setState({
			documents
		})
	}

	renderAlert() {
		let {alert} = this.state

		if (alert) {
			return (
				<LoaderWrapper onClick={() => {
					this.uiCloseAlert()
					this.cropper.clear()
				}}>
					<Alert>{alert}</Alert>
				</LoaderWrapper>
			)
		}
	}
	renderDocument() {
		let {documents, currentPage} = this.state
		if (documents && documents.length) {
			return (
				<DocumentContainer>
					{this.renderLoader()}
					{this.renderAlert()}
					<ImageCropper
						ref={ref => this.cropper = ref}
						src={documents[currentPage]}
						center={false}
						guides={false}
						highlight={false}
						background={true}
						autoCrop={false}
						movable={true}
						rotatable={false}
						viewMode={1}
						responsive={true}
						scalable={true}
						zoomable={true}
						zoomOnTouch={false}
						zoomOnWheel={true}
						cropBoxMovable={false}
						cropBoxResizable={false}
						toggleDragModeOnDblclic={false}
						cropend={this.onCrop}
						style={{
							minHeight: '500px',
							height: '100%'
						}}
					/>
				</DocumentContainer>
			)

		}
		return null
	}
	renderLoader() {
		let {fetch, progress} = this.state
		if (fetch) {
			return (
				<LoaderWrapper>
					<LoaderContainer>
						<Line percent={progress.percent}/>
						<LoaderText>{progress.text}</LoaderText>
					</LoaderContainer>
				</LoaderWrapper>
			)
		}
	}
	renderNavigationBlock() {
		let {documents, currentPage} = this.state

		if (documents && documents.length && documents.length > 1) {
			return (
				<NavigationBlock>
					<NavigationButton onClick={this.uiPrevPage} disabled={currentPage === 0}>{'<'}</NavigationButton>
					<NavigationButton
						onClick={this.uiNextPage}
						disabled={currentPage + 1 === documents.length}
					>
						{'>'}
					</NavigationButton>
				</NavigationBlock>
			)
		}
	}
	renderPageCounter() {
		let {documents, currentPage} = this.state

		if(documents && documents.length && documents.length > 1) {
			return <PageCounter>{currentPage + 1}/{documents.length}</PageCounter>
		}
	}

	render() {
		let {clipboard} = this.state
		return (
			<Container onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
				<HeaderContainer>
					<Label htmlFor="file-uploader-input">
						<Button>
							Choose file
						</Button>
					</Label>
					<input type="text" value={clipboard} ref={ref => this.clipboardInput = ref} style={styles.clipboardInput}/>
					{this.renderPageCounter()}
					{this.renderNavigationBlock()}
				</HeaderContainer>
				<FileInput
					id="file-uploader-input"
					type="file"
					name="image"
					accept="image/jpeg,image/png,application/pdf"
					onChange={this.onUploadImage}
				/>
				{this.renderDocument()}
			</Container>
		)
	}
}