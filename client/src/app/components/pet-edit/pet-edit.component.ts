import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Pet } from '../../models/pet';
import { PetService } from '../../services/pet.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
//import { MdCardModule, MdInputModule } from '@angular/material';



@Component({
    selector: 'pet-edit',
    templateUrl: './pet-edit.component.html',
    styleUrls: ['./pet-edit.component.css'],
    providers: [PetService, UserService, UploadService]
})

export class PetEditComponent implements OnInit {
    public title: string;
    public url: string;
    public pet;
    public user: User;
    public identity;
    public identity_pet;
    public token;
    public status: string;
    public pet_id: string;
    bsConfig:Partial<BsDatepickerConfig>;



    constructor(
        private toastr: ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _petService: PetService,
        private _uploadService: UploadService,
        private _userService: UserService,
    ) {
        this.title = "Editar datos de tu mascota";
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.pet_id = this._route.snapshot.params.id;
        this._petService.editPet(this.token, this.pet_id).subscribe(
            response => {
                this.pet = response.pet
            }
        ) 
        //Datepicker
        this.bsConfig = Object.assign({},{
            containerClass: 'theme-green',
            showWeekNumbers: false,
            dateInputFormat: "YYYY/MM/DD",
        });
        //Solution Error of undefined:
        if (!this.pet){
            this.pet={}
        }
        
    }

    ngOnInit() {
        console.log('pet-edit.component se ha cargado!!')
    }

    onSubmit() {
        this._petService.updatePet(this.token,this.pet).subscribe(
            response => {
                if (!response.pet) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.identity_pet = this.pet;
                    //Toastr
                    this.toastr.success('Se han actualizado tus datos correctamente')

                    //subir imagen de la mascota  
                    this._uploadService.makeFileRequest(this.url + 'upload-image-pet/' + this.pet._id, [], this.filesToUpload, this.token, 'image_pet').then((result: any) => {
                        this.pet.image_pet = result.pet.image_pet;
                    })
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                    this.toastr.error('No se han actualizado los datos')
                }
            }
        )
    }

    //Metodo para subir una imagen
    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

   


}