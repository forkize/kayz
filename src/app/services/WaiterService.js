import request from 'superagent';
import WaiterAction from '../actions/WaiterAction';

class WaiterService {
  submit(waiter) {
    return request
      .post('/api/waiters')
      .send(waiter)
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return WaiterAction.submit();
      });
  }

  list() {
    return request
      .get('/api/waiters')
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return WaiterAction.list(res.body);
      });
  }
}

export default new WaiterService();
