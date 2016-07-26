import AppDispatcher from '../core/Dispatcher';

export default {
  submit: () => {
    AppDispatcher.dispatch({
      actionType: 'isProductCreated'
    });
  },
}
