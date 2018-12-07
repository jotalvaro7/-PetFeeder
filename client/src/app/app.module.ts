import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {ModalModule} from 'ngx-bootstrap/modal'
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule } from '@angular/material';
//Toastr message
import{BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
//timepicker
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
//captcha
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
//socket
import {SocketIoModule,SocketIoConfig} from 'ng-socket-io';
const config: SocketIoConfig = {url: 'http://localhost:8000',options:{}};



//COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent} from './components/login/login.component';
import { RegisterComponent} from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PetRegisterComponent } from './components/register_Pet/register_pet.component';
import { PetEditComponent } from './components/pet-edit/pet-edit.component';
import { ActivateComponent } from './components/activation/activate.component';
import { DosificarComponent } from './components/dosificar-pet/dosificar.component';
import {ConfigFeederComponent} from './components/configFeeder/configFeeder.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    HomeComponent,
    UserEditComponent,
    ProfileComponent,
    PetRegisterComponent,
    PetEditComponent,
    ActivateComponent,
    DosificarComponent,
    ConfigFeederComponent

  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({timeOut:4000}),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgxMaterialTimepickerModule.forRoot(),
    ReactiveFormsModule,
    NgxCaptchaModule,
    MatInputModule, 
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    SocketIoModule.forRoot(config)
    
  ],
  providers: [
    appRoutingProviders,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
