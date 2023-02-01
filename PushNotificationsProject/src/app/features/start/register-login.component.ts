import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-login',
    templateUrl: './register-login.component.html',
    styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent {

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar) { }

    readonly apiUrl = 'http://localhost:4000';

    registerForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        login: ['', [Validators.required]],
        password: ['', [Validators.required]],
        password2: ['', [Validators.required]],
    });

    loginForm = this.formBuilder.group({
        login: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });


    async register(): Promise<void> {
        if (this.registerForm.value.password != this.registerForm.value.password2) {
            this._snackBar.open('Niepoprane dane!', 'Ok', {
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        } else {
            fetch(this.apiUrl + '/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.registerForm.value)
            })
                .then(response => response.json())
                .then(id => {
                    console.log(id);
                    this.router.navigate(['/app', id]);
                });
        }
    }

    async login(): Promise<void> {
        fetch(this.apiUrl + `/login?l=${this.loginForm.value.login}&p=${this.loginForm.value.password}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(id => {
                if (id == -1) {
                    this._snackBar.open('Niepoprane dane!', 'Ok', {
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom'
                    });
                }
                else {
                    this.router.navigate(['/app', id]);
                }
            });
    }
}
