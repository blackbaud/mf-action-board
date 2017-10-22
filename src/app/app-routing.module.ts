import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionItemsComponent } from '../action-items/action-items.component';
import { ConfigScreenComponent } from './config-screen/config-screen.component';

const routes: Routes = [
  {path: 'config', component: ConfigScreenComponent},
  {path: '', component: ActionItemsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
