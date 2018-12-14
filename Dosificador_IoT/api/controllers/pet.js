'user strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination')

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//PRUEBA SOCKET.IO
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set("origins", "*:*");
server.listen(8000);
/******************************************* */

//MODELOS
var Pet = require('../models/pet');
var User = require('../models/user');
//********************************* */


//REGISTRAR UNA MASCOSTA
function savePet(req, res) {
    var params = req.body;
    var pet = new Pet();

    pet.name_pet = params.name_pet;
    pet.weight = params.weight;
    pet.born = params.born;
   // pet.hcomida= new Array(8)
    
    
    pet.hComida1 = '';
    pet.hComida2 = '';
    pet.hComida3 = '';
    pet.hComida4 = '';
    pet.hComida5 = '';
    pet.hComida6 = '';
    pet.hComida7 = '';
    pet.hComida8 = '';
    

    pet.raza = params.raza;
    pet.sex = params.sex;
    pet.quantity = '';
    pet.shots = '';
    pet.image_pet = null;
    pet.mac = null;
    pet.aux = '';
    pet.alerta= '';
    pet.created_at = moment().unix(); //timestamp cuando se crea el archivo en la coleccion
    pet.user = req.user.sub;

    //Guardar la pet en database
    pet.save((err, petStored) => {
        if (err) return res.status(500).send({
            message: 'Error al guardar la mascota'
        })
        if (!petStored) return res.status(500).send({
            message: 'La mascota no ha sido guardada'
        })
        //Guarda la pet en la base de datos
        return res.status(200).send({ pet: petStored });
    })
}

//ACTUALIZAR LOS DATOS DE UNA MASCOTA CON PERMISOS DE USUARIO
function updatePet(req, res) {
    var petId = req.params.id;
    var update = req.body;

    Pet.findOne({ 'user': req.user.sub, '_id': petId }).exec((err, check) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (check) {
            Pet.findByIdAndUpdate(petId, update, { new: true }, (err, petUpdate) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!petUpdate) return res.status(500).send({ message: 'No se han podido actualizar los datos de la mascota' });

                return res.status(200).send({ pet: petUpdate });
            })
        } else {
            return res.status(500).send({ message: 'No tienes permisos para actualizar los datos' });
        }
    })
}

function macPet(req, res) {
    var petId = req.params.id;
    var update = req.body;


    Pet.findOne({ 'user': req.user.sub, '_id': petId }).exec((err, check) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (check) {
            Pet.findByIdAndUpdate(petId, update, { new: true }, (err, petUpdate) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!petUpdate) return res.status(500).send({ message: 'No se han podido actualizar los datos de la mascota' });

                return res.status(200).send({ pet: petUpdate });
            })
        } else {
            return res.status(500).send({ message: 'No tienes permisos para actualizar los datos' });
        }
    })
}

function dosificarPet(req, res) {
    var petId = req.params.id;
    var update = req.body;
    var mac=update.mac;
    
    Pet.findOne({ 'user': req.user.sub, '_id': petId }).exec((err, check) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (check) {
            Pet.findByIdAndUpdate(petId, update, { new: true }, (err, petUpdate) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!petUpdate) return res.status(500).send({ message: 'No se han podido actualizar los datos de la mascota' });
               
                //MQTT broker.hivemq.com
                var mqtt = require('mqtt')
                var client = mqtt.connect('mqtt://35.207.54.102')
                var topics = [mac+'/QUANTITY', mac+'/SHOTS', mac+'/HOURS1',mac+'/HOURS2',mac+'/HOURS3',mac+'/HOURS4',mac+'/HOURS5',mac+'/HOURS6',mac+'/HOURS7',mac+'/HOURS8'];
                var message = [update.quantity, update.shots, update.hComida1, update.hComida2, update.hComida3, update.hComida4, update.hComida5, update.hComida6, update.hComida7, update.hComida8];
                client.on('connect', function () { 
                            for(var i in message){
                                client.publish(topics[i], message[i], {retain: true})
                            }
                        
                });
                client.on('message', function (topic, message) {
                    // message is Buffer
                    console.log(message.toString())
                    client.end()
                })

                return res.status(200).send({ pet: petUpdate });
            })
        } else {
            return res.status(500).send({ message: 'No tienes permisos para actualizar los datos' });
        }
    })
}

//DEVOLVER EL LISTADO DE LAS MASCOTAS QUE TIENE UN USUARIO - CONEXION CON MQTT PARA RECIBIR LOS MENSAJES
//DE RECONEXION DEL HARDWARE Y TRANSMITIR NOTIFICACIONES CON SOKET.IO DEL BACKEND AL FRONTEND
function getMyPets(req, res) {
    var userId = req.user.sub;
    var find = Pet.find({ user: userId })

    var mac='12345678'
    var mqtt = require('mqtt')
    var client = mqtt.connect('mqtt://35.207.54.102')
    client.on('connect', function () {
        client.subscribe(mac+'/RECONNECT',function(err){
            if(!err){
                console.log('Mqtt conectado')
                client.on('message', function (topic, message) {
                    var alerta = message.toString();
                    if(alerta != null){
                        io.on('connection', function(socket){
                            io.sockets.emit('La conexion se ha realizado');
                        })     
                    } 
                    console.log("El dispositivo se reinicio:", alerta);
                    io.sockets.emit('mensajeServidor','El dosificador se ha reiniciado:' + alerta);
                    
                    //client.end() //*****finaliza la conexion con mqtt y termina la ejecucion
                })
            }
        })
        
    });
    
    
    

    find.populate().select({ '__v': 0 }).exec((err, pets) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });
        if (!pets) return res.status(404).send({ message: 'No tienes mascotas registradas' })
        return res.status(200).send({
            pets
        })
        
    })
}


//EDITAR LOS DATOS DE UNA MASCOTA CONCRETA POR EL id
function editPet(req, res) {
    var petId = req.params.id

    Pet.findById(petId, (err, pet) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!pet) return res.status(404).send({ message: 'La mascota no existe' });

        return res.status(200).send({ pet });
    })
}


//ELIMINAR UNA MASCOTA 
function deletePet(req, res) {
    var petId = req.params.id;

    Pet.find({ 'user': req.user.sub, '_id': petId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al borrar la mascota' });

        return res.status(200).send({ message: 'Mascota eliminada correctamente' });
    })
}


//SUBIR IMAGEN DE MASCOTA CON PERMISOS DE USUARIO
function uploadImagen(req, res) {
    var petId = req.params.id; //pasar el id de la mascota por url

    if (req.files) {
        var file_path = req.files.image_pet.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif') {

            Pet.findOne({ 'user': req.user.sub, '_id': petId }).exec((err, check) => {
                if (check) {
                    //Actualizar imagen de mascota
                    Pet.findByIdAndUpdate(petId, { image_pet: file_name }, { new: true }, (err, petUpdate) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });
                        if (!petUpdate) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' })
                        return res.status(200).send({ pet: petUpdate });
                    });
                } else {
                    return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar imagenes');
                }
            })
        } else {
            return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' })
    }
}

//funcion aux para eliminar archivos
function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        res.status(200).send({ message: message });
    });
}

//DEVOLVER LA IMAGEN DE LA MASCOTA
function getImagenFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/pets/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            return res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    })

}


module.exports = {
    savePet,
    updatePet,
    macPet,
    dosificarPet,
    editPet,
    getMyPets,
    uploadImagen,
    getImagenFile,
    deletePet, 
}