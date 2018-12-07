import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

//componentes
import { LoginComponent} from './components/login/login.component';
import { RegisterComponent} from './components/register/register.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {HomeComponent} from './components/home/home.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {ProfileComponent} from './components/profile/profile.component';
import { PetRegisterComponent } from './components/register_Pet/register_pet.component';
import { PetEditComponent } from './components/pet-edit/pet-edit.component';
import {ActivateComponent} from './components/activation/activate.component';
import {DosificarComponent} from './components/dosificar-pet/dosificar.component';
import { ConfigFeederComponent } from './components/configFeeder/configFeeder.component';


const appRoutes: Routes = [
    {path: '', component: WelcomeComponent},
    {path: 'welcome', component: WelcomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'activate/:token', component:ActivateComponent},
    {path: 'my-data', component: UserEditComponent},
    {path: 'profile/:id', component: ProfileComponent},
    {path: 'add-pet', component:PetRegisterComponent},
    {path: 'edit-pet/:id', component:PetEditComponent},
    {path: 'dosificar/:id', component:DosificarComponent},
    {path: 'configFeeder/:id', component:ConfigFeederComponent},
    
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders  = RouterModule.forRoot(appRoutes);