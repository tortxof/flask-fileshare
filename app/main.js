import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './app'
import { Upload } from './upload'
import { S3ObjectList } from './s3-object-list'

ReactDOM.render(
  <App>
    <Upload />
    <S3ObjectList />
  </App>,
  document.getElementById('app')
)
