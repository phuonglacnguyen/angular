let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let CmsPropertySchema = new mongoose.Schema({
    //_id: { type: String } ,
    title: { type: String },
    pname: { type: String },
    access: { type: String },
    type: { type: String },
    inputtype: { type: String },
    minlength: { type: Number },
    maxlength: { type: Number },
    required: { type: Boolean },
    object: { type: String },
    list: { type: String },
    values: { type: String },
    labels: { type: String },
    labelsarr: [] ,
    valuesarr: [] 
})

module.exports = mongoose.model('CmsProperty', CmsPropertySchema);