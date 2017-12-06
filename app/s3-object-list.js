import React from 'react'
import Clipboard from 'clipboard'
import filesize from 'filesize'

const S3Object = ({ bucket, s3key, size, contentType }) => (
  <div>
    <a href={`https://s3.amazonaws.com/${bucket}/${s3key}`}>{s3key}</a>
    <button
      className="clip-button"
      data-clipboard-text={`https://s3.amazonaws.com/${bucket}/${s3key}`}>
      Copy Link
    </button>
    <div className="filesize">Size: {filesize(size)}</div>
    <div className="filetype">Type: {contentType}</div>
  </div>
)

class S3ObjectList extends React.Component {
  constructor(props) {
    super(props)
    this.showMore = this.showMore.bind(this)
    this.state = { clipboard: null, listDisplayCount: 4 }
  }

  componentDidMount() {
    this.props.updateS3Objects()
    const clipboard = new Clipboard('.clip-button')
    this.setState({ clipboard: clipboard })
  }

  componentWillUnmount() {
    this.state.clipboard.destroy()
  }

  showMore() {
    this.setState({ listDisplayCount: this.state.listDisplayCount + 4 })
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.s3Objects
            .slice(0, this.state.listDisplayCount)
            .map(obj => (
              <li>
                <S3Object
                  bucket={obj.bucket}
                  s3key={obj.s3key}
                  size={obj.size}
                  contentType={obj.content_type}
                />
              </li>
            ))}
        </ul>
        {this.props.s3Objects.length > this.state.listDisplayCount ? (
          <button onClick={this.showMore}>Show More</button>
        ) : null}
      </div>
    )
  }
}

export { S3ObjectList }
