import styled from "styled-components"

export const LoaderWrapper = styled.div`
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(50,50,50,0.81);
	z-index: 200;
`
export const LoaderContainer = styled.div`
	min-width: 200px;
`
export const LoaderText = styled.p`
margin-top: 10px;
	display: block;
	font-size: 16px;
	color: #ffffff;
	text-align: center;
	font-family: "PT Sans Narrow", serif;
`
export const Alert = styled.p`
	font-size: 18px;
	text-align: center;
	font-family: "PT Sans Narrow", serif;
	padding: 20px;
	color: white;
`