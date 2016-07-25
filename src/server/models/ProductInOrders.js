import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let SchemaType = Schema.Types;

var ProductInOrderSchema = new Schema({
  order: {
    type: SchemaType.ObjectId,
    ref: 'Order'
  },
  product: {
    type: SchemaType.ObjectId,
    ref: 'Product'
  },
  amount: SchemaType.Number
}, {
  timestamps: true
});

mongoose.model('ProductInOrder', ProductInOrderSchema);
