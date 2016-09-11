import React from 'react'

const S3Object = ({
  bucket,
  s3key,
  size,
  contentType
}) => {
  return (
    <div>
      <a href={'https://s3.amazonaws.com/' + bucket + '/' + s3key}>
        {s3key}
      </a>
      <div className='filesize'>Size: {size}</div>
      <div className='filetype'>Type: {contentType}</div>
    </div>
  )
}

export default React.createClass({
  componentDidMount() {
    this.props.updateS3Objects()
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
