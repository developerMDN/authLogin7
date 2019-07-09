import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { fakeBackendProvider } from './_helpers';

import { appRoutingModule } from './app.routing';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent
    ],
    providers: [
/*
Los proveedores de Angular le dicen al sistema de inyección de dependencia angular (DI) cómo obtener 
un valor para una dependencia. Los interceptores JWT y Error se enganchan en el canal de solicitud 
HTTP utilizando el token de inyección integrado Angular HTTP_INTERCEPTORS. Angular tiene varios 
tokens de inyección incorporados que le permiten conectarse a diferentes partes del marco y 
los eventos del ciclo de vida de la aplicación. La opción multi: true le dice a Angular que agregue 
el proveedor a la colección de HTTP_INTERCEPTORS en lugar de reemplazar la colección con un solo proveedor, 
esto le permite agregar múltiples interceptores de HTTP al canal de solicitud para manejar diferentes tareas.
    */
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };