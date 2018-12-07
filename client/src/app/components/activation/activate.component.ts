import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

//aqui

@Component({
    selector: 'activate',
    templateUrl: './activate.component.html',
    providers:[UserService],

    
})

export class ActivateComponent implements OnInit{
    public token : string;
    public user;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService,

     ){
        this.token = this._route.snapshot.params.token;
     }

    ngOnInit(){
        console.log('componente de activacion cargado...')
        this.activation();
    }

    activation(){
        this._userService.activateCount(this.token).subscribe(
            response => {
                this.user = response.user
                this._router.navigate(['/login']);
            }
        )
    }

   

}