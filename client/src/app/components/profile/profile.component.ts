import{Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';

@Component({
    selector: 'profile',
    templateUrl:'./profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers:[UserService]
})

export class ProfileComponent implements OnInit{
    public title: string;
    public user: User;
    public status: string;
    public identity;
    public token;
    public url: string;
    public stats;

    constructor(
        private _route:ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Mi Perfil';
        this.identity = this._userService.getIdentity;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('profile.component cargado correctamente')
        this.loadPage();
    }

    loadPage(){
        this._route.params.subscribe(params => {
            let id = params['id'];
            this.getUser(id);
        })
    }

    getUser(id){
        this._userService.getUser(id).subscribe(
            response => {
                if(response.user){
                    this.user = response.user;
                }else{
                    this.status= 'error';
                }
            },
            error => {
                console.log(<any>error);
                this._router.navigate(['/perfil', this.identity._id]);

            }
        )
    }
}

