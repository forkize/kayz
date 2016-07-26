import request from 'superagent';
import ProductAction from '../actions/ProductAction';

class ProductService {
  submit(product) {
    return request
      .post('/api/products')
      .send(product)
      .end(function (err, res) {
        if (err) {
          return console.log('Error: ' + err);
        }

        return ProductAction.submit();
      });
  }
}

export default new ProductService();
