'use strict'

var express = require('express');
var PetController = require('../controllers/pet');
var md_auth = require('../middlewares/Authenticated');
var api = express.Router();


var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/pets' });

//RUTAS MASCOTAS
api.post('/add-pet',md_auth.ensureAuth,PetController.savePet);
api.post('/update-pet/:id',md_auth.ensureAuth,PetController.updatePet);
api.post('/dosificarPet/:id',md_auth.ensureAuth,PetController.dosificarPet);
api.post('/macPet/:id',md_auth.ensureAuth,PetController.macPet);
api.get('/get-my-pets',md_auth.ensureAuth,PetController.getMyPets);
api.get('/edit-pet/:id',md_auth.ensureAuth,PetController.editPet);
api.post('/upload-image-pet/:id',[md_auth.ensureAuth,md_upload],PetController.uploadImagen);
api.get('/get-image-pet/:imageFile',PetController.getImagenFile);
api.delete('/remove-pet/:id',md_auth.ensureAuth,PetController.deletePet);
//********************************************************** */
module.exports = api;