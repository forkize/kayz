import BaseStore from './BaseStore';

class NodeStore extends BaseStore {

  constructor() {
    super();
    //this subscribe function didn't connected with another services in this files
    this.subscribe(() => this._registerToActions.bind(this));

    this._list = [];
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'nodeList':
        this._list = action.list;
        break;
    }
    this.emitChange();
  }

  get list() {
    return this._list;
  }
}

export default new NodeStore();
