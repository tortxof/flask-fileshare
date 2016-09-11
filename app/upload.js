import React from 'react'

import FileUpload from './file-upload'

export default React.createClass({
  handleChange(event) {
    this.props.handleUpload(event.target.files[0])
    event.target.value = ''
  },
  render() {
    const uploads = Object.keys(this.props.uploads).map(key => {
      return (
        <FileUpload
          filename={this.props.uploads[key].filename}
          loaded={this.props.uploads[key].loaded}
          total={this.props.uploads[key].total}
        />
      )
    })
    return (
      <div>
        <input type='file' name='file' onChange={this.handleChange} />
        {uploads}
      </div>
    )
  }
})
