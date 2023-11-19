import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule} from '@angular/material/paginator'
import {MatSnackBarModule} from '@angular/material/snack-bar'

const materialComponents = [
  MatButtonModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatDialogModule
];

@NgModule({
  declarations: [],
  imports: [...materialComponents],
  exports: [...materialComponents],
})
export class MaterialModule {}
