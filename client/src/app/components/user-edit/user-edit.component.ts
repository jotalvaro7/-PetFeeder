import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css'],
    providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public status: string;
    public url: string;

    constructor(
        private toastr: ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService
    ) {
        this.title = "Actualizar";
        this.user = this._userService.getIdentity(); //me saca el objeto que esta identificado en el localstorage
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
    }

    ngOnInit() {
        console.log('user-edit.component se ha cargado!!')
    }

    onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;
                    //Toastr
                    this.toastr.success('Se han actualizado tus datos correctamente')

                    //subir imagen de usuario          
                    this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image').then((result: any) => {
                        this.user.image = result.user.image;
                        localStorage.setItem('identity', JSON.stringify(this.user))

                    })



                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                    this.toastr.error('No se han actualizado tus datos')
                }
            }
        )
    }

    public filesToUpload: Array<File>;
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }


}

