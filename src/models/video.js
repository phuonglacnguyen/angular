let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });


let VideoSchema = new mongoose.Schema({
	bitrate: number = 0,
    aspect: string = "",
	width: number = 0,
	height: number = 0,
	container: string = "",
	codec: string = "",
	fps: number = 0
})

module.exports = mongoose.model('Video', VideoSchema);