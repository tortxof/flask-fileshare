import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Link, IndexRedirect, hashHistory} from 'react-router'

import App from './app'
import Upload from './upload'
import S3ObjectList from './s3-object-list'

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/upload' />
        <Route path='upload' component={Upload} />
        <Route path='list' component={S3ObjectList} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
)
