const React = require('react')
const ReactDOM = require('react-dom')
const Router = require('react-router').Router
const Route = require('react-router').Route
const Link = require('react-router').Link
const IndexRedirect = require('react-router').IndexRedirect
const hashHistory = require('react-router').hashHistory

const App = React.createClass({
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
          {this.props.children}
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

const List = React.createClass({
  render() {
    return <div>List Component</div>
  }
})

ReactDOM.render(
  (
    <Router history={hashHistory}>
      <Route path='/' component={App}>
        <IndexRedirect to='/upload' />
        <Route path='upload' component={Upload} />
        <Route path='list' component={List} />
      </Route>
    </Router>
  ),
  document.getElementById('app')
)
