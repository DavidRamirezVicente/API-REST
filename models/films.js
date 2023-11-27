const  mongoose = require('mongoose')
const {ObjectId}= require('mongodb')
const  filmSchema = new mongoose.Schema({
    name:String,
    protagonist:mongoose.Schema.Types.ObjectId,
    adaptation: String,
    date:String,
    country:String,
    director:String,
    img:String
});
const Film = mongoose.model('Film',filmSchema);
module.exports = Film
