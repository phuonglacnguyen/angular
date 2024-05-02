let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let mediaId = require("./mediaid.js");
let PropertyId = require("./propertyid.js");

let PageModelSchema = new Schema({
  //_id: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Page" }, //mongoose.Schema.Types.ObjectId, ref: 'Page'}, //
  title: { type: String },
  objectType: { type: String },
  visible: { type: Boolean },
  secure: { type: Boolean },
  dateCreated: { type: String },
  dateLast: { type: String },
  createdBy: { type: String },
  editable: { type: Boolean }, // , require: true
  media: [],
  treelevel: { type: Number },
  kids: { type: Number },
  listItem: { type: Boolean },
  properties: ["PropertyId"],
  schemaextend: { type: Object },
  pickorder: { type: Number },
  filter: [],
  hits: { type: Number },
});

module.exports = mongoose.model("Page", PageModelSchema);
