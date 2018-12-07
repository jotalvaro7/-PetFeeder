'use strict'

var express = require('express');
var Usercontroller = require('../controllers/user');
var api = express.Router(); //Para tener acceso a los metodos get, post, put, delete
var md_auth = require('../middlewares/Authenticated'); //cargar el middleware de autenticacion
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});


//RUTAS USUARIOS
api.post('/register',Usercontroller.registerUser);
api.post('/login',Usercontroller.loginUser);
api.get('/user/:id',md_auth.ensureAuth,Usercontroller.getUser);
api.put('/update-user/:id',md_auth.ensureAuth,Usercontroller.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],Usercontroller.uploadImage);
api.get('/get-image-user/:imageFile',Usercontroller.getImageFile);
api.put('/activate/:token', Usercontroller.authEmail) // prueba
//***********************************************************************


module.exports = api;

