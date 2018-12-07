import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';


@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    providers:[UserService]
})

export class RegisterComponent implements OnInit{
    public title:string;
    public user : User;
    public status : string;

    constructor(
        private toastr: ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
    ){
        this.title = 'Registrate'
        this.user = new User ("",
            "",
            "",
            "",
            "",
            "",
            "");
    }

    ngOnInit(){
        console.log('componente de register cargado...')
    }
   
    onSubmit(form){
        this._userService.register(this.user).subscribe(
            response => {
                if(response.user && response.user._id){
                    this.status= 'success';
                    //toastr
                    this.toastr.success('Registro completado! Porfavor revisa tu e-mail para el link de activacion');
                    form.reset();
                }else{
                    this.status='error';
                    //toastr
                    this.toastr.warning('El registro no ha podido completarse, verifica bien los campos e intentalo de nuevo');
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    ShowSuccess(){
        this.toastr.success('Registro completado correctamente');
    }

    ShowWarning(){
        this.toastr.warning('Registro cancelado');
    }
    
}