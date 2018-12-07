import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Pet } from '../models/pet';
import { GLOBAL } from './global';


@Injectable()
export class PetService {
    public url: string;
    public identity_pet;


    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addPet(token, pet: Pet): Observable<any> {
        let params = JSON.stringify(pet);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'add-pet', params, { headers: headers });
    }

    getPets(token): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.get(this.url + 'get-my-pets', { headers: headers });
    }

    deletePet(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.delete(this.url + 'remove-pet/' + id, { headers: headers })
    }

    editPet(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'edit-pet/' + id, { headers: headers })

    }

    updatePet(token, pet: Pet): Observable<any> {
        let params = JSON.stringify(pet);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'update-pet/' + pet._id, params, { headers: headers }); //ruta de la api en este caso update-user
    }

    dosificarPet(token, pet: Pet, horas): Observable<any> {
        var hora = horas[0].value
        var racionesActuales = parseInt(pet.shots)
        
        if (racionesActuales < pet.aux){
            pet.aux = racionesActuales //toma el nuevo valor de pet.shots y lo guarda en la base de datos
            for (let i = pet.aux; i < 8; i++) {
                switch (i) {
                    case 0:
                        pet.hComida1 = '';
                        break;
                    case 1:
                        pet.hComida2 = '';
                        break;
                    case 2:
                        pet.hComida3 = '';
                        break;
                    case 3:
                        pet.hComida4 = '';
                        break;
                    case 4:
                        pet.hComida5 = '';
                        break;
                    case 5:
                        pet.hComida6 = '';
                        break;
                    case 6:
                        pet.hComida7 = '';
                        break;
                    case 7:
                        pet.hComida8 = '';
                        break;
                }
            }
        }else{
            for (let i = 0; i < racionesActuales; i++) {
                pet.aux = racionesActuales //toma el nuevo valor de pet.shots y lo guarda en la base de datos
                hora = horas[i].value; 
                switch (i) {
                    case 0:
                        pet.hComida1 = hora;
                        break;
                    case 1:
                        pet.hComida2 = hora;
                        break;
                    case 2:
                        pet.hComida3 = hora;
                        break;
                    case 3:
                        pet.hComida4 = hora;
                        break;
                    case 4:
                        pet.hComida5 = hora;
                        break;
                    case 5:
                        pet.hComida6 = hora;
                        break;
                    case 6:
                        pet.hComida7 = hora;
                        break;
                    case 7:
                        pet.hComida8 = hora;
                        break;
                }
            }
        }
        let join = Object.assign({}, pet, horas);
        let params = JSON.stringify(join);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.post(this.url + 'dosificarPet/' + pet._id, params, { headers: headers });
    }

    macPet(token, pet: Pet): Observable<any> {
        let params = JSON.stringify(pet);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this._http.post(this.url + 'macPet/' + pet._id, params, { headers: headers }); //ruta de la api en este caso update-user
    }

}

