let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let Video = require('./video.js');
let Audio = require('./audio.js');
//let Files = require('./bots/Files.js'); 

let MediaSchema = new mongoose.Schema({
    //_id: { type: String },
    encoding: { type: String },
    mimetype: { type: String },
    imgfilepath: { type: String },
    filepath: { type: String },
    filename: { type: String },
    filesize: { type: Number },
    title: { type: String },
    artist: { type: String },
    album: { type: String },
    track: { type: Number },
    date: { type: String },
    duration: { type: Number },
    extension: { type: String },
    tags: { type: String },
    dateCreated: { type: String },
    lastModified: { type: String },
    createdBy: { type: String },
    filetype: { type: String },
    video: ['Video'],
    audio: ['Audio'],
    schemaextend: []
})

module.exports = mongoose.model('Media', MediaSchema);