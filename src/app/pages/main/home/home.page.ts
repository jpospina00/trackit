import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.services';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  logout() {
    this.utilsSvc.logout();
  }

  // ========= Agregar o actualizar un producto =========
  addUpdateProduct() {
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
    });
  }

}
