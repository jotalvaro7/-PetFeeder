import {Component, OnInit, NgModule, ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';



//aqui

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers:[UserService],

    
})

export class LoginComponent implements OnInit{
    public title:string;
    public user : User;
    public status : string;
    public identity;
    public token;
    

    constructor(
        private toastr:ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = "Identificate"
        this.user = new User ("",
            "",
            "",
            "",
            "",
            "",
            "");
  
    }

    ngOnInit(){
        console.log('componente de Login cargado...')
    }

    onSubmit(){
        //loguear al usuario y conseguir sus datos
        this._userService.signUp(this.user).subscribe(
            response => {
                this.status= 'success';
                this.identity = response.user;
                if(!this.identity || !this.identity._id){
                    this.status = 'error';
                }else{
                    this.status='success';
                    //persistir datos del usuario
                    localStorage.setItem('identity', JSON.stringify(this.identity));
                    //Conseguir el token
                    this.getToken();
                }
                   
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null){
                    this.status = 'error';
                    //Mensaje Toastr
                    this.toastr.error('No te has podido identificar correctamente');
                }
            }
        )
    }

    
    getToken(){
        this._userService.signUp(this.user, 'true').subscribe(
            response => {
                this.token = response.token;
                if(this.token.length <= 0){
                    this.status = 'error';
                }else{
                    this.status='success';
                    //mensaje toastr
                    this.toastr.success('Bienvenido')
                    //persistir token del usuario
                    localStorage.setItem('token', this.token);
                
                    //Una vez se loguea el usuario con sus datos, ira a la pagina home
                    //que sera la pagina de trabajo para el usuario
                    this._router.navigate(['/home']);

                }
                   
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null){
                    this.status = 'error';
                }
            }
        )
    }

    
    ShowSuccess(){
        this.toastr.success('Bienvenido');
    }
    
    ShowError(){
        this.toastr.error('error');
    }


}