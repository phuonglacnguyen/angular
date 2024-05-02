let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let Address = require('./address.js');
let Media = require('./media.js');
let TreeId = require('./treeid.js');

let UserModelSchema = new Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    gender: { type: String, require: true},
    email: { type: String, require: true, unique: true },
    telephone: { type: String, require: true },
    addresses: ['Address'],
    media : ['Media'],
    password: { type: String, require: true },
    dateCreated: { type: Date, require: true },
    editable: { type: Boolean, require: true },
    userRole: { type: String, require: true },
    active: { type: Boolean, require: true },
    logins: { type: Number, require: false },
    dateLast: { type: Date, requrie: false },
    favorites: ['TreeId'],
    faceCoords: { type: String, requrie: false },
    songs: ['TreeId'],
    musicAlbum: ['TreeId'],
    songs_tmp: ['TreeId'],
    musicAlbum_tmp: ['TreeId'],
    songs_original: ['TreeId'],
})

module.exports = mongoose.model('User', UserModelSchema);