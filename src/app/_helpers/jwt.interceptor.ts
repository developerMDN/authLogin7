import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

/*
Angular Http interceptors le permite interceptar  request desde la app antes de que se envien al backend
se puede usar para modifivcar solicitudes y manejat tambien las respuestas.

se debe implemetar el metodo interceptor() de la interfaz HttpInterceptor el cual es llamado por todos los
request y tiene dos parametros, el current request y el next handler en la cadena.

Se pueden registrar múltiples interceptores para manejar las solicitudes, los interceptores se registran en
la sección de proveedores del módulo Angular. Un interceptor puede devolver una
respuesta directamente cuando pasa el control al siguiente manejador de la cadena llamando
next.handle(request).

El último manejador de la cadena es el HttpBackend que envía la solicitud a
través del navegador al backend.

El Interceptor JWT agrega un encabezado de Autorización HTTP con un token JWT a los encabezados de todas
las solicitudes de usuarios autenticados.
*/
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    /*
        el constructor especifica el AuthenticationService como una dependencia que se inyecta automáticamente 
        por el sistema de Inyección de Dependencia Angular (DI).
     */
    constructor(private authenticationService: AuthenticationService) {}

    /*
    comprueba si el usuario ha iniciado sesión mediante la autenticación authenticationService.currentUserValue 
    y tiene una propiedad de token.

    clona la solicitud y agrega el encabezado de Autorización con el token JWT del usuario actual con 
    el prefijo 'Bearer ' para indicar que es un token del portador (requerido para JWT). El objeto 
    de solicitud es inmutable, por lo que se clona para agregar el encabezado de autenticación.

    pasa la solicitud al siguiente controlador de la cadena llamando a next.handle (request).
    */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Agregar encabezado de autorizacion con jwt token si esta disponible
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}