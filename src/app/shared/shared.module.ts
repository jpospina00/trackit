import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';



@NgModule({
  declarations: [HeaderComponent, CustomInputComponent, LogoComponent,
    AlertComponent, ConfirmDialogComponent, LoadingComponent
  ],
  exports: [HeaderComponent, CustomInputComponent, LogoComponent,
    AlertComponent, ConfirmDialogComponent, LoadingComponent, ReactiveFormsModule
  ],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule, FormsModule
  ]
})
export class SharedModule { }
