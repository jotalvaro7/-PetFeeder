import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'welcome',
    templateUrl:'./welcome.component.html', //la vista
    styleUrls:['./welcome.component.css']
})

export class WelcomeComponent implements OnInit{
    public title: string;

    constructor(){
       this.title = "Bienvenido"
    }

    ngOnInit(){
        console.log('welcome.component cargado!!')
    }

    

}