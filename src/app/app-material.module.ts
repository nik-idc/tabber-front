import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatListModule } from '@angular/material/list'

const MaterialComponent = [
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule,
  MatListModule,
];

@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
