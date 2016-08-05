import AppDispatcher from '../core/Dispatcher';

export default {
  submit: () => {
    AppDispatcher.dispatch({
      actionType: 'isWaiterCreated'
    });
  },

  list: (list) => {
    AppDispatcher.dispatch({
      actionType: 'waiterList',
      list: list,
    });
  },
}
