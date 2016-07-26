import React, {PropTypes, Component} from 'react';
import styles from './style.css';
import ReactDOM from 'react-dom';

import TableStore from '../../../stores/TableStore';
import TableService from '../../../services/TableService';

const tableTypes = ['luxurious', 'intermediate', 'economical'];

import {
  Button,
  Modal,
  ButtonToolbar,
  FormControl,
  ControlLabel,
  FormGroup,
} from 'react-bootstrap';

import withStyles from '../../../decorators/withStyles';

@withStyles(styles)

class CreateTable extends Component {
  static propTypes = {
    modalMode: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      isTableCreated: false,
      selectedTable: tableTypes[0]
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    TableStore.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState({
      isTableCreated: TableStore.isTableCreated,
    });
  }

  componentWillUnmount() {
    TableStore.removeChangeListener(this.changeListener);
  }

  handle = {
    select() {
      this.setState({
        selectedTable: ReactDOM.findDOMNode(this.refs.tableType).value
      });
    },

    submit() {
      let selectedTable = this.state.selectedTable;

      TableService.submit({
        type: selectedTable
      });
    }
  };

  render() {
    let isTableCreated = this.state.isTableCreated;
    let tables = tableTypes.map(function (table, index) {
      return <option key={index} eventKey={index} value={table}>{table}</option>
    });

    return (
      <Modal
        bsSize="small"
        dialogClassName="finish-modal"
        animation show={this.props.showModal}
        onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New table</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-flex">
          {!isTableCreated ?
            <form className="content-center">
              <FormGroup>
                <ControlLabel>Select the table</ControlLabel>
                <FormControl
                  onChange={this.handle.select.bind(this)}
                  value={this.state.selectedTable}
                  ref="tableType"
                  type="text"
                  componentClass="select"
                  placeholder="select">{tables}</FormControl>
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
              <h4 className="text-right">You successfully created the table.</h4>
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

export default CreateTable;
