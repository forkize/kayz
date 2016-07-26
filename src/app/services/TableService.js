import request from 'superagent';
import TableAction from '../actions/TableAction';

class TableService {
  submit(table) {
    return request
      .post('/api/tables')
      .send(table)
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return TableAction.submit();
      });
  }

  list() {
    return request
      .get('/api/tables')
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return TableAction.list(res.body);
      });
  }
}

export default new TableService();
