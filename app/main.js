const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const Link = require('react-router').Link
const IndexRedirect = require('react-router').IndexRedirect
const hashHistory = require('react-router').hashHistory

const App = React.createClass({
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
        <nav>
          <ul>
            <li><Link to='upload'>Upload</Link></li>
            <li><Link to='list'>List</Link></li>
          </ul>
        </nav>
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

const Upload = React.createClass({
  render() {
    return <div>Upload Component</div>
  }
})

const S3ObjectList = React.createClass({
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

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/upload' />
        <Route path='upload' component={Upload} />
        <Route path='list' component={S3ObjectList} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
)
