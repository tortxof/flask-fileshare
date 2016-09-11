import React from 'react'
import Clipboard from 'clipboard'
import filesize from 'filesize'

const S3Object = ({
  bucket,
  s3key,
  size,
  contentType
}) => {
  return (
    <div>
      <a href={`https://s3.amazonaws.com/${bucket}/${s3key}`}>
        {s3key}
      </a>
      <button
        className='clip-button'
        data-clipboard-text={`https://s3.amazonaws.com/${bucket}/${s3key}`}
      >
        Copy Link
      </button>
      <div className='filesize'>Size: {filesize(size)}</div>
      <div className='filetype'>Type: {contentType}</div>
    </div>
  )
}

export default React.createClass({
  componentDidMount() {
    this.props.updateS3Objects()
    const clipboard = new Clipboard('.clip-button')
    this.setState({clipboard: clipboard})
  },
  componentWillUnmount() {
    this.state.clipboard.destroy()
  },
  getInitialState() {
    return {clipboard: null}
  },
  render() {
    const s3ObjectListItems = this.props.s3Objects.map(obj => {
      return (
        <li>
          <S3Object
            bucket={obj.bucket}
            s3key={obj.s3key}
            size={obj.size}
            contentType={obj.content_type}
          />
        </li>
      )
    })
    return (
      <ul>
        {s3ObjectListItems}
      </ul>
    )
  }
})
