let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let CmsPipeSchema = new mongoose.Schema({
    _id: { type: String } ,
    //type: { type: String },
    values: { type: String }
})

module.exports = mongoose.model('CmsPipe', CmsPipeSchema);