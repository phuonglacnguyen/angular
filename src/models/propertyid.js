let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let PropertyIdSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'CmsProperty' }
})
let PropertyId = mongoose.model('PropertyId', PropertyIdSchema);