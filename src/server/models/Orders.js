import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let SchemaType = Schema.Types;

var orderSchema = new Schema({
  table: {
    type: SchemaType.ObjectId,
    ref: 'Table'
  }
}, {
  timestamps: true
});

mongoose.model('Order', orderSchema);
