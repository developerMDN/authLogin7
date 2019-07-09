import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    /*
   Los componentes de Angular puede suscribirse (suscribe()) a la propiedad publica currentUser: Observable
   para ser notificados de los cambios y las notificaciones son enviadas cuanando el método 
   this.currentUserSubject.next() es llamado en login() y logout() pasando el argumento a cada suscritor.

   RxJS BehaviorSubject es un tipo especial de Subject q mantiene el valor actual y lo emite a los nuevos 
   suscriptores tan pronto como se suscriben
    */
    private currentUserSubject: BehaviorSubject<any>;
      /*
    RxJS Subjects y Observables son llamados para almacenar el objeto del usuario actual
    y notificar a otros componentes cuando el usuario se loguea o desloguea.
    Las notificaciones son enviadas cuando se invoca this.currentUserSubject.next()
    en login & logout.
     */
    public currentUser: Observable<any>;

    constructor(private http: HttpClient) {
          // inicializar con el objeto user almacenado en localStorage
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        /*  
this.currentUserSubject.asObservable() permite a otrs componentes suscribirse 
al observable currentUser. Esto es para que el inicio y cierre de sesión de la aplicación 
solo se pueda realizar a través del servicio de autenticación.
this.currentUser = this.currentUserSubject.asObservable();
*/
        this.currentUser = this.currentUserSubject.asObservable();
    }
// permite a oros componentes obtener valor de logueo del actual usuario sin suscribirse 
        // al observable currentUser
    public get currentUserValue() {
        return this.currentUserSubject.value;
    }
/*
Envia las credenciales del usuario al API via HTTP POST request para la autenticación.
si es exitoso el objeto user incluye un jwt auth token y se almacana en localStorage para mantener 
al usuario logeado. El objeto user es publicado para todos los suscriptores con la llamada 
this.currentUserSubject.next(user)
 */
    login(username, password) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
       // remueve el objeto del usuario del localStorage y lo fija en null 
        localStorage.removeItem('currentUser');
         // YA NO SUSCRIBE MAS.
        this.currentUserSubject.next(null);
    }
}