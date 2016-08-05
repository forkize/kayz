import AppDispatcher from '../core/Dispatcher';

export default {
  list: (list) => {
    AppDispatcher.dispatch({
      actionType: 'nodeList',
      list: list,
    });
  },
}
