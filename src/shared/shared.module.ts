import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { PreLoaderComponent } from './components/pre-loader/pre-loader.component';
import { RatingFormComponent } from './components/rating-form/rating-form.component';
import { ReviewDisplayComponent } from './components/review-display/review-display.component';

const importModules = [
  MaterialModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule
];

const shareComponents = [
  LoaderComponent,
  AlertDialogComponent,
  PreLoaderComponent,
  RatingFormComponent,
  ReviewDisplayComponent
]

@NgModule({
  declarations: [
    LoaderComponent,
    AlertDialogComponent,
    PreLoaderComponent,
    RatingFormComponent,
    ReviewDisplayComponent,
  ],
  imports: [CommonModule, ...importModules],
  exports: [...importModules, ...shareComponents],
})
export class SharedModule {}
