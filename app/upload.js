import React from 'react';

import { FileUpload } from './file-upload';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.props.handleUpload(event.target.files[i]);
    }
    event.target.value = '';
  }

  render() {
    const uploads = Object.keys(this.props.uploads).map(key => {
      return (
        <FileUpload
          key={key}
          filename={this.props.uploads[key].filename}
          loaded={this.props.uploads[key].loaded}
          total={this.props.uploads[key].total}
        />
      );
    });
    return (
      <div>
        <input
          type="file"
          name="file"
          onChange={e => this.handleChange(e)}
          multiple
        />
        {uploads}
      </div>
    );
  }
}

export { Upload };
