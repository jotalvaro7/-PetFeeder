import {Component, OnInit, TemplateRef, Injectable} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {Pet} from '../../models/pet';
import {ToastrService} from 'ngx-toastr';
import {PetService} from '../../services/pet.service'
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

//socket prueba
import {Socket} from 'ng-socket-io';

@Component({
    selector: 'home',
    templateUrl:'./home.component.html', //la vista
    styleUrls:['./home.component.css'],
    providers:[UserService, PetService]
})

export class HomeComponent implements OnInit{
    public title: string;
    public url: string;
    public token;
    public identity;
    public status: string;
    public pets : Pet[];
    public pet;
    modalRef: BsModalRef;
    
    constructor(
       private toastr: ToastrService,
       private _route:ActivatedRoute,
       private _router: Router,
       private _userService: UserService,
       private _petService : PetService,
       private modalService: BsModalService,
       //
       private socket: Socket,
   
      
    ){
       this.title = "Hello, welcome to my app";
       this.url = GLOBAL.url;
       this.identity = this._userService.getIdentity();
       this.token = this._userService.getToken();

       //LISTEN SOCKET
        /*
       socket.on('mensajeServidor', function(data){
           console.log(data)
           alert(data)
       })
       //*************
       */
      
    }

    ngOnInit(){
        console.log('home.component cargado!!')
        this.getPets();   
        //this.socket.emit('create notification','notification test');
        Notification.requestPermission().then(() => new Notification('Hola mundo!'))
    }
        
    
    getPets(){
        this._petService.getPets(this.token).subscribe(
            response => {
                if(response.pets){
                    this.pets = response.pets
                }else{
                    this.status = 'error';
                }
                
            },
            error => {
                console.log(<any>error);
            }
        )
    }
   

    refresh(event = null){
        this.getPets();
    }

    //Modals/Popup
    openModal(template: TemplateRef<any>){
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    deletePet(id) {
        this._petService.deletePet(this.token, id).subscribe(
            response => {
                this.refresh()
                this.modalRef.hide()
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    decline():void{
        this.modalRef.hide();
    }

    edad(pet: Pet) {
        var fechaNacimiento = new Date(pet.born) //formato ISO
        var diaBorn = fechaNacimiento.getDate();
        var mesBorn = fechaNacimiento.getMonth();
        var añoBorn = fechaNacimiento.getFullYear();

        //prueba (obtener la fecha y hora actual del servidor)
        var fechaActual = new Date(); //formato ISO
        var diaActual = fechaActual.getDate();
        var mesActual = fechaActual.getMonth();
        var añoActual = fechaActual.getFullYear();
        //ifs
        if ((mesActual == 0) || (mesActual == 2) || (mesActual == 4) || (mesActual == 6) || (mesActual == 7) || (mesActual == 9) || (mesActual == 11)) {
            var diasA = 31;
        }
        if ((mesActual == 3) || (mesActual == 5) || (mesActual == 8) || (mesActual == 10)) {
            var diasA = 30;
        }
        if ((mesActual == 1 && (añoActual % 4 == 0) && (añoActual % 100 != 0)) || (añoActual % 400 == 0)) {
            var diasA = 29;
        }
        if (mesActual == 1 && ((añoActual % 4 != 0) || (añoActual % 100 == 0))) {
            var diasA = 28;
        }

        if ((mesBorn == 0) || (mesBorn == 2) || (mesBorn == 4) || (mesBorn == 6) || (mesBorn == 7) || (mesBorn == 9) || (mesBorn == 11)) {
            var diasB = 31;
        }
        if ((mesBorn == 3) || (mesBorn == 5) || (mesBorn == 8) || (mesBorn == 10)) {
            var diasB = 30;
        }
        if ((mesBorn == 1 && (añoBorn % 4 == 0) && (añoBorn % 100 != 0)) || (añoBorn % 400 == 0)) {
            var diasB = 29;
        }
        if (mesBorn == 1 && ((añoBorn % 4 != 0) || (añoBorn % 100 == 0))) {
            var diasB = 28;
        }

        var FirstMonthDiff = diasB - diaBorn + 1;

        if (diaActual - diaBorn < 0) {
            mesActual = mesActual - 1;
            diaActual = diaActual + diasA;
        }

        var daysDiff = diaActual - diaBorn;

        if (mesActual - mesBorn < 0) {
            añoActual = añoActual - 1
            mesActual = mesActual + 12
        }

        var monthDiff = mesActual - mesBorn;
        var yearDiff = añoActual - añoBorn;

        if (daysDiff == diasA) {
            daysDiff = 0;
            monthDiff = monthDiff + 1;

            if (monthDiff == 12) {
                monthDiff = 0;
                yearDiff = yearDiff + 1;
            }
        }

        if ((FirstMonthDiff != diasB) && (diaActual - 1 == diasA)) {
            daysDiff = FirstMonthDiff;
        }

       
        let nuevaEdad = yearDiff + "Y " + monthDiff + "M " + daysDiff + "D"
       
        return nuevaEdad;
    }
    
}