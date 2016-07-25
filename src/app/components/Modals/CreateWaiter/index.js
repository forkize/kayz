import React, {PropTypes, Component} from 'react';
import styles from './CreateWaiter.css';

import WaiterStore from '../../../stores/WaiterStore';
import WaiterService from '../../../services/WaiterService';

import {
  Button,
  ButtonToolbar,
  FormControl,
  FormGroup,
  ControlLabel,
  InputGroup,
  Modal,
} from 'react-bootstrap';

import withStyles from '../../../decorators/withStyles';

@withStyles(styles)

class Feedback extends Component {
  static propTypes = {
    modalMode: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      isWaiterCreated: WaiterStore.isWaiterCreated,
      firstName: '',
      lastName: ''
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    WaiterStore.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState({
      isWaiterCreated: WaiterStore.isWaiterCreated,
    });
  }

  componentWillUnmount() {
    WaiterStore.removeChangeListener(this.changeListener);
  }

  handle = {
    change: {
      firstName (e) {
        this.setState({
          firstName: e.target.value,
        });
      },
      lastName (e) {
        this.setState({
          lastName: e.target.value,
        });
      }
    },

    submit() {
      let firstName = this.state.firstName;
      let lastName = this.state.lastName;

      let waiter = {
        firstName,
        lastName,
      };

      this.setState({
        isWaiterCreated: true,
      });

      WaiterService.submit(waiter);
    }
  };

  render() {
    let isWaiterCreated = this.state.isWaiterCreated;

    return (
      <Modal
        dialogClassName="finish-modal"
        animation show={this.props.showModal}
        onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new <b>waiter</b></Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-flex">
          {!isWaiterCreated ?
            <form>
              <FormGroup>
                <ControlLabel>First name</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fa fa-user fa-fw"></i>
                  </InputGroup.Addon>
                  <FormControl
                    onChange={this.handle.change.firstName.bind(this)}
                    value={this.state.name}
                    ref="firstName"
                    type="text"
                    hasFeedback/>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Last name</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fa fa-envelope-o fa-fw"></i>
                  </InputGroup.Addon>
                  <FormControl
                    onChange={this.handle.change.lastName.bind(this)}
                    value={this.state.email}
                    ref="lastName"
                    type="text"
                    hasFeedback/>
                </InputGroup>
              </FormGroup>
              <ButtonToolbar className="pull-right">
                <Button onClick={this.props.onClose.bind(this)}>
                  <span>Cancel</span>
                </Button>
                <Button onClick={this.handle.submit.bind(this)} bsStyle='success'>
                  <i className="fa fa-check"></i> <span>Create</span>
                </Button>
              </ButtonToolbar>
            </form> :
            <div className="pull-right full-length">
              <h4 className="text-right">You successfully created the waiter.</h4>
              <Button onClick={this.props.onClose.bind(this)} bsStyle='success' className="pull-right">
                <i className="fa fa-check"></i> <span>Ok</span>
              </Button>
            </div>
          }
        </Modal.Body>
      </Modal>
    );
  }

}

export default Feedback;
