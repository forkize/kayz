import request from 'reqwest';
import WaiterAction from '../actions/WaiterAction';

class WaiterService {

  submit(waiter) {
    return request({
      url: '/api/waiters/',
      method: 'POST',
      type: 'json',
      data: waiter,
      error: function (err) {
        console.log(err);
      },
      success: function () {
        WaiterAction.waiterSubmit();
      }
    })
  }

}

export default new WaiterService();
