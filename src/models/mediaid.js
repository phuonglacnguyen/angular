let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });
let Media = require('./media.js');

let MediaIdSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }
})
let mediaId = mongoose.model('mediaId', MediaIdSchema);