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
    return {clipboard: null, listDisplayCount: 4}
  },
  showMore() {
    this.setState({listDisplayCount: this.state.listDisplayCount + 4})
  },
  render() {
    const s3ObjectListItems = this.props.s3Objects
    .slice(0, this.state.listDisplayCount)
    .map(obj => {
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
      <div>
        <ul>
          {s3ObjectListItems}
        </ul>
        {this.props.s3Objects.length > this.state.listDisplayCount ? (<button onClick={this.showMore}>Show More</button>) : null}
      </div>
    )
  }
})
