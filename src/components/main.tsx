import { Button as BI } from '../../'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 20px 0;
	position: relative;
`
export const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
`
export const Button = styled.a`
	display: inline-block;
	background-color: #77ad1f;
	color: #fff;
	font-family: "PT Sans Narrow", serif;
	padding: 10px;
	margin: 10px;
	cursor: pointer;
	user-select: none; 
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

export const NavigationBlock = styled.div`
	display: flex;
	margin: 0 0 15px 0;
`

export const NavigationButton = Button.extend`
	font-size: 20px;
	background-color: ${(props: BI.NavigationButton) => props.disabled ? '#4c4c4c' : '#77ad1f'};
	color: ${(props: BI.NavigationButton) => props.disabled ? '#e8e8e8' : '#fff'};
	padding: 5px 2px;
	margin: 10px 5px;
	width: 25px;
	font-family: serif;
	text-align: center;
`

export const PageCounter = styled.p`
	font-size: 18px;
	padding: 6px;
`