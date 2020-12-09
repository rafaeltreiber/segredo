import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EsconderPage } from './esconder.page';

const routes: Routes = [
  {
    path: '',
    component: EsconderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EsconderPageRoutingModule {}
