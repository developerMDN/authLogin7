import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    // muestra u oculta la barra de navegación dependiendo de si esta o no logueado.
    currentUser: any;
    // suscribe al observavble this.authenticationService.currentUser y actualiza a currentUser
    // cuando el usuario log in/out
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    // desloguea al usuario y envia al usuario al log
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}