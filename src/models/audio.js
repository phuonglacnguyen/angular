let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//mongoose.connect('mongodb://localhost/usersSchema', { useMongoClient: true });

let AudioSchema = new mongoose.Schema({
    codec: string = "",
    bitrate: string = "",
    sample_rate: string = "",
    stream: string = "",
    channels: string = ""
})

module.exports = mongoose.model('Audio', AudioSchema);
