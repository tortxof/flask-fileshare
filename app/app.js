import React from 'react'
import Nav from './nav'
import filesize from 'filesize'

export default React.createClass({
  handleUpload(file) {
    fetch('/signed-post')
    .then(response => {
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
            this.setState(previousState => {
              previousState.uploads[key] = {filename: file.name, loaded: event.loaded, total: event.total}
              return previousState
            })
          }
        })

        xhr.addEventListener('loadend', () => {
          this.setState(previousState => {
            previousState.uploads[key] = {
              filename: (<a href={`${json.post.url}${key}`} target='_blank'>{file.name}</a>),
              loaded: 1,
              total: 1
            }
          })
          this.updateS3Objects()
        })

        xhr.open('POST', json.post.url, true)

        xhr.send(formData)

      })
    })
  },
  updateS3Objects() {
    fetch('/list.json')
    .then(response => response.json())
    .then(json => {
      this.setState({
        s3Objects: json.s3Objects
      })
    })
  },
  getInitialState() {
    return {s3Objects: [], uploads: {}}
  },
  componentDidMount() {
    this.updateS3Objects()
  },
  render() {
    return (
      <div>
        <Nav />
        <div className='container'>
          {React.cloneElement(
            this.props.children,
            {
              s3Objects: this.state.s3Objects,
              uploads: this.state.uploads,
              updateS3Objects: this.updateS3Objects,
              handleUpload: this.handleUpload
            }
          )}
        </div>
      </div>
    )
  }
})
