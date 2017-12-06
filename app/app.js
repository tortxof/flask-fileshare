import React from 'react'
import filesize from 'filesize'
import _ from 'lodash'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.handleUpload = this.handleUpload.bind(this)
    this.updateS3Objects = this.updateS3Objects.bind(this)
    this.state = { s3Objects: [], uploads: {} }
  }

  handleUpload(file) {
    fetch('/signed-post').then(response => {
      response.json().then(json => {
        const formData = new FormData()
        const key = json.post.fields.key.split('/')[0] + '/' + file.name
        Object.keys(json.post.fields).forEach(field => {
          formData.set(field, json.post.fields[field])
        })
        formData.set('Content-Type', file.type)
        formData.set('file', file)
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', event => {
          if (event.lengthComputable) {
            this.setState({
              uploads: {
                ...this.state.uploads,
                [key]: {
                  filename: file.name,
                  loaded: event.loaded,
                  total: event.total
                }
              }
            })
          }
        })

        xhr.addEventListener('load', () => {
          this.setState({
            uploads: {
              ...this.state.uploads,
              [key]: {
                filename: file.name,
                loaded: 1,
                total: 1
              }
            }
          })
          window.setTimeout(() => {
            this.setState((prevState, props) => ({
              uploads: _.omit(prevState.uploads, [key])
            }))
          }, 2000)
          this.updateS3Objects()
        })

        xhr.open('POST', json.post.url, true)

        xhr.send(formData)
      })
    })
  }

  updateS3Objects() {
    fetch('/list.json')
      .then(response => response.json())
      .then(json => {
        this.setState({
          s3Objects: json.s3Objects
        })
      })
  }

  componentDidMount() {
    this.updateS3Objects()
  }

  render() {
    return (
      <div className="container">
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            s3Objects: this.state.s3Objects,
            uploads: this.state.uploads,
            updateS3Objects: this.updateS3Objects,
            handleUpload: this.handleUpload
          })
        )}
      </div>
    )
  }
}

export { App }
