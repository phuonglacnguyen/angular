let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let TreeIdSchema = new mongoose.Schema({
    _id: { type: String },
    time: { type: Number },
    title: { type: String }
})

module.exports = mongoose.model('TreeId', TreeIdSchema);