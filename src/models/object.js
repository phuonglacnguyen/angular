let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let CmsProperty = require('./property.js');

let CmsObjectSchema = new Schema({
    _id: { type: String },
    properties: []

})

module.exports = mongoose.model('CmsObject', CmsObjectSchema);