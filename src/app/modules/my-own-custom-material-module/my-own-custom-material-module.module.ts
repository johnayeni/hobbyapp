import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule, MatIconModule} from '@angular/material';


@NgModule({
  imports: [MatToolbarModule, MatIconModule],
  exports: [MatToolbarModule, MatIconModule],
})
export class MyOwnCustomMaterialModuleModule { }
