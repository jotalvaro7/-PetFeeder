'use strict'

var jwt = require('jwt-simple');
var moment = require ('moment');
var secret = 'harrypotter'; //una clave secreta que solo lo sabe el backend como desarrolladores del proyecto

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name:user.name,
        surname: user.surname,
        email:user.email,
        image:user.image,
        //fecha cuando se genera el token
        iat:moment().unix(),
        exp: moment().add(30,'days').unix //expiracion del token
    }

    return jwt.encode(payload, secret);
}