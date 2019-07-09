import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
/*
El Interceptor de errores se maneja cuando una solicitud HTTP de la aplicación Angular
 devuelve una respuesta de error. Si el estado de error es 401 Unauthorized , el usuario se 
 desconecta automáticamente; de ​​lo contrario, el mensaje de error se extrae de la respuesta de 
 error HTTP y se lanza para que el componente que inició la solicitud lo detecte y lo muestre.
*/
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}
/*
pasa la solicitud al siguiente controlador de la cadena llamando a next.handle (request) y 
controla los errores canalizando el response observable a través del operador catchError llamando 
a .pipe (catchError ()).
*/
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            /*
            comprueba si el código de estado es 401 y cierra automáticamente la sesión del usuario llamando a 
            this.authenticationService.logout (). Después de cerrar la sesión, la aplicación se vuelve a cargar
             llamando a location.reload (true) que redirige al usuario a la página de inicio de sesión.
            */
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
/*
extrae el mensaje de error del objeto de respuesta de error o, de forma predeterminada, el
    texto de estado de la respuesta si no aparece un mensaje de error (err.error.message || err.statusText).
*/
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}