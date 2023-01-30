import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './features/main/main.component';
import { RegisterLoginComponent } from './features/start/register-login.component';

const routes: Routes = [
    {
        path: 'start',
        component: RegisterLoginComponent
    },
    {
        path: 'app/:id',
        component: MainComponent
    },
    {
        path: '**',
        redirectTo: 'start',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
