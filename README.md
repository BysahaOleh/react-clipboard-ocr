# react-clipboard-ocr
Simple React component for copy text from image (JPG, PNG, PDF etc.)

### Insatall
```sh
npm i --save react-clipboard-ocr
```



### Example

#### In React project
```js
const ReactImageOCR = require('react-clipboard-ocr') //import the library
require('react-clipboard-ocr/style.css') //import the styles for cropper.js

//...
<ReactImageOCR/> //add in exist react component
//...
```

#### In other projects
```js
import * as React from 'react'
import {render} from 'react-dom'
const ReactImageOCR = require('react-clipboard-ocr') //import the library
require('react-clipboard-ocr/style.css') //import the styles for cropper.js

render(<ReactImageOCR/>, document.getElementById('anyID'))
```
