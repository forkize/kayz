import BaseStore from './BaseStore';

class ProductStore extends BaseStore {

  constructor() {
    super();
    //this subscribe function didn't connected with another services in this files
    this.subscribe(() => this._registerToActions.bind(this));

    this._isProductCreated = false;
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'isProductCreated':
        this._isProductCreated = true;
        break;
    }
    this.emitChange();
  }

  get isProductCreated() {
    return this._isProductCreated;
  }
}

export default new ProductStore();
