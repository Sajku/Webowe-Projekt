import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './features/main/main.component';
import { RegisterLoginComponent } from './features/start/register-login.component';


@NgModule({
    declarations: [
        AppComponent,
        RegisterLoginComponent,
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        ServiceWorkerModule.register('/sw-custom.js', {
            registrationStrategy: 'registerWhenStable:3000'
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
