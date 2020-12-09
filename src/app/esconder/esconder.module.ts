import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EsconderPageRoutingModule } from './esconder-routing.module';

import { EsconderPage } from './esconder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EsconderPageRoutingModule
  ],
  declarations: [EsconderPage]
})
export class EsconderPageModule {}
