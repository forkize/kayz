import React, {PropTypes, Component} from 'react';
import styles from './Manager.css';
import withStyles from '../../decorators/withStyles';

import CreateWaiter from '../Modals/CreateWaiter';
import CreateTable from '../Modals/CreateTable';
import CreateProduct from '../Modals/CreateProduct';

import TableStore from '../../stores/TableStore';
import WaiterStore from '../../stores/WaiterStore';

import WaiterService from '../../services/WaiterService';
import TableService from '../../services/TableService';

import {
  Button,
  ButtonToolbar,
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl
} from 'react-bootstrap';

@withStyles(styles)

class Manager extends Component {
  constructor() {
    super();

    this.state = {
      isWaiterModalOpened: false,
      isTableModalOpened: false,
      isProductModalOpened: false,
      tables: TableStore.list,
      waiters: WaiterStore.list,
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    TableStore.addChangeListener(this.changeListener);
    WaiterStore.addChangeListener(this.changeListener);

    WaiterService.list();
    TableService.list();
  }

  _onChange() {
    this.setState({
      tables: TableStore.list,
      waiters: WaiterStore.list,
    });
  }

  componentWillUnmount() {
    TableStore.removeChangeListener(this.changeListener);
    WaiterStore.removeChangeListener(this.changeListener);
  }

  handler = {

    waiter: {
      modalOpen() {
        this.setState({isWaiterModalOpened: true});
      },

      modalClose() {
        this.setState({isWaiterModalOpened: false});
      }
    },

    table: {
      modalOpen() {
        this.setState({isTableModalOpened: true});
      },

      modalClose() {
        this.setState({isTableModalOpened: false});
      }
    },

    product: {
      modalOpen() {
        this.setState({isProductModalOpened: true});
      },

      modalClose() {
        this.setState({isProductModalOpened: false});
      }
    }

  };

  render() {
    let waiters = [
      <option key={0} value="select">Select</option>,
      ...this.state.waiters.map(function (waiter, index) {
        let waiterName = waiter.firstName + ' ' + waiter.lastName;

        return <option key={index+1} eventKey={index+1} value={waiter._id}>{waiterName}</option>
      })
    ];

    let tables = this.state.tables.map(function (table, index) {
      return (
        <Row key={index}>
          <Col md={1} lg={1} xs={1} sm={1}>{index + 1}</Col>
          <Col md={5} lg={5} xs={5} sm={5}>{table.type}</Col>
          <Col md={6} lg={6} xs={6} sm={6}>
            <FormGroup>
              <FormControl
                ref={'waitersOfTable' + index}
                value={table.waiter}
                type="text"
                componentClass="select"
                placeholder="select">{waiters}</FormControl>
            </FormGroup>
          </Col>
        </Row>
      )
    });

    return (
      <div>
        {this.state.isWaiterModalOpened ?
          <CreateWaiter
            showModal={this.state.isWaiterModalOpened}
            onClose={this.handler.waiter.modalClose.bind(this)}/> : ''}
        {this.state.isTableModalOpened ?
          <CreateTable
            showModal={this.state.isTableModalOpened}
            onClose={this.handler.table.modalClose.bind(this)}/> : ''}
        {this.state.isProductModalOpened ?
          <CreateProduct
            showModal={this.state.isProductModalOpened}
            onClose={this.handler.product.modalClose.bind(this)}/> : ''}
        <div className="centered">
          <ButtonToolbar className="create-toolbar">
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.handler.waiter.modalOpen.bind(this)}
            >Create Waiter</Button>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.handler.table.modalOpen.bind(this)}
            >Create Table</Button>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.handler.product.modalOpen.bind(this)}
            >Create Product</Button>
          </ButtonToolbar>
          <br/>
          <Grid className="table-list">
            {tables}
          </Grid>
        </div>
      </div>
    );
  }
}

export default Manager;
