'use strict' // Permite utilizar nuevas caracteristias de javascript, como funciones de flecha entre otras cosas
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;


//CONEXION A LA BASE DE DATOS
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Petsdb',{useMongoClient: true}) //Indica el puerto, y la base de datos a la que se quiere conectar
    .then(() => {
        console.log("La conexion a la base de datos proyectoGrado_Iot se ha realizado correctamente!!")

        //CREAR SERVIDOR() 
        app.listen(port, '0.0.0.0', function(){
            console.log(`Servidor corriendo en ${port}`);
        });
    }).catch(err => console.log(err));
//*****************************************
//


