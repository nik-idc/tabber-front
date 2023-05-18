import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'

const MaterialComponent = [
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
];

@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
