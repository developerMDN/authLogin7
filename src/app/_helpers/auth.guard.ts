import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

/*
permite restringir el acceso  a ciertas rutas basadas en reglas perzonalizadas.
en este caso previene que un usuario no autenticado acceda a una ruta implementando la interfaz
CanActivate y definiendo reglas en el método canactivate()
Cuando AuthGuard es adjuntado a una ruta el método canActivate() es llamado x Angular para determinar
si una ruta puede ser activada.
S el usuario esta logueado y el método canActivate() devuelve true, entoces la navegacion es permitida.
*/
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}
/*
los parametros son requerido para implementar la interfaz CanActivate()
*/
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // accede a la propiedad authenticationService.currentUserValue
        const currentUser = this.authenticationService.currentUserValue;
        // el usuario contiene un valor, el usuario esta logueado
        if (currentUser) {

            return true;
        }

        // not logged in so redirect to login page with the return url
        // navega a la ruta del login si el usuario no esta logueado, pasando el parametro returnUrl
        // a la url, para q el usuario pueda ser redireccionado al original request despues del login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}