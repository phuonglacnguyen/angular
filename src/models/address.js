let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let AddressModelSchema = new Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
})

module.exports = mongoose.model('Address', AddressModelSchema);