import BaseStore from './BaseStore';

class WaiterStore extends BaseStore {

  constructor() {
    super();
    //this subscribe function didn't connected with another services in this files
    this.subscribe(() => this._registerToActions.bind(this));

    this._isWaiterCreated = false;
    this._list = [];
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'isWaiterCreated':
        this._isWaiterCreated = true;
        break;
      case 'waiterList':
        this._list = action.list;
        break;
    }
    this.emitChange();
  }

  get isWaiterCreated() {
    return this._isWaiterCreated;
  }

  get list() {
    return this._list;
  }
}

export default new WaiterStore();
