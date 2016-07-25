import React, {PropTypes, Component} from 'react';
import styles from './Manager.css';
import withStyles from '../../decorators/withStyles';
import CreateWaiter from '../Modals/CreateWaiter';
import {
  Button,
  ButtonToolbar,
} from 'react-bootstrap';

@withStyles(styles)

class LoginPage extends Component {
  constructor() {
    super();

    this.state = {
      isModalOpened: false,
    }
  }

  handler = {

    modalOpen() {
      this.setState({isModalOpened: true});
    },

    modalClose() {
      this.setState({isModalOpened: false});
    }

  };

  render() {
    return (
      <div>
        {this.state.isModalOpened ?
          <CreateWaiter
            showModal={this.state.isModalOpened}
            onClose={this.handler.modalClose.bind(this)}/> : ''}
        <div className="centered">
          <ButtonToolbar>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.handler.modalOpen.bind(this)}
            >Create Waiters</Button>
            <Button bsStyle="primary" bsSize="large">Create Tables</Button>
            <Button bsStyle="primary" bsSize="large">Create Products</Button>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}

export default LoginPage;
