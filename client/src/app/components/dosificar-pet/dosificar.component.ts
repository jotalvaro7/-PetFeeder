import {Component, OnInit, TemplateRef, Input, Injectable} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PetService} from '../../services/pet.service'
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Pet } from 'src/app/models/pet';


@Component({
    selector: 'dosificar',
    templateUrl:'./dosificar.component.html', //la vista
    styleUrls:['./dosificar.component.css'],
    providers:[UserService, PetService]
})

@Injectable()
export class DosificarComponent implements OnInit{
    public title: string;
    public url: string;
    public token;
    public status: string;
    public pet;
    public pet_id:string;
    modalRef: BsModalRef;
    bsConfig:Partial<BsDatepickerConfig>;
    public numbers;

    
    raciones = [
        { id: 1, name: "1"},
        { id: 2, name: "2"},
        { id: 3, name: "3"},
        { id: 4, name: "4"},
        { id: 5, name: "5"},
        { id: 6, name: "6"},
        { id: 7, name: "7"},
        { id: 8, name: "8"},
    ];

    public onChange(event): void {  // event will give you full breif of action
        const newVal = event.target.value;
        this.horaComida(newVal, this.pet);
      }
      
    constructor(
       private toastr: ToastrService,
       private _route:ActivatedRoute,
       private _router: Router,
       private _userService: UserService,
       private _petService : PetService,
       private modalService: BsModalService,
       

    ){
       this.title = "Configure la alimentación de su mascota";
       this.url = GLOBAL.url;
       this.token = this._userService.getToken();
       this.pet_id = this._route.snapshot.params.id;
       this._petService.editPet(this.token, this.pet_id).subscribe(
            response => {
                this.pet = response.pet
                this.horaComida(this.pet.shots, this.pet)
            }
        )
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

    ngOnInit(){
        console.log('parametros.component cargado!!') 
    }

    onSubmit(){
        this._petService.dosificarPet(this.token,this.pet, this.numbers).subscribe(
            response => {
                if (!response.pet) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    //Toastr
                    this.toastr.success('Se han guardado los parametros correctamente')        
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
        
    horaComida(valor, pet) {
        valor = parseInt(valor)
        if (pet.hComida1 != null) {
            this.numbers = new Array(valor);
            for (let i = 0; i < valor; i++) {
                switch (i) {
                    case 0:
                        this.numbers[i] = { value: pet.hComida1 }
                        break;
                    case 1:
                        this.numbers[i] = { value: pet.hComida2 };
                        break;
                    case 2:
                        this.numbers[i] = { value: pet.hComida3 };
                        break;
                    case 3:
                        this.numbers[i] = { value: pet.hComida4 };
                        break;
                    case 4:
                        this.numbers[i] = { value: pet.hComida5 };
                        break;
                    case 5:
                        this.numbers[i] = { value: pet.hComida6 };
                        break;
                    case 6:
                        this.numbers[i] = { value: pet.hComida7 };
                        break;
                    case 7:
                        this.numbers[i] = { value: pet.hComida8 };
                        break;
                }

            }
        } else {
            this.numbers = new Array(valor);
            for (let i = 0; i < valor; i++) {
                this.numbers[i] = { value: null }
            }
        }

        /* no se modifica
        valor = parseInt(valor)
        this.numbers = new Array(valor);
        for(let i = 0; i < valor; i++){
            this.numbers[i] = {value: null}
        }
        console.log(this.numbers)
        */
    }

}