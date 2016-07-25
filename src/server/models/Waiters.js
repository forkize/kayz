import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let SchemaType = Schema.Types;

var waiterSchema = new Schema({
  firstName: SchemaType.String,
  lastName: SchemaType.String,
}, {
  timestamps: true
});

mongoose.model('Waiter', waiterSchema);
