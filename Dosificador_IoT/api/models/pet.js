'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PetSchema = Schema({
    name_pet: String,
    weight: String,
    age: String,
    born: Date,
    
    hComida1:String,
    hComida2:String,
    hComida3:String,
    hComida4:String,
    hComida5:String,
    hComida6:String,
    hComida7:String,
    hComida8:String,
    
    //hComida: Array,
    raza: String,
    sex: String,
    quantity: String,
    shots: String,
    image_pet: String,
    mac: String,
    aux: String,
    alerta: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Pet',PetSchema);