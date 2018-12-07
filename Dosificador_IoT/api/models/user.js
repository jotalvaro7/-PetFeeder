'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //Definir nuevos esquemas con el objeto Schema

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    active: {type: Boolean, require:true, default: false},
    temporarytoken:{type: String, require: true}
});

module.exports = mongoose.model('User',UserSchema);