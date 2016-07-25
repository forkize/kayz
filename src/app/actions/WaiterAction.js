import AppDispatcher from '../core/Dispatcher';

export default {
  waiterSubmit: () => {
    AppDispatcher.dispatch({
      actionType: 'isWaiterCreated'
    });
  },
}
