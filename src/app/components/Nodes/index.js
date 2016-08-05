import React, {PropTypes, Component} from 'react';
import styles from './style.css';
import withStyles from '../../decorators/withStyles';

import NodeStore from '../../stores/NodeStore';

import NodeService from '../../services/NodeService';

import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';

@withStyles(styles)

class Nodes extends Component {
  constructor() {
    super();

    this.state = {
      ...this.toUpdateFromStore
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    NodeStore.addChangeListener(this.changeListener);

    NodeService.list();
  }

  _onChange() {
    this.setState(
      this.toUpdateFromStore
    );
  }

  toUpdateFromStore = {
    nodes: NodeStore.list,
  };

  componentWillUnmount() {
    NodeStore.removeChangeListener(this.changeListener);
  }

  render() {
    return (
      <div className="centered">
        <Grid fluid>
          <Row>
            <Col md={3} lg={3} xs={3} sm={3}>Name</Col>
            <Col md={3} lg={3} xs={3} sm={3}>nomad</Col>
            <Col md={3} lg={3} xs={3} sm={3}>state</Col>
            <Col md={3} lg={3} xs={3} sm={3}>ip</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Nodes;
