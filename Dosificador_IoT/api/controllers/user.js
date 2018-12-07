'user strict'
var User = require('../models/user');
//var Pet = require('../models/pet');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var jwt2= require('jsonwebtoken');
var secret = 'harrypotter';
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var nodemailer = require('nodemailer');
var express = require('express');
//var app = express();


//*****************E-mail transporter configuration ************************/
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "petfeeder.iot@gmail.com",         
        pass: "Mascotas123"
    }
});
/************************************************************************* */

//REGISTRAR USUARIOS
function registerUser(req, res){
    var params = req.body;
    var user = new User ();
     if (params.name && params.surname && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.temporarytoken = jwt.createToken(user)
        user.image = null;

        //CONTROLAR USUARIOS DUPLICADOS
        User.find({email:user.email.toLowerCase()}).exec((err,users) => {
            if (err) return res.status(500).send({message:'Error en la peticion de usuarios'});
            if (users && users.length >=1){
                return res.status(200).send({message:'El usuario que intentas registrar ya existe'});
            }else{
                //CIFRA LA PASSWORD DE LOS USUARIO Y GUARDA LOS DATOS
                bcrypt.hash(params.password, null, null, (err,hash) => {
                    user.password = hash;
                    user.save((err,userStored) => {
                        if (err) return res.status(500).send({message: 'Error al guardar el usuario'});
                        if (userStored){
                           console.log('registro con exito')

                            //Aquí envio de email-confirmation
                            var mailOptions = {
                                from: '"IoT Pet Feeder" <petfeeder.iot@gmail.com>',
                                to: user.email,
                                subject: 'Confirm Email',
                                text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the link below to complete your activation: http://localhost:4200/activate/' + user.temporarytoken,
                                html:'Hello<strong> ' + user.name + '</strong>,<br><br> Thank you for registering at IoT Pet Feeder. Please click on the link below to complete your activation:<br></br><a href="http://localhost:4200/activate/' + user.temporarytoken + '">http://localhost:4200/activate/</a>'
                                //html: `Please click this email: <a href= "${url}">${url}</a>`,
                            };
                            
                            // send mail with defined transport object
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    return console.log(error);
                                }else{
                                    console.log('mensaje enviado'+ info.response);
                                }
                                
                            })    
                            //Save the user
                            res.status(200).send({user: userStored});
                            
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }               
                    });
                    
                });
            }
        });
    }else{
    res.status(200).send({
         message: 'Envia todos los campos necesarios!!'
        });
    }
}


function authEmail(req, res){
    User.findOne({temporarytoken: req.params.token}, function(err, user){
        if(err) return res.status(500).send({message:'Error en la peticion'});
        var token = req.params.token;
        console.log('estoy llegando aqui', token)
        console.log(user)

        jwt2.verify(token, secret , function(err,decoded){
            if (err){
                res.json({success: false, message: 'Activation link bad'})
            }else if(!user){
                res.json({success: false, message: 'Activation link bad'})
            }else{
                user.temporarytoken = false;
                user.active = true;
                user.save(function(err,userStored){
                    if (err) return res.status(500).send({message: 'Error al guardar el usuario'});
                    if (userStored){
                        res.status(200).send({user: userStored});
                        //Aquí envio de email informando que la cuenta ha sido activada
                        var mailOptions = {
                            from: '"IoT Pet Feeder" <petfeeder.iot@gmail.com>',
                            to: user.email,
                            subject: 'Account Activated',
                            text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                            html:'Hello<strong> ' + user.name + '</strong>,<br><br> Your account has been successfully activated!'
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                return console.log(error);
                            }else{
                                console.log('mensaje enviado'+ info.response);
                            }
                            
                        })
                        
                    }      
                })
            }
        })
    })
}

//LOGIN DE USUARIOS
function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email:email}, (err, user) => {
        if (err) return res.status(500).send({message:'Error en la peticion'})
        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if (err) return res.status(404).send({message:'Error en la contraseña'})
                if (check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token : jwt.createToken(user)
                        })
                    }else if (!user.active){
                        res.json({success:false, message: 'Esta cuenta no esta activada. Porfavor verifica tu e-mail para el link de activacion.'})
                    }else{
                        //devolver datos de usuario
                        user.password = undefined; //oculta la contraseña
                        return res.status(200).send({message: 'Bienvenido', user})
                    }
                }else{
                    return res.status(404).send({message:'EL usuario no se ha podido identificar'})
                }
            });
        }else{
            return res.status(404).send({message:'El usuario no se ha podido identificar!!'})
        }
    });

    
}

//CONSEGUIR LOS DATOS DE UN USUARIO POR EL id
function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({message:'Error en la peticion'});
        if (!user) return res.status(404).send({message:'El usuario no existe'});

        //user.password = undefined; //opcional
        return res.status(200).send({user});
    })
}

//EDITAR/ACTUALIZAR LOS DATOS DE UN USUARIOS
function updateUser(req,res){
    var userId = req.params.id; //recoger el id de la URL
    var update = req.body;

    //borrar la propiedad password
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'});
    }
    
    User.find({email:update.email.toLowerCase()}).exec((err,users) => {
        if (err) return res.status(500).send({message:'Error en la peticion del usuario'});
        var user_isset = false;
        users.forEach((user) => {
            if(user && user._id != userId) user_isset = true;
        });

        if (user_isset) return res.status(404).send({message:'Los datos ya existen'})

        User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) => {
            if (err) return res.status(500).send({message:'Error en la peticion'});
    
            if (!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'})
    
            return res.status(200).send({user: userUpdate});
        })
    })
    
}

//SUBIR ARCHIVOS DE IMAGEN/AVATAR DE UN USUARIO
function uploadImage(req, res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;

        var file_split = file_path.split('\/');


        var file_name = file_split[2];

        var ext_split = file_name.split('\.');

        var file_ext = ext_split[1];

        if(userId != req.user.sub){
            return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario')
        }

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jepg' || file_ext == 'gif'){
            //Actualizar imagen de usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err,userUpdate) => {
                if (err) return res.status(500).send({message:'Error en la peticion'});

                if (!userUpdate) return res.status(404).send({message: 'No se ha podido actualizar el usuario'})

                return res.status(200).send({user: userUpdate});
            })
        }else{
            return removeFilesOfUploads(res,file_path, 'Extension no valida');
        }

    }else{
        return res.status(200).send({message:'No se han subido imagenes'});
    }
}

//funcion aux para eliminar archivos
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        res.status(200).send({message: message});
    });
}

//DEVOLVER LA IMAGEN DE UN USUARIO
function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;
     fs.exists(path_file, (exists) => {
         if (exists){
             return res.sendFile(path.resolve(path_file));
         }else{
            res.status(200).send({message:'No existe la imagen'});
         }
     }) 

}

//EXPORTAR
module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    uploadImage,
    getImageFile,
    authEmail,
}