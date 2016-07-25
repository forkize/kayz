import React, { PropTypes, Component } from 'react';

import styles from './App.css';
import Bootstrap from '../../../../bower_components/bootstrap/dist/css/bootstrap.css';
import FontAwesome from '../../../../bower_components/components-font-awesome/css/font-awesome.css';

import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';

@withContext
@withStyles(styles)
@withStyles(Bootstrap)
@withStyles(FontAwesome)

class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error ? (
      <div>
        {this.props.children}
      </div>
    ) : this.props.children;
  }

}

export default App;


