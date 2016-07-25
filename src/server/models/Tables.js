import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let SchemaType = Schema.Types;

var tableSchema = new Schema({
  type: SchemaType.String,
  waiter: {
    type: SchemaType.ObjectId,
    ref: 'Waiter'
  }
}, {
  timestamps: true
});

mongoose.model('Table', tableSchema);
