import React from 'react'
import filesize from 'filesize'

export default ({
  filename,
  loaded,
  total
}) => {
  return (
    <div className='upload-progress'>
      <div>{filename}</div>
      <div>{loaded < total ? `${filesize(loaded)} / ${filesize(total)}` : 'Upload Complete'}</div>
      <progress value={loaded} max={total}></progress>
    </div>
  )
}
