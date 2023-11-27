const  mongoose = require('mongoose')
const {ObjectId}= require('mongodb')
const  actorSchema = new mongoose.Schema({
    name: String,
    cast: mongoose.Schema.Types.ObjectId,
    birth_date: String,
    years_active: String,
    year_of_death: String,
    nationality: String,
    img: String

});
const Actor = mongoose.model('Actor',actorSchema);
module.exports = Actor