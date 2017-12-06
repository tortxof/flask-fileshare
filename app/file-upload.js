import React from 'react'
import filesize from 'filesize'

const FileUpload = ({ filename, loaded, total }) => (
  <div className="upload-progress">
    <div>{filename}</div>
    <div>
      {loaded < total
        ? `${filesize(loaded)} / ${filesize(total)}`
        : 'Upload Complete'}
    </div>
    <progress value={loaded} max={total} />
  </div>
)

export { FileUpload }
