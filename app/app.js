import React from 'react'
import Nav from './nav'

export default React.createClass({
  updateS3Objects() {
    fetch('/list')
    .then(response => response.json())
    .then(json => {
      this.setState({
        s3Objects: json.s3Objects
      })
    })
  },
  getInitialState() {
    return {s3Objects: []}
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
              updateS3Objects: this.updateS3Objects
            }
          )}
        </div>
      </div>
    )
  }
})
