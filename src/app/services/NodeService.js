import request from 'superagent';
import NodeAction from '../actions/NodeAction';

class TableService {
  list() {
    return request
      .get('/api/nodes')
      .query({})
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return NodeAction.list(res.body);
      });
  }
}

export default new TableService();
