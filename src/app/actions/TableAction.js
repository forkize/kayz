import AppDispatcher from '../core/Dispatcher';

export default {
  submit: () => {
    AppDispatcher.dispatch({
      actionType: 'isTableCreated'
    });
  },

  list: (list) => {
    AppDispatcher.dispatch({
      actionType: 'tableList',
      list: list,
    });
  },
}
