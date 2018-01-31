import styled from "styled-components"

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 20px 0;
	position: relative;
`
export const HeaderContainer = styled.div`
	
`
export const Button = styled.a`
	display: inline-block;
	background-color: #77ad1f;
	color: #fff;
	font-family: "PT Sans Narrow", serif;
	padding: 10px;
	margin: 10px;
	cursor: pointer;
`
export const Label = styled.label`
	display: inline-block;
	border: none;
	padding: 0;
	margin: 0 0 15px 0;
	border-radius: 0;
	cursor: pointer;
`
export const FileInput = styled.input`
	display: none;
`

export const DocumentContainer = styled.div`
	position: relative;
	border-radius: 2px;
	border: rgb(226, 226, 226);
	min-height: 500px;
	height: 100%;
`