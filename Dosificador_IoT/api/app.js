'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//CARGAR RUTAS
var user_routers = require('./routes/user');
var pet_routers = require('./routes/pet');

//MIDDLEWARES: UN METODO QUE SE EJECUTA ANTES DE QUE LLEGUE A UN CONTROLADOR, EN CADA PETICION SE EJECUTA ESTE MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); //EN CADA UNA DE LA PETICIONES AL BACKEND



//CORS - Archivo en bloc de notas para futuros usos
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//RUTAS DE LOS CONTROLADORES
app.use('/api',user_routers);
app.use('/api',pet_routers);


//EXPORTAR
module.exports = app;