import mongoose from 'mongoose';
let Schema = mongoose.Schema;

var jobSchema = new Schema({
    name: String,
    node_name: String,
    isActive: Boolean,
});

mongoose.model('Job', jobSchema);