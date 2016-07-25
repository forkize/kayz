import { EventEmitter } from 'events';
import AppDispatcher from '../core/Dispatcher';
import {decode, encode} from './libs/security';

export default class BaseStore extends EventEmitter {

  constructor() {
    super();
  }

  is = {
    _browser () {
      return typeof window != 'undefined';
    },

    _localStorageValid (storageName) {
      return typeof(localStorage[storageName]) !== 'undefined' && localStorage[storageName];
    },

    valid (storageName, isEncoded) {
      return this.is._browser() && this.is._localStorageValid(isEncoded ? encode(storageName) : storageName);
    }
  };

  subscribe(actionSubscribe) {
    this._dispatchToken = AppDispatcher.register(actionSubscribe());
  }

  get dispatchToken() {
    return this._dispatchToken;
  }

  emitChange() {
    this.emit('CHANGE');
  }

  addChangeListener(cb) {
    this.on('CHANGE', cb)
  }

  removeChangeListener(cb) {
    this.removeListener('CHANGE', cb);
  }
}
