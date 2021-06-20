import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppageComponent } from './appage/appage.component';
import { PgpageComponent } from './pgpage/pgpage.component';

const routes: Routes = [
  { path: 'app', component: AppageComponent },
  { path: 'puzzle/:timeLeft', component: PgpageComponent },
  { path: '', redirectTo: '/app', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
