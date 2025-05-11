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
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';
import { ShoppinCartsComponent } from './components/shoppin-carts/shoppin-carts.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewOrderProductsComponent } from './components/view-order-products/view-order-products.component';
import { NotificationsComponent } from './components/notifications/notifications.component';



@NgModule({
  declarations: [HeaderComponent, CustomInputComponent, LogoComponent,
    AlertComponent, ConfirmDialogComponent, LoadingComponent, AddUpdateProductComponent, ShoppinCartsComponent, ViewOrderProductsComponent, NotificationsComponent
  ],
  exports: [HeaderComponent, CustomInputComponent, LogoComponent,
    AlertComponent, ConfirmDialogComponent, LoadingComponent, ReactiveFormsModule, AddUpdateProductComponent, ShoppinCartsComponent, ViewOrderProductsComponent, NotificationsComponent
  ],
  imports: [
    CommonModule, IonicModule, ReactiveFormsModule, FormsModule, NgxPaginationModule
  ]
})
export class SharedModule { }
