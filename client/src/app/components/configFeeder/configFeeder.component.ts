import {Component, OnInit, TemplateRef, Input} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PetService} from '../../services/pet.service'
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector: 'configFeeder',
    templateUrl:'./configFeeder.component.html', //la vista
    styleUrls:['./configFeeder.component.css'],
    providers:[UserService, PetService]
})

export class ConfigFeederComponent implements OnInit{
    public title: string;
    public url: string;
    public token;
    public status: string;
    public pet;
    public user: User;
    public pet_id:string;
   

    constructor(
       private toastr: ToastrService,
       private _route:ActivatedRoute,
       private _router: Router,
       private _userService: UserService,
       private _petService : PetService,
    
    ){
       this.title = "Configure el alimentador de su mascota";
       this.url = GLOBAL.url;
       this.token = this._userService.getToken();
       this.pet_id = this._route.snapshot.params.id;
       this._petService.editPet(this.token, this.pet_id).subscribe(
            response => {
                this.pet = response.pet
            }
        )
        //Solution Error Undefined:
        if (!this.pet){
            this.pet={}
        }

       
    }

    ngOnInit(){
        console.log('configFeeder.component cargado!!')
    }

    onSubmit(){
        this._petService.macPet(this.token,this.pet).subscribe(
            response => {
                if (!response.pet) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    //Toastr
                    this.toastr.success('Se ha registrado la mac del dispositivo correctamente!')    
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                    this.toastr.error('Ups!!, no se ha podido configurar la mac')
                }
            }
        )
    }
        
}