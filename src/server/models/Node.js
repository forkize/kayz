import mongoose from 'mongoose';
let Schema = mongoose.Schema;

var nodeSchema = new Schema({
    name: String,
    nomad: {
        installed: Boolean,
        server: Boolean,
        client: Boolean,
        region: String
    },
    consul: {
        installed: Boolean,
        server: Boolean,
        client: Boolean
    },
    ip: String,
    state: Boolean,
    cpu: String,
    ram: String
});

mongoose.model('Node', nodeSchema);