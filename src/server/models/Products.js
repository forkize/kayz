import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let SchemaType = Schema.Types;

var productSchema = new Schema({
  title: SchemaType.String,
  description: SchemaType.String,
  amount: SchemaType.String,
  price: SchemaType.String,
}, {
  timestamps: true
});

mongoose.model('Product', productSchema);
