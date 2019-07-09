import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, AlertService } from '../_services'

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    // dependencias requridas por el componente aut inyectadas por Angular, cuando el componente es creado.
    // Verifivca si el usuario ya esta logieado
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect a home si ya esta logeado
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // obtiene la url del parametro de la ruta o x defecto ´/´
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // acceso a los campos del formulario
    get f() { return this.loginForm.controls; }

    onSubmit() {
        // un intento de envio del formulario.
        // esta propiedad se usa en el login component html para mostrar mensaje de validación
        // solo despues del primer intento de submit
        this.submitted = true;

        // reset a los alerts cuando se envia.
        this.alertService.clear();

        if (this.loginForm.invalid) {
            return;
        }
        // esta propiedad es usada en login component para el spinner y deshabilitar el botón.
        this.loading = true;
        // autenticar al usuario:
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            // desuscribir del observable inmediatamente despues d q el primer valor es emitido.
            .pipe(first())
            // observable y nos suscribimos a la autenticacion
            .subscribe(
                // si es exitoso
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}