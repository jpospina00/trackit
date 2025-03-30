import { Component, Input, OnInit } from '@angular/core';
import { PurchasedProduct } from 'src/app/models/purchased-product';

@Component({
  selector: 'app-view-order-products',
  templateUrl: './view-order-products.component.html',
  styleUrls: ['./view-order-products.component.scss'],
  standalone: false
})
export class ViewOrderProductsComponent  implements OnInit {

  @Input() product!: PurchasedProduct;
  constructor() { }

  ngOnInit() {}

}
