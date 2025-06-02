import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.services';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
  standalone: false
})
export class SuccessPage implements OnInit {

  constructor() { }

  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  goToHome() {
    this.utilsSvc.routerLink('/main/home');
  }

}
