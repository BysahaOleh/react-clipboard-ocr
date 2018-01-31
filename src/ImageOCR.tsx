import * as React from 'react'
import { Line } from 'rc-progress'
const pdfJS = require('pdfjs-dist')
import ImageCropper from 'react-cropper'
import { CopyToClipboard } from 'react-copy-to-clipboard'
const Tesseract = require('tesseract.js/dist/tesseract.js')

import { ImageOCR as Interface } from '../'

import {Container, DocumentContainer, Button, FileInput, HeaderContainer, Label} from './components/main'
import {Alert, LoaderContainer, LoaderText, LoaderWrapper} from './components/loader'

export default class ImageOCR extends React.Component<Interface.Props, Interface.State> {
	private cropper: any

	constructor(props: any) {
		super(props);

		this.state = {
			fetch: false,
			document: null,
			alert: null,
			clipboard: null
		}

		this.onUploadImage = this.onUploadImage.bind(this)
		this.crop = this.crop.bind(this)
	}

	getImageBase64(file: Blob) {
		const reader = new FileReader();
		const self = this

		reader.readAsDataURL(file);
		reader.onloadend = function () {
			self.setState({
				document: reader.result
			})
		}
	}
	getPDFBase64(file: Blob) {
		const fileReader = new FileReader();
		const self = this

		fileReader.onload = function () {
			pdfJS.getDocument(fileReader.result).then(function (pdf: any) {
				pdf.getPage(1).then(function (page: any) {
					let scale = 1.5
					let viewport = page.getViewport(scale)
					let canvas = document.createElement('canvas')
					let context = canvas.getContext('2d');
					canvas.height = viewport.height
					canvas.width = viewport.width
					let task = page.render({canvasContext: context, viewport: viewport})
					task.promise.then(function () {
						self.setState({
							document: canvas.toDataURL('image/jpeg')
						})
					});
				});
			});
		}
		fileReader.readAsArrayBuffer(file);
	}
	onUploadImage(event: React.SyntheticEvent<HTMLInputElement>) {
		if(event.currentTarget.files.length) {
			switch (event.currentTarget.files[0].type) {
				case 'image/png':
				case 'image/jpeg':
					this.getImageBase64(event.currentTarget.files[0])
					break
				case 'application/pdf':
					this.getPDFBase64(event.currentTarget.files[0])
					break
				default:
					this.setState({
						error: 'Incorrect format document'
					})
			}
		}
	}
	processDocument(crop: Blob) {
		Tesseract.recognize(crop, {
			lang: 'deu'
		}).progress(state => {
			this.setState({
				fetch: true,
				progress: {
					percent: state.progress,
					text: state.status
				}
			})
		})
			.catch(() => this.setState({alert: 'Error'}))
			.then((result: any) => {
				this.setState({
					fetch: false,
					progress: null,
					alert: 'For copy click on button "Copy to clipboard"',
					clipboard: result.text
				})
			})
	}

	closeAlert() {
		this.setState({
			alert: null
		})
	}
	crop(e: any) {
		console.log(e)
		this.cropper.getCroppedCanvas().toBlob((blob: Blob) => {
			this.processDocument(blob)
		})
	}

	renderAlert() {
		let {alert} = this.state

		if (alert) {
			return (
				<LoaderWrapper onClick={() => this.closeAlert()}>
					<Alert>{alert}</Alert>
				</LoaderWrapper>
			)
		}
	}
	renderClipboardButton() {
		if (this.state.clipboard) {
			return (
				<CopyToClipboard
					text={this.state.clipboard}
					onCopy={() => {
						this.closeAlert()
					}}
				>
					<Button>Copy to clipboard</Button>
				</CopyToClipboard>
			)
		}
	}
	renderDocument() {
		if (this.state.document) {
			return (
				<DocumentContainer>
					{this.renderLoader()}
					{this.renderAlert()}
					<ImageCropper
						ref={ref => this.cropper = ref}
						src={this.state.document}
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
						cropend={this.crop}
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
	render() {
		return (
			<Container>
				<HeaderContainer>
					<Label htmlFor="file-uploader-input">
						<Button>
							Choose file
						</Button>
					</Label>
					{this.renderClipboardButton()}
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