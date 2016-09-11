import React from 'react'
import {Link} from 'react-router'

export default React.createClass({
  render() {
    return (
      <nav>
        <ul>
          <li><Link to='upload'>Upload</Link></li>
          <li><Link to='list'>List</Link></li>
        </ul>
      </nav>
    )
  }
})
