import BaseStore from './BaseStore';

class TableStore extends BaseStore {

  constructor() {
    super();
    //this subscribe function didn't connected with another services in this files
    this.subscribe(() => this._registerToActions.bind(this));

    this._isTableCreated = false;
    this._list = [];
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case 'isTableCreated':
        this._isTableCreated = true;
        break;
      case 'tableList':
        this._list = action.list;
        break;
    }
    this.emitChange();
  }

  get isTableCreated() {
    return this._isTableCreated;
  }

  get list() {
    return this._list;
  }
}

export default new TableStore();
