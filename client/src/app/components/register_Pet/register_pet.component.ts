import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Pet} from '../../models/pet';
import {UserService} from '../../services/user.service';
import {PetService} from '../../services/pet.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';
import {ToastrService} from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'
import { isNumber } from 'util';


@Component({
    selector: 'register_pet',
    templateUrl: './register_pet.component.html',
    providers:[UserService, PetService]
})

export class PetRegisterComponent implements OnInit{
    public title:string;
    public url;
    public token;
    public identity;
    public identity_pet;
    public status;
    public pet: Pet;
    public user: User;
    public fecha;
    public horas
    bsConfig:Partial<BsDatepickerConfig>;
    public aux: number;

    constructor(
        private toastr: ToastrService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _petService : PetService
    ){

        this.title = 'Registra tu mascota';
        this.identity = this._userService.getIdentity();
        this.token=this._userService.getToken();
        this.url = GLOBAL.url;
        this.pet = new Pet ("","","","","","","","","","","","","","","","","","","",this.aux,"","",this.identity._id);
        this.bsConfig = Object.assign({},{
            containerClass: 'theme-green',
            showWeekNumbers: false,
            dateInputFormat: "YYYY/MM/DD",
        });
        
    }

    ngOnInit(){
        console.log('componente de register_pet ha sido cargado...')

    }

    onSubmit(form){
        this._petService.addPet(this.token, this.pet).subscribe(
            response => {
                if(response.pet){
                    this.identity_pet = response.pet; //guardar los datos en la variable identity_pet
                    this.pet = response.pet;
                    this.status= 'success';
                    //toastr
                    this.toastr.success('Tu mascota se ha agregado correctamente');
                    form.reset();
                    this._router.navigate(['/home']);
                }else{
                    this.status='error';
                    //toastr
                    this.toastr.warning('El registro no se ha podido completar, verifica bien los campos e intentalo de nuevo');
                }
            },
            error => {
                console.log(<any>error);
                
            }
        );
    }
    


}