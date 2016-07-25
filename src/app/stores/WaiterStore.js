import BaseStore from './BaseStore';

class WaiterStore extends BaseStore {

  constructor() {
    super();
    //this subscribe function didn't connected with another services in this files
    this.subscribe(() => this._registerToActions.bind(this));

    this._isWaiterCreated = false;
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'isWaiterCreated':
        this._isWaiterCreated = true;
        break;
    }
    this.emitChange();
  }

  get isWaiterCreated() {
    return this._isWaiterCreated;
  }
}

export default new WaiterStore();
