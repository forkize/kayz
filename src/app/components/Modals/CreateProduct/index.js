import React, {PropTypes, Component} from 'react';
import styles from './style.css';
import ReactDOM from 'react-dom';

import ProductStore from '../../../stores/ProductStore';
import ProductService from '../../../services/ProductService';

const amountMax = 5;

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

class CreateProduct extends Component {
  static propTypes = {
    modalMode: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      isProductCreated: false,
      title: '',
      description: '',
      amount: 1,
      price: '',
    }
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    ProductStore.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState({
      isProductCreated: ProductStore.isProductCreated,
    });
  }

  componentWillUnmount() {
    ProductStore.removeChangeListener(this.changeListener);
  }

  handle = {

    title() {
      this.setState({
        title: ReactDOM.findDOMNode(this.refs.title).value
      });
    },
    description() {
      this.setState({
        description: ReactDOM.findDOMNode(this.refs.description).value
      });
    },
    price() {
      this.setState({
        price: ReactDOM.findDOMNode(this.refs.price).value
      });
    },
    amount() {
      this.setState({
        amount: ReactDOM.findDOMNode(this.refs.amount).value
      });
    },

    submit() {
      let title = this.state.title;
      let description = this.state.description;
      let price = this.state.price;
      let amount = this.state.amount;

      let product = {
        title,
        description,
        price,
        amount,
      };

      ProductService.submit(product);
    }
  };

  render() {
    let isProductCreated = this.state.isProductCreated;

    let amounts = [];
    for (let i = 0; i < amountMax; i++) {
      amounts.push(<option key={i} eventKey={i} value={i + 1}>{i + 1}</option>);
    }

    return (
      <Modal
        dialogClassName="finish-modal"
        animation show={this.props.showModal}
        onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New product</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-flex">
          {!isProductCreated ?
            <form>
              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>
                    <i className="fa fa-info fa-fw"></i>
                  </InputGroup.Addon>
                  <FormControl
                    onChange={this.handle.title.bind(this)}
                    value={this.state.title}
                    ref="title"
                    type="text"/>
                </InputGroup>
              </FormGroup>
              <FormGroup controlId="formControlsTextarea">
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  onChange={this.handle.description.bind(this)}
                  value={this.state.description}
                  ref="description"
                  type="text"
                  componentClass="textarea"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Price</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>$</InputGroup.Addon>
                  <FormControl
                    onChange={this.handle.price.bind(this)}
                    value={this.state.price}
                    ref="price"
                    type="text"/>
                  <InputGroup.Addon>.00</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Amount</ControlLabel>
                <FormControl
                  onChange={this.handle.amount.bind(this)}
                  value={this.state.amount}
                  ref="amount"
                  componentClass="select"
                  placeholder="select">{amounts}</FormControl>
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
              <h4 className="text-right">You successfully created the product.</h4>
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

export default CreateProduct;
